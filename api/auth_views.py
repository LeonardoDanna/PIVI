from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login as django_login
from .serializers import RegisterSerializer



@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Usuário registrado com sucesso!"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Preencha usuário e senha"}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Credenciais inválidas"}, status=400)

    django_login(request, user)

    return Response({"message": "Login bem sucedido!", "user": username})