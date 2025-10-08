import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.generic import TemplateView
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status

#Front End - VIEW
class FrontendAppView(TemplateView):
    template_name = "index.html"

# Hello API
@api_view(['GET'])
def hello(request):
    return Response({"message": "API Django funcionando!"})

@api_view(["POST"])
def try_on_diffusion(request):
    """
    Recebe do frontend: avatar_image (arquivo ou URL), clothing_image (arquivo ou URL),
    prompts opcionais. Retorna a imagem resultante gerada.
    """

    clothing_file = request.FILES.get("clothing_image")
    avatar_file = request.FILES.get("avatar_image")
    clothing_url = request.data.get("clothing_image_url")
    avatar_url = request.data.get("avatar_image_url")

    clothing_prompt = request.data.get("clothing_prompt")
    avatar_prompt = request.data.get("avatar_prompt")
    avatar_sex = request.data.get("avatar_sex")
    background_prompt = request.data.get("background_prompt")
    background_file = request.FILES.get("background_image")
    background_url = request.data.get("background_image_url")
    seed = request.data.get("seed")

    headers = {
        "x-rapidapi-key": settings.TRY_ON_API_KEY,
        "x-rapidapi-host": settings.TRY_ON_API_HOST,
    }

    # Decide se usa arquivos (multipart) ou URLs (JSON)
    use_file = any([clothing_file, avatar_file, background_file])

    try:
        if use_file:
            url = settings.TRY_ON_BASE_URL + "/try-on-file"
            files, data = {}, {}

            if clothing_file:
                files["clothing_image"] = (
                    clothing_file.name,
                    clothing_file.read(),
                    clothing_file.content_type,
                )
            if avatar_file:
                files["avatar_image"] = (
                    avatar_file.name,
                    avatar_file.read(),
                    avatar_file.content_type,
                )
            if background_file:
                files["background_image"] = (
                    background_file.name,
                    background_file.read(),
                    background_file.content_type,
                )

            for key, val in {
                "clothing_prompt": clothing_prompt,
                "avatar_prompt": avatar_prompt,
                "avatar_sex": avatar_sex,
                "background_prompt": background_prompt,
                "seed": seed,
            }.items():
                if val:
                    data[key] = val

            resp = requests.post(url, headers=headers, files=files, data=data, timeout=120)

        else:
            url = settings.TRY_ON_BASE_URL + "/try-on-url"
            payload = {
                k: v
                for k, v in {
                    "clothing_image_url": clothing_url,
                    "avatar_image_url": avatar_url,
                    "background_image_url": background_url,
                    "clothing_prompt": clothing_prompt,
                    "avatar_prompt": avatar_prompt,
                    "avatar_sex": avatar_sex,
                    "background_prompt": background_prompt,
                    "seed": seed,
                }.items()
                if v is not None
            }

            resp = requests.post(url, headers=headers, json=payload, timeout=120)

        # 🔍 Trata o retorno corretamente
        content_type = resp.headers.get("Content-Type", "").lower()

        if resp.status_code == 200:
            # Caso venha imagem binária (jpeg/png)
            if "image" in content_type or "octet-stream" in content_type:
                return HttpResponse(resp.content, content_type=content_type)

            # Caso venha JSON (alguns endpoints retornam JSON com link)
            elif "application/json" in content_type:
                return Response(resp.json(), status=200)

            # Caso inesperado
            else:
                return Response(
                    {
                        "warning": "Resposta inesperada da API",
                        "content_type": content_type,
                    },
                    status=200,
                )

        # Se não for 200, tenta decodificar o erro
        try:
            error_json = resp.json()
        except Exception:
            error_json = {"error": resp.text}

        return Response(error_json, status=resp.status_code)

    except Exception as e:
        return Response(
            {"error": "Erro interno no servidor Django", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
