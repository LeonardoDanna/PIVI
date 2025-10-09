import logging
import requests

from django.conf import settings
from django.http import HttpResponse
from django.views.generic import TemplateView

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger(__name__)


# ---------- Frontend SPA ----------
class FrontendAppView(TemplateView):
    template_name = "index.html"


# ---------- Sanity check ----------
@api_view(["GET"])
def hello(request):
    return Response({"message": "API Django funcionando!"})


# ---------- Helpers ----------
def _get_file(req, *names):
    """Retorna o primeiro arquivo encontrado em request.FILES dado um conjunto de chaves possíveis."""
    for n in names:
        f = req.FILES.get(n)
        if f:
            return f
    return None


def _get_data(req, *names):
    """Retorna o primeiro valor 'truthy' encontrado em request.data dado um conjunto de chaves possíveis."""
    for n in names:
        v = req.data.get(n)
        if v:
            return v
    return None


# ---------- Try-On ----------
@api_view(["POST"])
def try_on_diffusion(request):
    """
    Recebe do frontend:
      - avatar_image / clothing_image (arquivos)
      - avatar_image_url / clothing_image_url (URLs)
    Envia para a API TexelModa (Try-On Diffusion)
    Retorna a imagem gerada (ou JSON em caso de erro).
    """

    import requests
    import logging
    from django.http import HttpResponse
    from rest_framework.response import Response
    from rest_framework import status
    from django.conf import settings

    logger = logging.getLogger(__name__)

    # === Entrada ===
    avatar_file = request.FILES.get("avatar_image")
    clothing_file = request.FILES.get("clothing_image")
    avatar_url = request.data.get("avatar_image_url")
    clothing_url = request.data.get("clothing_image_url")

    background_file = request.FILES.get("background_image")
    background_url = request.data.get("background_image_url")

    clothing_prompt = request.data.get("clothing_prompt")
    avatar_prompt = request.data.get("avatar_prompt")
    avatar_sex = request.data.get("avatar_sex")
    background_prompt = request.data.get("background_prompt")
    seed = request.data.get("seed")

    # === Headers e endpoint ===
    if use_file:
        url = f"{settings.TRY_ON_BASE_URL}/try-on-file"
    else:
        url = f"{settings.TRY_ON_BASE_URL}/try-on-url"

    headers = {
        "X-RapidAPI-Key": settings.TRY_ON_API_KEY,
        "X-RapidAPI-Host": settings.TRY_ON_API_HOST,
    }

    # Detecta se é upload de arquivo ou uso de URL
    use_file = any([avatar_file, clothing_file, background_file])

    try:
        if use_file:
            # ---------- UPLOAD DE ARQUIVOS ----------
            files, data = {}, {}

            if avatar_file:
                files["avatar_image"] = (
                    avatar_file.name,
                    avatar_file.read(),
                    avatar_file.content_type,
                )

            if clothing_file:
                files["clothing_image"] = (
                    clothing_file.name,
                    clothing_file.read(),
                    clothing_file.content_type,
                )

            if background_file:
                files["background_image"] = (
                    background_file.name,
                    background_file.read(),
                    background_file.content_type,
                )

            for k, v in {
                "clothing_prompt": clothing_prompt,
                "avatar_prompt": avatar_prompt,
                "avatar_sex": avatar_sex,
                "background_prompt": background_prompt,
                "seed": seed,
            }.items():
                if v:
                    data[k] = v

            resp = requests.post(
                url, headers=headers, files=files, data=data, timeout=120
            )

        else:
            # ---------- ENVIO VIA URL ----------
            if not (avatar_url and clothing_url):
                return Response(
                    {
                        "error": "É necessário enviar avatar_image_url e clothing_image_url ou arquivos válidos."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            payload = {
                k: v
                for k, v in {
                    "avatar_image_url": avatar_url,
                    "clothing_image_url": clothing_url,
                    "background_image_url": background_url,
                    "clothing_prompt": clothing_prompt,
                    "avatar_prompt": avatar_prompt,
                    "avatar_sex": avatar_sex,
                    "background_prompt": background_prompt,
                    "seed": seed,
                }.items()
                if v is not None
            }

            headers["Content-Type"] = "application/json"

            resp = requests.post(
                url, headers=headers, json=payload, timeout=120
            )

        # ---------- TRATA RESPOSTA ----------
        content_type = resp.headers.get("Content-Type", "").lower()

        if resp.status_code == 200:
            # Caso seja imagem
            if "image" in content_type or "octet-stream" in content_type:
                return HttpResponse(resp.content, content_type=content_type)

            # Caso seja JSON (às vezes API retorna link/base64)
            if "application/json" in content_type:
                return Response(resp.json(), status=200)

            # Tipo inesperado
            logger.warning(f"Tipo de resposta inesperado: {content_type}")
            return Response(
                {"warning": "Tipo de resposta inesperado", "content_type": content_type},
                status=200,
            )

        # Se a API respondeu com erro
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
        logger.error("⏱ Timeout na requisição à API Try-On Diffusion.")
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
