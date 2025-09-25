from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.generic import TemplateView

#Front End - VIEW
class FrontendAppView(TemplateView):
    template_name = "index.html"

# Hello API
@api_view(['GET'])
def hello(request):
    return Response({"message": "API Django funcionando!"})