import requests, logging
from django.conf import settings
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response
from rest_framework import status

# Importa as funções (mantemos a importação, mas vamos usar resize por enquanto)
from api.utils.images import prepare_avatar_for_studio, resize_image

logger = logging.getLogger(__name__)

# ... (MANTENHA AS CONSTANTES STUDIO_BASE E PROMPTS_BY_TYPE IGUAIS) ...
# Vou resumir aqui para não ficar gigante, mas você DEVE manter o dicionário PROMPTS_BY_TYPE
# que te passei na resposta anterior.

STUDIO_BASE = ", wearing the item, photorealistic, 8k, studio lighting, pure white background, seamless, no shadows, no distracting elements, realistic fabric texture, perfectly fitted, high fashion editorial style, sharp focus"

PROMPTS_BY_TYPE = {
    "t-shirt": "upper body, a high quality cotton t-shirt, casual style, short sleeves" + STUDIO_BASE,
    "shirt": "upper body, a crisp button-down collared shirt, formal style" + STUDIO_BASE,
    "blouse": "upper body, an elegant feminine blouse, flowing fabric" + STUDIO_BASE,
    "sweatshirt": "upper body, a thick comfortable sweatshirt, hoodie or crewneck" + STUDIO_BASE,
    "jacket": "upper body, a stylish jacket or coat, structured fabric" + STUDIO_BASE,
    "dress": "full body, a beautiful dress, one-piece garment, elegant flow" + STUDIO_BASE,
    "pants": "lower body, stylish trousers or jeans, perfectly fitted legs" + STUDIO_BASE,
    "shorts": "lower body, casual shorts, summer style, above knees" + STUDIO_BASE,
    "skirt": "lower body, a fashion skirt, feminine style" + STUDIO_BASE,
    "sneakers": "feet, stylish sneakers, athletic shoes, detailed laces and sole" + STUDIO_BASE,
    "boots": "feet, leather or suede boots, sturdy footwear" + STUDIO_BASE,
    "shoes": "feet, formal leather shoes or loafers, shiny texture" + STUDIO_BASE,
    "sandals": "feet, open footwear, sandals, strappy details" + STUDIO_BASE,
    "cap": "head, a baseball cap with visor, streetwear accessory" + STUDIO_BASE,
    "hat": "head, a stylish hat, fashion accessory" + STUDIO_BASE,
    "glasses": "face, stylish sunglasses or eyewear, reflective lenses" + STUDIO_BASE,
    "generic": "clothing item, high quality fashion item" + STUDIO_BASE
}

NEGATIVE_PROMPT = "change of clothing, altered torso, item not transferred, distorted body, extra arms, missing limbs, artifacts, blur, low quality, duplicate, bad fit, wrinkled clothing, dark shadows, colored background, distracting background, text, watermark, painting, cartoon"

def _params(quality, clothing_type, seed):
    ctype = str(clothing_type).lower().strip()
    
    # Mapeamento
    category_map = "upper_body"
    if ctype in ['pants', 'shorts', 'skirt', 'sneakers', 'boots', 'shoes', 'sandals']:
        category_map = "lower_body"
    elif ctype == 'dress':
        category_map = "dresses"
    
    selected_prompt = PROMPTS_BY_TYPE.get(ctype, PROMPTS_BY_TYPE["generic"])

    return {
        "clothing_prompt": selected_prompt,
        "negative_prompt": NEGATIVE_PROMPT,
        "category": category_map, 
        "seed": seed,
        "guidance_scale": 2.5,
        "num_inference_steps": 30,
    }

@method_decorator(csrf_exempt, name="dispatch")
class TryOnDiffusionView(APIView):
    parser_classes = [MultiPartParser, JSONParser]

    def post(self, request):
        avatar_file = request.FILES.get("avatar_image")
        clothing_file = request.FILES.get("clothing_image")
        
        clothing_type = (request.data.get("category") or "generic").lower() 
        quality = request.data.get("quality", "standard")
        seed = request.data.get("seed", -1)

        # URL e Headers
        url = f"{settings.TRY_ON_BASE_URL}/try-on-file"
        headers = {"X-RapidAPI-Key": settings.TRY_ON_API_KEY, "X-RapidAPI-Host": settings.TRY_ON_API_HOST}
        
        params = _params(quality, clothing_type, seed)

        logger.info(f"TRY-ON REQUEST | Tipo: {clothing_type} | Map: {params['category']}")

        try:
            files = {}
            
            if avatar_file:
                # --- ALTERAÇÃO DE DEBUG ---
                # Vamos enviar apenas redimensionado por enquanto para testar se o erro é o rembg
                # print("Processando avatar para estúdio...")
                # files["avatar_image"] = prepare_avatar_for_studio(avatar_file)
                
                # Usa resize simples (mais seguro para teste)
                files["avatar_image"] = resize_image(avatar_file)
            
            if clothing_file:
                files["clothing_image"] = resize_image(clothing_file)

            if not files:
                return Response({"error": "Nenhuma imagem recebida"}, status=400)

            # Envia
            print("Enviando para API externa...") # Debug no terminal
            resp = requests.post(url, headers=headers, files=files, data=params, timeout=120)

            if resp.status_code == 200:
                try:
                    return Response(resp.json(), status=200)
                except:
                    return HttpResponse(resp.content, content_type="image/png")
            
            # --- DEBUG DO ERRO ---
            # Isso vai aparecer no seu terminal do VS Code
            print(f"❌ ERRO API EXTERNA ({resp.status_code}): {resp.text}")
            
            return Response({"error": "Falha na API externa", "details": resp.json() if resp.status_code == 400 else resp.text}, status=resp.status_code)

        except Exception as e:
            logger.exception(f"Erro interno: {e}")
            return Response({"error": "Erro interno no servidor", "details": str(e)}, status=500)