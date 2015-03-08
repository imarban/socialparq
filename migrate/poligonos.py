from datetime import datetime
from fastkml import kml
from mongoengine.errors import DoesNotExist
from socialparq.models import ZonaParquimetro, DiaHorario, Horario


to_fecha = lambda fecha: datetime.strptime(fecha, '%Y/%m/%d') if fecha else ''


def get_horario_dia(dia_element):
    rangos = dia_element.split(";")
    horarios_dia = []
    for rango in rangos:
        if rango == 'N/A':
            horario = DiaHorario(inicio='00:00', fin='00:00')
        else:
            horas = rango.split("-")
            horario = DiaHorario(inicio=horas[0], fin=horas[1])
        horarios_dia.append(horario)

    return horarios_dia


def get_horario(dias_elements):
    horario = Horario()
    horario.lunes = get_horario_dia(dias_elements[0])
    horario.martes = get_horario_dia(dias_elements[1])
    horario.miercoles = get_horario_dia(dias_elements[2])
    horario.jueves = get_horario_dia(dias_elements[3])
    horario.viernes = get_horario_dia(dias_elements[4])
    horario.sabado = get_horario_dia(dias_elements[5])
    horario.domingo = get_horario_dia(dias_elements[6])

    return horario


def get_basic_info(schema_data):
    zona = ZonaParquimetro()
    zona.nombre = schema_data[0].get('value', '')
    zona.delegacion = schema_data[1].get('value', '')
    zona.clave = schema_data[2].get('value', '')
    zona.cajones = schema_data[3].get('value', '')
    zona.equipos = schema_data[4].get('value', '')
    zona.inicio_operaciones = to_fecha(schema_data[5].get('value', ''))
    zona.horario = get_horario([item.get('value', '08:00-20:00') for item in schema_data[6:13]])
    zona.costo_minuto = 2 / float(15)
    zona.sup_km2 = float(schema_data[15].get('value', 0.0))

    return zona


def migrate_poligonos():
    with open("poligonoecoparqenoperacion.kml", "r") as arch:
        k = kml.KML()
        k.from_string(arch.read())

    polygons = []

    for feature in k.features():
        for folder in feature.features():
            for placemark in folder.features():
                points = []
                for schema in placemark.extended_data.__dict__['elements']:
                    polygon = get_basic_info(schema.__dict__['_data'])
                x = placemark.__dict__['_geometry'].__dict__['geometry'].__dict__['_exterior'].__dict__['_geoms']
                points = [list(point.coords[0])[0:2] for point in x]

                polygon.area = points
                polygon.save()
                polygons.append(polygon)

                # ZonaParquimetro.objects.insert(polygons)


def migrate_equipos():
    with open("ecoparqequipos.kml", "r") as arch:
        k = kml.KML()
        k.from_string(arch.read())

    for feature in k.features():
        for folder in feature.features():
            for placemark in folder.features():
                nombre = placemark.extended_data.__dict__['elements'][0].__dict__['_data'][0]
                try:
                    polygon = ZonaParquimetro.objects.get(nombre__iexact=nombre.get('value', ''))
                except DoesNotExist, dne:
                    print dne, nombre
                point = placemark.__dict__['_geometry'].__dict__['geometry'].__dict__['_coordinates'][0:2]
                polygon.update(push__lista_equipos=point)


def migrate(request):
    migrate_poligonos()
    migrate_equipos()






