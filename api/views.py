import io
import logging
import requests
from PIL import Image, ImageEnhance, ImageOps

from django.conf import settings
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger(__name__)


# ---------- FRONTEND ----------
class FrontendAppView(TemplateView):
    template_name = "index.html"


# ---------- HELLO ----------
@api_view(["GET"])
def hello(request):
    return Response({"message": "API Django funcionando!"})


# ---------- UTILS ----------
def _resize_image(file, max_size=(768, 1024)):
    """Redimensiona e otimiza imagem antes do envio."""
    try:
        img = Image.open(file).convert("RGB")
        img = ImageOps.exif_transpose(img)
        img.thumbnail(max_size, Image.LANCZOS)
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=95, optimize=True)
        buffer.seek(0)
        return (file.name, buffer.read(), "image/jpeg")
    except Exception:
        file.seek(0)
        return (file.name, file.read(), file.content_type)


def _enhance_output(image_bytes):
    """Aumenta nitidez, contraste e cor da imagem retornada."""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = ImageEnhance.Sharpness(img).enhance(1.8)
        img = ImageEnhance.Contrast(img).enhance(1.2)
        img = ImageEnhance.Color(img).enhance(1.1)
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=95)
        return buffer.getvalue()
    except Exception as e:
        logger.warning(f"Falha ao melhorar imagem: {e}")
        return image_bytes


# ---------- TRY-ON ----------
@api_view(["POST"])
def try_on_diffusion(request):
    """
    Recebe avatar e roupa (arquivos ou URLs),
    envia para API Try-On Diffusion,
    retorna imagem aprimorada.
    """

    avatar_file = request.FILES.get("avatar_image")
    clothing_file = request.FILES.get("clothing_image")
    background_file = request.FILES.get("background_image")

    avatar_url = request.data.get("avatar_image_url")
    clothing_url = request.data.get("clothing_image_url")
    background_url = request.data.get("background_image_url")

    clothing_prompt = request.data.get("clothing_prompt")
    avatar_prompt = request.data.get("avatar_prompt")
    background_prompt = request.data.get("background_prompt")
    avatar_sex = request.data.get("avatar_sex")
    seed = request.data.get("seed")
    quality = request.data.get("quality", "standard")

    use_file = any([avatar_file, clothing_file, background_file])

    # ---------- ENDPOINT ----------
    url = (
        f"{settings.TRY_ON_BASE_URL}/try-on-file"
        if use_file
        else f"{settings.TRY_ON_BASE_URL}/try-on"
    )

    headers = {
        "X-RapidAPI-Key": settings.TRY_ON_API_KEY,
        "X-RapidAPI-Host": settings.TRY_ON_API_HOST,
    }

    # ---------- PROMPTS AUTOMÁTICOS ----------
    clothing_prompt = clothing_prompt or "ultra realistic fashion photo, detailed fabric texture, realistic lighting, 4k resolution"
    avatar_prompt = avatar_prompt or "studio portrait full body, soft natural light, sharp details, professional lighting"
    background_prompt = background_prompt or "plain white studio background, balanced light"

    # ---------- PARÂMETROS DE QUALIDADE ----------
    params = {
        "clothing_prompt": clothing_prompt,
        "avatar_prompt": avatar_prompt,
        "background_prompt": background_prompt,
        "avatar_sex": avatar_sex,
        "seed": seed,
    }

    if quality == "high":
        params.update({"steps": 60, "guidance_scale": 8.5})
    elif quality == "ultra":
        params.update({"steps": 75, "guidance_scale": 9.0, "enhance": True})
    else:
        params.update({"steps": 40, "guidance_scale": 7.5})

    try:
        # ---------- ARQUIVOS ----------
        if use_file:
            files = {}

            if avatar_file:
                files["avatar_image"] = _resize_image(avatar_file)
            if clothing_file:
                files["clothing_image"] = _resize_image(clothing_file)
            if background_file:
                files["background_image"] = _resize_image(background_file)

            resp = requests.post(
                url, headers=headers, files=files, data=params, timeout=150
            )

        # ---------- URLs ----------
        else:
            if not (avatar_url and clothing_url):
                return Response(
                    {"error": "Envie avatar_image_url e clothing_image_url ou arquivos válidos."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            payload = {
                **params,
                "avatar_image_url": avatar_url,
                "clothing_image_url": clothing_url,
            }
            if background_url:
                payload["background_image_url"] = background_url

            headers["Content-Type"] = "application/json"
            resp = requests.post(url, headers=headers, json=payload, timeout=150)

        # ---------- RESPOSTA ----------
        content_type = resp.headers.get("Content-Type", "").lower()

        if resp.status_code == 200:
            if "image" in content_type or "octet-stream" in content_type:
                enhanced = _enhance_output(resp.content)
                return HttpResponse(enhanced, content_type="image/jpeg")

            if "application/json" in content_type:
                return Response(resp.json(), status=200)

            logger.warning(f"Tipo de resposta inesperado: {content_type}")
            return Response(
                {"warning": "Tipo de resposta inesperado", "content_type": content_type},
                status=200,
            )

        # ---------- ERRO ----------
        try:
            err = resp.json()
        except Exception:
            err = {"raw": resp.text}

        logger.error(f"Erro da API externa ({resp.status_code}): {err}")
        return Response(
            {"error": "Falha na API externa", "details": err},
            status=resp.status_code,
        )

    except requests.exceptions.Timeout:
        logger.error("⏱ Timeout na API externa Try-On Diffusion.")
        return Response(
            {"error": "Tempo limite excedido na comunicação com a API externa."},
            status=status.HTTP_504_GATEWAY_TIMEOUT,
        )

    except BrokenPipeError:
        logger.warning("⚠️ Cliente desconectou antes da resposta.")
        return HttpResponse(status=499)

    except Exception as e:
        logger.exception(f"❌ Erro interno no servidor: {e}")
        return Response(
            {"error": "Erro interno no servidor Django", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

# ---------- REMOVE BACKGROUND ----------
@csrf_exempt
@api_view(["POST"])
def remove_background(request):
    """Remove o fundo usando a API remove.bg."""
    image_file = request.FILES.get("image")
    if not image_file:
        return Response({"error": "Nenhuma imagem enviada."}, status=400)

    headers = {"X-Api-Key": settings.REMOVE_BG_API_KEY}
    files = {"image_file": (image_file.name, image_file.read(), image_file.content_type)}

    try:
        resp = requests.post(
            "https://api.remove.bg/v1.0/removebg",
            headers=headers,
            files=files,
            data={"size": "auto", "type": "auto"},
            timeout=60,
        )

        if resp.status_code != 200:
            return Response(
                {"error": "Falha ao remover fundo.", "details": resp.text},
                status=resp.status_code,
            )

        return HttpResponse(resp.content, content_type="image/png")

    except Exception as e:
        return Response(
            {"error": "Erro interno ao processar imagem.", "details": str(e)}, status=500
        )
