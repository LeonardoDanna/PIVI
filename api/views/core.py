from django.views.generic import TemplateView
from rest_framework.response import Response
from rest_framework.decorators import api_view

class FrontendAppView(TemplateView):
    template_name = "index.html"

@api_view(["GET"])
def hello(request):
    return Response({"message": "API Django funcionando!"})
