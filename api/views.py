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

class FrontendAppView(TemplateView):
    template_name = "index.html"

@api_view(["GET"])
def hello(request):
    return Response({"message": "API Django funcionando!"})

def _resize_image(file, max_size=(768, 1024)):
    try:
        img = Image.open(file).convert("RGB")
        img = ImageOps.exif_transpose(img)
        img.thumbnail(max_size, Image.LANCZOS)
        img = ImageEnhance.Brightness(img).enhance(1.05)
        img = ImageEnhance.Contrast(img).enhance(1.08)
        img = ImageEnhance.Color(img).enhance(1.05)
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=96, optimize=True)
        buffer.seek(0)
        return (file.name, buffer.read(), "image/jpeg")
    except Exception:
        file.seek(0)
        return (file.name, file.read(), file.content_type)

def _enhance_output(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = ImageOps.autocontrast(img, cutoff=2)
        img = ImageEnhance.Brightness(img).enhance(1.02)
        img = ImageEnhance.Contrast(img).enhance(1.08)
        img = ImageEnhance.Color(img).enhance(1.04)
        img = ImageEnhance.Sharpness(img).enhance(1.1)
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=97, optimize=True)
        return buffer.getvalue()
    except Exception:
        return image_bytes

def _generate_mask_from_clothing(cleaned_file):
    try:
        img = Image.open(io.BytesIO(cleaned_file)).convert("RGBA")
        alpha = img.split()[-1]
        mask = alpha.point(lambda p: 255 if p > 10 else 0).convert("L")
        buffer = io.BytesIO()
        mask.save(buffer, format="PNG", optimize=True)
        buffer.seek(0)
        return ("mask_image.png", buffer.read(), "image/png")
    except Exception:
        return None

