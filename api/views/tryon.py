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

import requests, logging
from django.conf import settings
# ... (outros imports) ...

logger = logging.getLogger(__name__)

# =========================================================================
# 1. PROMPTS ANCORADOS POR CATEGORIA E ESTILO DE ESTÚDIO
# =========================================================================

# Prompt base para o estilo de foto profissional (foco no fundo e iluminação)
BASE_STYLE_PROMPT = ", photorealistic image, high-quality, studio white background, seamless, no shadows, no distracting elements, realistic fabric texture, perfectly fitted, high fashion editorial style"

# Dicionário agora inclui a CATEGORIA específica para ancorar a IA
PROMPTS_BY_TYPE = {
    # Roupas de Cima
    "t-shirt": "A high-quality photo of the uploaded **T-SHIRT** transferred to the model" + BASE_STYLE_PROMPT,
    "shirt": "A high-quality photo of the uploaded **COLLARED SHIRT** transferred to the model" + BASE_STYLE_PROMPT,
    "blouse": "A high-quality photo of the uploaded **BLOUSE** transferred to the model" + BASE_STYLE_PROMPT,
    "sweatshirt": "A high-quality photo of the uploaded **SWEATSHIRT/SWEATER** transferred to the model" + BASE_STYLE_PROMPT,
    "jacket": "A high-quality photo of the uploaded **JACKET/COAT** transferred to the model" + BASE_STYLE_PROMPT,
    
    # Roupas de Baixo
    "pants": "A high-quality photo of the uploaded **PANTS/TROUSERS** transferred to the model" + BASE_STYLE_PROMPT,
    "shorts": "A high-quality photo of the uploaded **SHORTS** transferred to the model" + BASE_STYLE_PROMPT,
    "skirt": "A high-quality photo of the uploaded **SKIRT** transferred to the model" + BASE_STYLE_PROMPT,
    
    # Peça Única
    "dress": "A high-quality photo of the uploaded **DRESS** transferred to the model" + BASE_STYLE_PROMPT,

    # Padrão de segurança (caso o tipo seja desconhecido)
    "generic": "A high-quality photo of the uploaded **CLOTHING ITEM** transferred to the model" + BASE_STYLE_PROMPT 
}

# Negative prompt para evitar erros de renderização e ruídos de fundo
NEGATIVE_PROMPT = "change of clothing, altered torso, item not transferred, distorted body, extra arms, missing limbs, artifacts, blur, low quality, duplicate, bad fit, wrinkled clothing, dark shadows, colored background, distracting background, text, watermark"

def _params(quality, clothing_type, seed):
    # A variável clothing_type agora virá do front-end (t-shirt, pants, etc.)
    base = {
        # Usa o prompt ancornado pela categoria:
        "clothing_prompt": PROMPTS_BY_TYPE.get(clothing_type, PROMPTS_BY_TYPE["generic"]), 
        "negative_prompt": NEGATIVE_PROMPT,
        
        # O prompt do avatar continua focado no modelo limpo:
        "avatar_prompt": "full body studio photo, professional model pose, clear sharp face, realistic skin texture",
        
        # O prompt do background reforça o fundo branco e sem costuras:
        "background_prompt": "neutral white or gray seamless background, professional studio setup",
        
        "preserve_face": True, "preserve_body": True, "preserve_background": True,
        "apply_mask": True, "mask_mode": "clothing_only", "seed": seed,
    }
    # ... (o resto da função _params permanece igual) ...
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