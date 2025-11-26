from django.db import models
from django.contrib.auth.models import User

class ClothingItem(models.Model):
    CATEGORY_CHOICES = [
        ('head', 'Cabeça/Acessórios'),
        ('top', 'Tronco'),
        ('bottom', 'Pernas'),
        ('feet', 'Pés'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clothing_items')
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    size = models.CharField(max_length=10, blank=True, null=True)
    color = models.CharField(max_length=7, default="#000000") # Hex code
    image = models.ImageField(upload_to='closet_images/') # Salva imagens enviadas
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"