@api_view(["POST"])
def try_on_diffusion(request):
    avatar_file = request.FILES.get("avatar_image")
    clothing_file = request.FILES.get("clothing_image")
    background_file = request.FILES.get("background_image")

    avatar_url = request.data.get("avatar_image_url")
    clothing_url = request.data.get("clothing_image_url")
    background_url = request.data.get("background_image_url")

    clothing_type = (request.data.get("clothing_type") or "").lower()
    quality = request.data.get("quality", "standard")
    seed = request.data.get("seed")

    use_file = any([avatar_file, clothing_file, background_file])
    url = (
        f"{settings.TRY_ON_BASE_URL}/try-on-file"
        if use_file
        else f"{settings.TRY_ON_BASE_URL}/try-on"
    )

    headers = {
        "X-RapidAPI-Key": settings.TRY_ON_API_KEY,
        "X-RapidAPI-Host": settings.TRY_ON_API_HOST,
    }

    # ---------------- PROMPTS ----------------
    PROMPTS_BY_TYPE = {
        "pants": (
            "make the person wear the provided pants naturally on the lower body only, "
            "keep the entire person (face, body, pose, lighting, upper clothing, background) exactly the same, "
            "only modify the pants region (waist to feet), "
            "preserve the original texture, proportions, and light direction, "
            "no changes to the shirt, skin, or environment."
        ),
        "shorts": (
            "make the person wear the provided shorts on the lower body only, "
            "keep the entire person unchanged above the waist, "
            "preserve the lighting and pose exactly, realistic shadows and folds."
        ),
        "skirt": (
            "make the person wear the provided skirt realistically, "
            "preserve face, torso, pose, lighting, and background exactly, "
            "only replace clothing between waist and knees, photorealistic texture."
        ),
        "shirt": (
            "make the person wear the provided shirt or blouse naturally, "
            "keep face, hair, lower clothing, and background identical, "
            "only replace upper clothing region, realistic sleeves and collar."
        ),
        "jacket": (
            "make the person wear the provided jacket naturally, "
            "preserve all other parts of the person unchanged, "
            "only modify torso region, realistic fabric and folds."
        ),
        "dress": (
            "make the person wear the provided dress naturally, "
            "preserve face, hair, pose, and lighting unchanged, "
            "only modify clothing region, realistic fit and texture."
        ),
        "generic": (
            "apply the clothing naturally on the person, "
            "preserve the entire original image (face, body, lighting, and background), "
            "only replace the clothing region realistically with high detail."
        ),
    }

    NEGATIVE_PROMPT = (
        "change of shirt, altered torso, new outfit, face modification, "
        "body resculpting, extra limbs, lighting change, overpainting, "
        "background replacement, unrealistic texture, blur, artifacts"
    )

    clothing_prompt = PROMPTS_BY_TYPE.get(clothing_type, PROMPTS_BY_TYPE["generic"])
    avatar_prompt = (
        "full body studio photo, natural pose, realistic proportions, "
        "sharp lighting, neutral expression, professional fashion photo"
    )
    background_prompt = (
        "neutral white or gray seamless background, soft light, no gradient, no shadows"
    )

    params = {
        "clothing_prompt": clothing_prompt,
        "negative_prompt": NEGATIVE_PROMPT,
        "avatar_prompt": avatar_prompt,
        "background_prompt": background_prompt,
        "preserve_face": True,
        "preserve_body": True,
        "preserve_background": True,
        "apply_mask": True,
        "mask_mode": "clothing_only",
        "seed": seed,
    }

    if quality == "high":
        params.update({"steps": 60, "guidance_scale": 7.5})
    elif quality == "ultra":
        params.update({"steps": 75, "guidance_scale": 7.2, "enhance": True})
    else:
        params.update({"steps": 45, "guidance_scale": 7.8})

    logger.info("=" * 60)
    logger.info(f"TRY-ON iniciado ({clothing_type or 'generic'})")
    logger.info(f"Qualidade: {quality}")
    logger.info(f"Endpoint: {url}")
    logger.info("Prompts usados:")
    logger.info(f"  • Clothing: {clothing_prompt}")
    logger.info(f"  • Negative: {NEGATIVE_PROMPT}")
    logger.info("=" * 60)

    try:
        if use_file:
            files = {}

            if avatar_file:
                files["avatar_image"] = _resize_image(avatar_file)

            mask_tuple = None
            if clothing_file:
                cleaned_name, cleaned_bytes, cleaned_type = _resize_image(clothing_file)

                if clothing_type in ["pants", "shorts", "skirt"]:
                    mask_tuple = _generate_mask_from_clothing(cleaned_bytes)
                    if mask_tuple:
                        files["mask_image"] = mask_tuple
                        params["apply_mask"] = True
                        params["mask_mode"] = "clothing_only"

                files["clothing_image"] = (cleaned_name, cleaned_bytes, cleaned_type)

            if background_file:
                files["background_image"] = _resize_image(background_file)

            resp = requests.post(url, headers=headers, files=files, data=params, timeout=150)

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

        content_type = resp.headers.get("Content-Type", "").lower()
        logger.info(f"Resposta recebida ({resp.status_code}) — {content_type}")

        if resp.status_code == 200:
            if "image" in content_type or "octet-stream" in content_type:
                enhanced = _enhance_output(resp.content)
                return HttpResponse(enhanced, content_type="image/jpeg")

            if "application/json" in content_type:
                return Response(resp.json(), status=200)

            return Response(
                {"warning": "Tipo de resposta inesperado", "content_type": content_type},
                status=200,
            )

        try:
            err = resp.json()
        except Exception:
            err = {"raw": resp.text}

        return Response(
            {"error": "Falha na API externa", "details": err},
            status=resp.status_code,
        )

    except requests.exceptions.Timeout:
        return Response(
            {"error": "Tempo limite excedido na comunicação com a API externa."},
            status=status.HTTP_504_GATEWAY_TIMEOUT,
        )

    except Exception as e:
        logger.exception(f"Erro interno no servidor: {e}")
        return Response(
            {"error": "Erro interno no servidor Django", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@csrf_exempt
@api_view(["POST"])
def remove_background(request):
    image_file = request.FILES.get("image")
    if not image_file:
        return Response({"error": "Nenhuma imagem enviada."}, status=400)
    headers = {"X-Api-Key": settings.REMOVE_BG_API_KEY}
    files = {"image_file": (image_file.name, image_file.read(), image_file.content_type)}
    try:
        resp = requests.post("https://api.remove.bg/v1.0/removebg", headers=headers, files=files, data={"size": "auto", "type": "auto"}, timeout=60)
        if resp.status_code != 200:
            return Response({"error": "Falha ao remover fundo.", "details": resp.text}, status=resp.status_code)
        return HttpResponse(resp.content, content_type="image/png")
    except Exception as e:
        return Response({"error": "Erro interno ao processar imagem.", "details": str(e)}, status=500)
