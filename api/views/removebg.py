import io, requests
from django.conf import settings
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
from rembg import remove as rembg_remove
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status

def _rembg_bytes(image_bytes: bytes) -> bytes:
    out = rembg_remove(image_bytes)
    img = Image.open(io.BytesIO(out)).convert("RGBA")
    buf = io.BytesIO(); img.save(buf, format="PNG", optimize=True)
    return buf.getvalue()

@method_decorator(csrf_exempt, name="dispatch")
class RemoveBackgroundView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        f = request.FILES.get("image")
        if not f:
            return Response({"error": "Nenhuma imagem enviada."}, status=400)
        raw = f.read()

        api_key = getattr(settings, "REMOVE_BG_API_KEY", None)
        if api_key:
            try:
                resp = requests.post(
                    "https://api.remove.bg/v1.0/removebg",
                    headers={"X-Api-Key": api_key},
                    files={"image_file": (f.name, raw, f.content_type)},
                    data={"size": "auto", "type": "auto"},
                    timeout=60,
                )
                if resp.status_code == 200 and resp.content:
                    return HttpResponse(resp.content, content_type="image/png")
                if resp.status_code in (402, 401, 403, 429):
                    png = _rembg_bytes(raw)
                    return HttpResponse(png, content_type="image/png")
                # fallback genérico
                png = _rembg_bytes(raw)
                return HttpResponse(png, content_type="image/png")
            except Exception:
                png = _rembg_bytes(raw)
                return HttpResponse(png, content_type="image/png")
        # sem chave → local direto
        png = _rembg_bytes(raw)
        return HttpResponse(png, content_type="image/png")

@method_decorator(csrf_exempt, name="dispatch")
class RemoveBackgroundLocalView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        f = request.FILES.get("image")
        if not f:
            return Response({"error": "Nenhuma imagem enviada."}, status=400)
        png = _rembg_bytes(f.read())
        return HttpResponse(png, content_type="image/png")
