from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from ..models import ClothingItem
from ..serializers import ClothingItemSerializer

class ClosetItemListCreateView(generics.ListCreateAPIView):
    serializer_class = ClothingItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser] # Necessário para upload de imagem

    def get_queryset(self):
        # Retorna apenas as roupas do usuário logado
        return ClothingItem.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Salva vinculando ao usuário logado
        serializer.save(user=self.request.user)

class ClosetItemDeleteView(generics.DestroyAPIView):
    serializer_class = ClothingItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ClothingItem.objects.filter(user=self.request.user)