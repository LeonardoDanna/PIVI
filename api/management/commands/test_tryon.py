from django.core.management.base import BaseCommand
import requests
from django.conf import settings

class Command(BaseCommand):
    help = "Testa a API Try-On Diffusion externamente"

    def handle(self, *args, **options):
        url = settings.TRY_ON_BASE_URL + "/try-on-url"
        headers = {
            "x-rapidapi-key": settings.TRY_ON_API_KEY,
            "x-rapidapi-host": settings.TRY_ON_API_HOST,
        }
        payload = {
            "clothing_image_url": "https://http2.mlstatic.com/D_NQ_NP_2X_960984-MLB84765956585_052025-F-vestido-longo-de-linho-forrado-com-lacinho-no-ombro-bojo.webp",
            "avatar_image_url": "https://http2.mlstatic.com/D_NQ_NP_2X_723616-MLB89592120524_082025-F-vestido-feminino-curto-tubinho-alfaiataria-elegante-fashion.webp",
            "clothing_prompt": "a pink dress",
            "avatar_prompt": "a person standing",
        }
        resp = requests.post(url, headers=headers, json=payload, timeout=30)
        print("Status:", resp.status_code)
        if resp.status_code == 200:
            with open("saida_tryon.jpg", "wb") as f:
                f.write(resp.content)
            print("Imagem salva como saida_tryon.jpg")
        else:
            print("Erro:", resp.text)
