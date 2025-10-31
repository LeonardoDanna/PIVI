from django.urls import path
from .views import TryOnDiffusionView, RemoveBackgroundView, RemoveBackgroundLocalView, hello

urlpatterns = [
    path("try-on-diffusion/", TryOnDiffusionView.as_view(), name="try_on_diffusion"),
    path("remove-background/", RemoveBackgroundView.as_view(), name="remove_background"),
    path("remove-background-local/", RemoveBackgroundLocalView.as_view(), name="remove_background_local"),
    path("hello/", hello, name="hello"),
]
