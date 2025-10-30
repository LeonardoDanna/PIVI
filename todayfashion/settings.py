"""
Django settings for todayfashion project.
"""

import os
from pathlib import Path

# ==============================
# CAMINHOS
# ==============================
BASE_DIR = Path(__file__).resolve().parent.parent

# ==============================
# CONFIGURAÇÃO DA API TRY-ON DIFFUSION
# ==============================
TRY_ON_BASE_URL = "https://try-on-diffusion.p.rapidapi.com"
TRY_ON_API_KEY = "fcca3320dfmsh03d10c1b184eb0fp19e3d8jsn2411cc31418c"
TRY_ON_API_HOST = "try-on-diffusion.p.rapidapi.com"

# ==============================
# CONFIGURAÇÃO DA API REMOVE.BG
# ==============================
REMOVE_BG_API_KEY = "UAb4wYmaY2rvN7TXdkTTdbnh"

# ==============================
# SEGURANÇA E DEPLOY
# ==============================
SECRET_KEY = "django-insecure-)h45be994pz^ki+8-6_t#ta*)^by18vadjkh0qvi^)bi8xpqkg"
DEBUG = True
ALLOWED_HOSTS = ["*"]  # durante o desenvolvimento

# ==============================
# APLICAÇÕES
# ==============================
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "api",
]

# ==============================
# MIDDLEWARE
# ==============================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # 🔥 deve vir antes de CommonMiddleware
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # 👇 Mantemos CSRF ativo, mas rotas específicas são csrf_exempt
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ==============================
# CORS E CSRF (para conexão com React local)
# ==============================

# 🔥 Opção segura e moderna: restrita aos domínios locais do React
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://localhost:5173",
    "http://127.0.0.1:5173",
    "https://127.0.0.1:5173",
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True

# 🔧 Permitir cabeçalhos usados pelo React
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# Métodos aceitos
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

# 🔐 Domínios confiáveis para CSRF (igual ao CORS)
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "https://localhost:5173",
    "http://127.0.0.1:5173",
    "https://127.0.0.1:5173",
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000",
]

# ⚙️ Cookies e CSRF em ambiente local
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_HTTPONLY = False
CSRF_USE_SESSIONS = False

# ==============================
# URLs E TEMPLATES
# ==============================
ROOT_URLCONF = "todayfashion.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "frontend" / "dist"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "todayfashion.wsgi.application"

# ==============================
# BANCO DE DADOS
# ==============================
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ==============================
# AUTENTICAÇÃO
# ==============================
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ==============================
# INTERNACIONALIZAÇÃO
# ==============================
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

# ==============================
# ARQUIVOS ESTÁTICOS
# ==============================
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "frontend" / "dist"]

# ==============================
# PADRÕES
# ==============================
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
