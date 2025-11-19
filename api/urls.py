from django.urls import path
from .views import try_on_diffusion, remove_background, hello
from .auth_views import register, login

urlpatterns = [
    path("try-on-diffusion/", try_on_diffusion, name="try_on_diffusion"),
    path("remove-background/", remove_background, name="remove_background"),
    path("register/", register),
    path("login/", login),
    path("hello/", hello, name="hello"),
]
