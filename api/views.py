from rest_framework.decorators import api_view
from rest_framework.response import Response
from colorthief import ColorThief
import tempfile
import colorsys


# Hello API
@api_view(['GET'])
def hello(request):
    return Response({"message": "API Django funcionando!"})

def rgb_to_hex(rgb):
    return '#%02x%02x%02x' % rgb

def sugerir_cores_para_pele(cor_pele):
    r, g, b = cor_pele
    h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)

    if v > 0.7:
        return ["#003366", "#006400", "#800020"]  
    elif v > 0.4:  
        return ["#FFD700", "#8B4513", "#4682B4"]  
    else: 
        return ["#FF4500", "#32CD32", "#1E90FF"]  

def combinar_cores(cor_base):
    r, g, b = cor_base
    comp = (255-r, 255-g, 255-b)
    return [rgb_to_hex(comp)]

@api_view(["POST"])
def get_colors(request):
    try:
        image = request.FILES["image"]
    except:
        return Response({"error": "Envie uma imagem com o campo 'image'"}, status=400)

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        for chunk in image.chunks():
            tmp.write(chunk)
        tmp.flush()
        color_thief = ColorThief(tmp.name)
        palette = color_thief.get_palette(color_count=6)

    palette_hex = [rgb_to_hex(c) for c in palette]

    cor_predominante = palette[0]
    sugestoes_pele = sugerir_cores_para_pele(cor_predominante)

    combinacoes = {rgb_to_hex(c): combinar_cores(c) for c in palette}

    return Response({
        "palette_rgb": palette,
        "palette_hex": palette_hex,
        "cor_predominante": rgb_to_hex(cor_predominante),
        "sugestoes_para_pele": sugestoes_pele,
        "combinacoes": combinacoes
    })