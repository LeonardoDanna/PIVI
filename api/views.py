import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.generic import TemplateView
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

    # Verificar se foi enviado arquivos ou URLs
    clothing_file = request.FILES.get("clothing_image")
    avatar_file = request.FILES.get("avatar_image")
    clothing_url = request.data.get("clothing_image_url")
    avatar_url = request.data.get("avatar_image_url")

    clothing_prompt = request.data.get("clothing_prompt")
    avatar_prompt = request.data.get("avatar_prompt")
    avatar_sex = request.data.get("avatar_sex")  # opcional
    background_prompt = request.data.get("background_prompt")
    background_file = request.FILES.get("background_image")
    background_url = request.data.get("background_image_url")
    seed = request.data.get("seed")

    headers = {
        "x-rapidapi-key": settings.TRY_ON_API_KEY,
        "x-rapidapi-host": settings.TRY_ON_API_HOST,
        # Não coloque “Content-Type” fixo se for multipart — requests cuidará disso
    }

    # Decidir qual endpoint usar
    # Se usou arquivos (FILES), então /try-on-file; caso contrário, /try-on-url
    use_file = (clothing_file is not None) or (avatar_file is not None) or (background_file is not None)

    if use_file:
        url = settings.TRY_ON_BASE_URL + "/try-on-file"
        files = {}
        data = {}

        if clothing_file:
            files["clothing_image"] = (clothing_file.name, clothing_file.read(), clothing_file.content_type)
        if avatar_file:
            files["avatar_image"] = (avatar_file.name, avatar_file.read(), avatar_file.content_type)
        if background_file:
            files["background_image"] = (background_file.name, background_file.read(), background_file.content_type)

        if clothing_prompt:
            data["clothing_prompt"] = clothing_prompt
        if avatar_prompt:
            data["avatar_prompt"] = avatar_prompt
        if avatar_sex:
            data["avatar_sex"] = avatar_sex
        if background_prompt:
            data["background_prompt"] = background_prompt
        if seed is not None:
            data["seed"] = seed

        resp = requests.post(url, headers=headers, files=files, data=data)
    else:
        # usar endpoint URL
        url = settings.TRY_ON_BASE_URL + "/try-on-url"
        payload = {}
        if clothing_url:
            payload["clothing_image_url"] = clothing_url
        if avatar_url:
            payload["avatar_image_url"] = avatar_url
        if background_url:
            payload["background_image_url"] = background_url
        if clothing_prompt:
            payload["clothing_prompt"] = clothing_prompt
        if avatar_prompt:
            payload["avatar_prompt"] = avatar_prompt
        if avatar_sex:
            payload["avatar_sex"] = avatar_sex
        if background_prompt:
            payload["background_prompt"] = background_prompt
        if seed is not None:
            payload["seed"] = seed

        resp = requests.post(url, headers=headers, json=payload)

    # Verificar resposta
    if resp.status_code == 200:
        # imagem retornada como JPEG
        # Retornar o conteúdo da imagem diretamente ao cliente
        # Atenção: Response da DRF, precisamos encapsular adequadamente
        return Response(resp.content, content_type="image/jpeg")
    else:
        # Erro — retornar JSON de erro
        try:
            error_json = resp.json()
        except Exception:
            error_json = {"error": resp.text}
        return Response(error_json, status=resp.status_code)
