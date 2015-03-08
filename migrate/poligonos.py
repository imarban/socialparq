from datetime import datetime
from fastkml import kml
from socialparq.models import ZonaParquimetro


to_fecha = lambda fecha: datetime.strptime(fecha, '%Y/%m/%d') if fecha else ''


def get_hora():
    pass


def get_basic_info(schema_data):
    zona = ZonaParquimetro()
    zona.nombre = schema_data[0].get('value', '')
    zona.delegacion = schema_data[0].get('value', '')
    zona.clave = schema_data[0].get('value', '')
    zona.cajones = schema_data[0].get('value', '')
    zona.equipos = schema_data[0].get('value', '')
    zona.inicio_operaciones = to_fecha(schema_data[0].get('value', ''))

    zona.nombre = schema_data[0].get('value', '')
    zona.nombre = schema_data[0].get('value', '')


if __name__ == "__main__":
    with open("poligonoecoparqenoperacion.kml", "r") as arch:
        k = kml.KML()
        k.from_string(arch.read())

        for feature in k.features():
            for folder in feature.features():
                for placemark in folder.features():
                    for schema in placemark.extended_data.__dict__['elements']:
                        print schema.__dict__['_data']


