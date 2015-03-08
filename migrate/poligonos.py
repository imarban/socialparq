from datetime import datetime
from fastkml import kml
from socialparq.models import ZonaParquimetro, DiaHorario, Horario


to_fecha = lambda fecha: datetime.strptime(fecha, '%Y/%m/%d') if fecha else ''


def get_horario_dia(dia_element):
    rangos = dia_element.split(";")
    horarios_dia = []
    for rango in rangos:
        for hora in rango.split("-"):
            horarios_dia.append(DiaHorario(inicio=hora[0], fin=hora[1]))

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
    zona.sup_km2 = schema_data[15].get('value', '')

    return zona


if __name__ == "__main__":
    with open("poligonoecoparqenoperacion.kml", "r") as arch:
        k = kml.KML()
        k.from_string(arch.read())

        for feature in k.features():
            for folder in feature.features():
                for placemark in folder.features():
                    for schema in placemark.extended_data.__dict__['elements']:
                        print get_basic_info(schema.__dict__['_data']).__dict__


