import google.generativeai as genai
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import ClothingItem

# Configura o Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_with_stylist(request):
    user_message = request.data.get('message', '')
    
    # 1. Busca as roupas do usuário no banco
    items = ClothingItem.objects.filter(user=request.user)
    
    if not items.exists():
        return Response({"reply": "Seu armário está vazio! Adicione algumas roupas primeiro para que eu possa te ajudar."})

    # 2. Formata o "Inventário" para a IA ler
    closet_description = "O usuário possui as seguintes roupas no armário:\n"
    for item in items:
        closet_description += f"- {item.name} (Tipo: {item.get_category_display()}, Cor: {item.color})\n"

    # 3. Cria o Prompt do Sistema (A "Personalidade" da IA)
    system_instruction = f"""
    Você é um Personal Stylist de alto nível, especialista em moda e colorimetria.
    Seu objetivo é sugerir looks baseados APENAS nas roupas que o usuário tem no armário.
    
    {closet_description}
    
    REGRAS:
    1. Sugira um look completo (Parte de cima, baixo e calçado) usando os itens da lista acima.
    2. Explique por que as peças combinam (cor, estilo, ocasião).
    3. Seja simpático, curto e direto. Use emojis.
    4. Se o usuário pedir algo que não tem no armário, sugira a melhor alternativa disponível.
    """

    try:
        # 4. Chama o Gemini
        model = genai.GenerativeModel("gemini-2.0-flash")
        chat = model.start_chat(history=[
            {"role": "user", "parts": system_instruction}
        ])
        
        response = chat.send_message(user_message)
        
        return Response({"reply": response.text})
    
    except Exception as e:
        print(f"Erro na IA: {e}")
        return Response({"reply": "Desculpe, meu cérebro fashion deu um nó. Tente novamente!"}, status=500)