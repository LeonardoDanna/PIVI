from django.contrib import admin
from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static
from api.views import FrontendAppView

# 1. Rotas principais (Admin e API)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# 2. Configuração de Arquivos Estáticos e Mídia (EM DESENVOLVIMENTO)
# Isso precisa vir ANTES da rota do front-end, senão o front-end "engole" a requisição da imagem.
if settings.DEBUG:
    # Serve arquivos JS/CSS do Vite
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0]
    )
    # Serve arquivos de Upload (Imagens do Closet)
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )

# 3. Rota "Pega-Tudo" do Front-end (React)
# Ela deve ser OBRIGATORIAMENTE a última. Se nada acima der match (nem admin, nem api, nem imagem),
# manda pro React.
urlpatterns += [
    re_path(r'.*', FrontendAppView.as_view(), name="frontend"),
]