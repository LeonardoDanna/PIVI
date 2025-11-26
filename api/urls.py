from django.urls import path
from .views import TryOnDiffusionView, RemoveBackgroundView, RemoveBackgroundLocalView, hello
from .views.closet import ClosetItemListCreateView, ClosetItemDeleteView
from .auth_views import register, login
from .token import get_csrf_token

urlpatterns = [
    path("try-on-diffusion/", TryOnDiffusionView.as_view(), name="try_on_diffusion"),
    path("remove-background/", RemoveBackgroundView.as_view(), name="remove_background"),
    path("remove-background-local/", RemoveBackgroundLocalView.as_view(), name="remove_background_local"),
    path("hello/", hello, name="hello"),
    path("register/", register, name="register"),
    path("login/", login, name="login"),
    path("csrf/", get_csrf_token, name="csrf"),
    path('closet/', ClosetItemListCreateView.as_view(), name='closet-list-create'),
    path('closet/<int:pk>/', ClosetItemDeleteView.as_view(), name='closet-delete'),
]
