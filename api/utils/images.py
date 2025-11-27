from PIL import Image
from rembg import remove
import io

def prepare_avatar_for_studio(image_file):
    """
    1. Remove o fundo da imagem original.
    2. Coloca um fundo branco sólido.
    3. Retorna a imagem pronta para o Try-On.
    """
    try:
        # Abre a imagem enviada
        input_image = Image.open(image_file)
        
        # 1. Remove o fundo (fica transparente)
        no_bg_image = remove(input_image)
        
        # 2. Cria uma nova imagem branca do mesmo tamanho
        white_bg = Image.new("RGB", no_bg_image.size, (255, 255, 255))
        
        # 3. Cola a pessoa recortada em cima do fundo branco
        # Usamos a própria imagem sem fundo como máscara de transparência
        white_bg.paste(no_bg_image, (0, 0), no_bg_image)
        
        # 4. Prepara para devolver como arquivo
        output = io.BytesIO()
        white_bg.save(output, format='JPEG', quality=95)
        output.seek(0)
        
        # Retorna: (nome_do_arquivo, bytes, content_type)
        return ("avatar_studio.jpg", output.getvalue(), "image/jpeg")
    except Exception as e:
        print(f"Erro ao preparar avatar: {e}")
        # Se der erro (ex: imagem corrompida), retorna o original redimensionado
        return resize_image(image_file)

def resize_image(image_file, max_size=(1024, 1024)):
    """Função auxiliar simples para redimensionar se necessário"""
    try:
        img = Image.open(image_file)
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        output = io.BytesIO()
        # Se tiver transparência, converte pra RGB antes de salvar como JPEG
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        img.save(output, format='JPEG', quality=90)
        output.seek(0)
        return (image_file.name, output.getvalue(), "image/jpeg")
    except Exception as e:
        # Em caso de erro, retorna o arquivo original sem processar (fallback)
        image_file.seek(0)
        return (image_file.name, image_file.read(), "image/jpeg")

def enhance_output(image_bytes):
    """
    Recebe os bytes da imagem gerada pela IA e pode aplicar melhorias.
    Por enquanto, retornamos a imagem original, mas a função precisa existir.
    """
    return image_bytes

def gen_mask_from_clothing(clothing_bytes):
    """
    Função placeholder para geração de máscaras manuais.
    O modelo IDM-VTON faz isso automaticamente na maioria dos casos.
    """
    return None