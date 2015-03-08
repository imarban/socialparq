from django.conf.urls import patterns, url
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import TemplateView

from perfilador.views import CreateUserView
from socialparq.views import ZonaParqsView, PoligonoZonaView, EquipoZonaView, PoligonoCoordenadaView


urlpatterns = patterns('',
                       # Examples:
                       # url(r'^$', 'repositorio.views.home', name='home'),
                       # url(r'^blog/', include('blog.urls')),

                       # url(r'^admin/', include(admin.site.urls)),
                       url(r'^poligonos/$', TemplateView.as_view(template_name="socialparq/poligonos.html")),
                       # url(r'^migrate$', migrate),
                       url(r'^zonas$', ZonaParqsView.as_view(), name="zonas"),
                       url(r'^poligono-zona$', PoligonoZonaView.as_view(), name="poligono_zona"),
                       url(r'^equipos-zona$', EquipoZonaView.as_view(), name="equipos_zona"),
                       url(r'^poligono-coordenada$', PoligonoCoordenadaView.as_view(), name="poligono_coordenada"),
                       url(r'^registro/$', csrf_exempt((CreateUserView.as_view())), name="register"),


                       url(r'^$', TemplateView.as_view(template_name="socialparq/index.html"))
)
