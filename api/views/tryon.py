import requests, logging
from django.conf import settings
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from api.utils.images import resize_image, enhance_output, gen_mask_from_clothing

logger = logging.getLogger(__name__)

PROMPTS_BY_TYPE = {
    "pants": "...",
    "shorts": "...",
    "skirt": "...",
    "shirt": "...",
    "jacket": "...",
    "dress": "...",
    "generic": "...",
}
NEGATIVE_PROMPT = "change of shirt, altered torso, ..."

def _params(quality, clothing_type, seed):
    base = {
        "clothing_prompt": PROMPTS_BY_TYPE.get(clothing_type, PROMPTS_BY_TYPE["generic"]),
        "negative_prompt": NEGATIVE_PROMPT,
        "avatar_prompt": "full body studio photo, ...",
        "background_prompt": "neutral white or gray seamless background, ...",
        "preserve_face": True, "preserve_body": True, "preserve_background": True,
        "apply_mask": True, "mask_mode": "clothing_only", "seed": seed,
    }
    if quality == "high":
        base.update({"steps": 60, "guidance_scale": 7.5})
    elif quality == "ultra":
        base.update({"steps": 75, "guidance_scale": 7.2, "enhance": True})
    else:
        base.update({"steps": 45, "guidance_scale": 7.8})
    return base

@method_decorator(csrf_exempt, name="dispatch")
class TryOnDiffusionView(APIView):
    parser_classes = [MultiPartParser, JSONParser]

    def post(self, request):
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
        url = f"{settings.TRY_ON_BASE_URL}/try-on-file" if use_file else f"{settings.TRY_ON_BASE_URL}/try-on"
        headers = {"X-RapidAPI-Key": settings.TRY_ON_API_KEY, "X-RapidAPI-Host": settings.TRY_ON_API_HOST}
        params = _params(quality, clothing_type, seed)

        logger.info(f"TRY-ON {clothing_type or 'generic'} | q={quality} | endpoint={url}")

        try:
            if use_file:
                files = {}
                if avatar_file: files["avatar_image"] = resize_image(avatar_file)

                mask_tuple = None
                if clothing_file:
                    name, bytes_, ctype = resize_image(clothing_file)
                    if clothing_type in ["pants", "shorts", "skirt"]:
                        mask_tuple = gen_mask_from_clothing(bytes_)
                        if mask_tuple:
                            files["mask_image"] = mask_tuple
                            params["apply_mask"] = True; params["mask_mode"] = "clothing_only"
                    files["clothing_image"] = (name, bytes_, ctype)

                if background_file: files["background_image"] = resize_image(background_file)

                resp = requests.post(url, headers=headers, files=files, data=params, timeout=150)
            else:
                if not (avatar_url and clothing_url):
                    return Response({"error": "Envie avatar_image_url e clothing_image_url ou arquivos válidos."}, status=400)
                payload = {**params, "avatar_image_url": avatar_url, "clothing_image_url": clothing_url}
                if background_url: payload["background_image_url"] = background_url
                headers["Content-Type"] = "application/json"
                resp = requests.post(url, headers=headers, json=payload, timeout=150)

            ctype = resp.headers.get("Content-Type", "").lower()
            if resp.status_code == 200:
                if "image" in ctype or "octet-stream" in ctype:
                    enhanced = enhance_output(resp.content)
                    return HttpResponse(enhanced, content_type="image/jpeg")
                if "application/json" in ctype:
                    return Response(resp.json(), status=200)
                return Response({"warning": "Tipo de resposta inesperado", "content_type": ctype}, status=200)

            # erro
            try:
                err = resp.json()
            except Exception:
                err = {"raw": resp.text}
            return Response({"error": "Falha na API externa", "details": err}, status=resp.status_code)

        except requests.exceptions.Timeout:
            return Response({"error": "Tempo limite excedido na comunicação com a API externa."}, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except Exception as e:
            logger.exception(f"Erro interno: {e}")
            return Response({"error": "Erro interno no servidor Django", "details": str(e)}, status=500)
