# api/models.py
from django.db import models
from django.contrib.auth.models import User

class ClothingItem(models.Model):
    CATEGORY_CHOICES = [
        ('head', 'Cabeça/Acessórios'),
        ('top', 'Tronco'),
        ('bottom', 'Pernas'),
        ('feet', 'Pés'),
    ]

    # Adicione esta lista de opções
    SUBCATEGORY_CHOICES = [
        # Cabeça
        ('cap', 'Boné'),
        ('hat', 'Chapéu'),
        ('beanie', 'Gorro'),
        ('glasses', 'Óculos'),
        # Tronco
        ('t-shirt', 'Camiseta'),
        ('shirt', 'Camisa Social'),
        ('sweatshirt', 'Moletom/Suéter'),
        ('jacket', 'Jaqueta/Casaco'),
        ('blouse', 'Blusa'),
        ('dress', 'Vestido'),
        # Pernas
        ('pants', 'Calça'),
        ('shorts', 'Shorts/Bermuda'),
        ('skirt', 'Saia'),
        # Pés
        ('sneakers', 'Tênis'),
        ('boots', 'Bota'),
        ('shoes', 'Sapato Social'),
        ('sandals', 'Sandália'),
        # Outros
        ('other', 'Outro'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clothing_items')
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    
    # --- NOVO CAMPO ---
    subcategory = models.CharField(max_length=20, choices=SUBCATEGORY_CHOICES, default='other')
    # ------------------

    size = models.CharField(max_length=10, blank=True, null=True)
    color = models.CharField(max_length=7, default="#000000")
    image = models.ImageField(upload_to='closet_images/')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.subcategory})"