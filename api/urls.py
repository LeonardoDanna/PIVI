from django.urls import path
from .views import try_on_diffusion
from . import views

urlpatterns = [
    path("try-on-diffusion/", try_on_diffusion, name="try_on_diffusion"),
]
