from django.http.response import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views.generic.base import TemplateView
from mongoengine.errors import DoesNotExist
import geometry
from socialparq.models import ZonaParquimetro


class JSONResponseMixin(object):
    def render_to_json_response(self, context, **response_kwargs):
        return JsonResponse(context, **response_kwargs)


class JsonView(JSONResponseMixin, TemplateView):
    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)


class ZonaParqsView(JsonView):
    def get_context_data(self, **kwargs):
        context = {'zonas': []}

        for zona in ZonaParquimetro.objects:
            context['zonas'].append({'id': str(zona.pk), 'nombre': zona.nombre})

        return context


class PoligonoZonaView(JsonView):
    def get_context_data(self, **kwargs):
        zona_id = self.request.GET.get('zona', '')
        if not zona_id:
            return {}
        try:
            zona = ZonaParquimetro.objects.get(pk=zona_id)
        except DoesNotExist:
            return {}

        context = {'puntos': []}

        for point in zona.area['coordinates']:
            context['puntos'].append({'latitud': point[1], 'longitud': point[0]})

        return context


class EquipoZonaView(JsonView):
    def get_context_data(self, **kwargs):
        zona_id = self.request.GET.get('zona', '')
        if not zona_id:
            return {}
        try:
            zona = ZonaParquimetro.objects.get(pk=zona_id)
        except DoesNotExist:
            return {}

        context = {'puntos': []}

        for point in zona.lista_equipos:
            context['puntos'].append({'latitud': point[1], 'longitud': point[0]})

        return context


class PoligonoCoordenadaView(JsonView):
    def get_context_data(self, **kwargs):
        latitud = self.request.GET.get('latitud', '')
        longitud = self.request.GET.get('longitud', '')
        if not longitud or not latitud:
            return {}

        latitud, longitud = float(latitud), float(longitud)
        zona_encontrada = None
        context = {}

        for zona in ZonaParquimetro.objects:
            poligono = zona.area['coordinates']
            if geometry.point_in_poly(longitud, latitud, poligono) or geometry.point_on_border(longitud, latitud,
                                                                                               poligono):
                zona_encontrada = zona
                break

        if not zona_encontrada:
            return {}

        context['zona'] = ({'id': str(zona_encontrada.pk), 'nombre': zona_encontrada.nombre,
                            'equipos': [{'latitud': point[1], 'longitud': point[0]} for point in zona.lista_equipos]})

        return context