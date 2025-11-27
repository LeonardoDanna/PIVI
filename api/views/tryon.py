import requests, logging
from django.conf import settings
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response
from api.utils.images import prepare_avatar_for_studio, resize_image

logger = logging.getLogger(__name__)

# =========================================================================
# PROMPTS DE ESTÚDIO COM FOCO EM PRESERVAÇÃO
# =========================================================================

# O sufixo garante a qualidade, mas não interfere na descrição da peça
STUDIO_SUFFIX = ", photorealistic, 8k, studio lighting, white background, high quality"

PROMPTS_BY_TYPE = {
    # --- TOPS (Troca o Tronco, Mantém as Pernas) ---
    "t-shirt": "a high quality cotton t-shirt" + STUDIO_SUFFIX,
    "shirt": "a crisp button-down shirt" + STUDIO_SUFFIX,
    "blouse": "an elegant blouse" + STUDIO_SUFFIX,
    "sweatshirt": "a thick sweatshirt" + STUDIO_SUFFIX,
    "jacket": "a stylish jacket" + STUDIO_SUFFIX,
    "dress": "a beautiful dress" + STUDIO_SUFFIX, # Dress troca tudo (é peça única)

    # --- BOTTOMS (Troca as Pernas, Mantém o Tronco) ---
    "pants": "stylish trousers or jeans" + STUDIO_SUFFIX,
    "shorts": "casual shorts" + STUDIO_SUFFIX,
    "skirt": "a fashion skirt" + STUDIO_SUFFIX,

    # --- FEET (Troca os Pés, Mantém o Resto) ---
    "sneakers": "stylish sneakers shoes" + STUDIO_SUFFIX,
    "boots": "leather boots" + STUDIO_SUFFIX,
    "shoes": "formal shoes" + STUDIO_SUFFIX,
    "sandals": "sandals" + STUDIO_SUFFIX,

    # --- HEAD (Troca a Cabeça, Mantém o Corpo) ---
    "cap": "a baseball cap" + STUDIO_SUFFIX,
    "hat": "a stylish hat" + STUDIO_SUFFIX,
    "glasses": "sunglasses" + STUDIO_SUFFIX,

    "generic": "clothing item" + STUDIO_SUFFIX
}

# O Negativo impede que a IA mude o rosto ou o corpo fora da área da roupa
NEGATIVE_PROMPT = "change of face, change of body shape, distorted body, ugly, extra limbs, missing limbs, text, watermark, cartoon, painting"

def _params(quality, clothing_type, seed):
    ctype = str(clothing_type).lower().strip()

    # --- MAPEAMENTO CRÍTICO DE CATEGORIA ---
    # Isso define ONDE a IA vai mexer.
    # se for 'lower_body', ela protege o tronco.
    # se for 'upper_body', ela protege as pernas.
    
    category_map = "upper_body" # Padrão para Tops, Chapéus, Óculos
    
    if ctype in ['pants', 'shorts', 'skirt', 'sneakers', 'boots', 'shoes', 'sandals']:
        category_map = "lower_body"
    elif ctype == 'dress':
        category_map = "dresses"
    
    selected_prompt = PROMPTS_BY_TYPE.get(ctype, PROMPTS_BY_TYPE["generic"])

    return {
        "clothing_prompt": selected_prompt,
        "negative_prompt": NEGATIVE_PROMPT,
        "category": category_map, 
        "seed": int(seed) if seed else -1,
        "guidance_scale": 2.5, # Baixo para ser fiel à imagem original
        "num_inference_steps": 30,
        # Estes parâmetros são cruciais para NÃO mudar o rosto/corpo
        "preserve_face": True,
        "preserve_body": True,
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

        url = f"{settings.TRY_ON_BASE_URL}/try-on-file"
        headers = {"X-RapidAPI-Key": settings.TRY_ON_API_KEY, "X-RapidAPI-Host": settings.TRY_ON_API_HOST}
        
        params = _params(quality, clothing_type, seed)

        logger.info(f"TRY-ON | Tipo: {clothing_type} | Categoria-Alvo: {params['category']}")

        try:
            files = {}
            
            if avatar_file:
                # IMPORTANTE: Usamos prepare_avatar_for_studio para limpar o fundo,
                # mas mantemos a pessoa intacta.
                try:
                    # Se quiser testar SEM remover fundo primeiro para ver se preserva melhor o original:
                    # files["avatar_image"] = resize_image(avatar_file) 
                    
                    # Se quiser COM fundo branco limpo (recomendado para estúdio):
                    files["avatar_image"] = prepare_avatar_for_studio(avatar_file)
                except:
                    files["avatar_image"] = resize_image(avatar_file)
            
            if clothing_file:
                files["clothing_image"] = resize_image(clothing_file)

            if not files:
                return Response({"error": "Imagens ausentes"}, status=400)

            resp = requests.post(url, headers=headers, files=files, data=params, timeout=120)

            if resp.status_code == 200:
                try:
                    return Response(resp.json(), status=200)
                except:
                    return HttpResponse(resp.content, content_type="image/png")
            
            print(f"ERRO API ({resp.status_code}): {resp.text}")
            return Response({"error": "Erro na IA", "details": resp.text}, status=resp.status_code)

        except Exception as e:
            logger.exception(f"Erro interno: {e}")
            return Response({"error": "Erro interno", "details": str(e)}, status=500)