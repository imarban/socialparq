import mongoengine
from mongoengine.fields import StringField, IntField, DateTimeField, EmbeddedDocumentField, ListField, DecimalField, \
    FloatField, PolygonField, LineStringField


class DiaHorario(mongoengine.EmbeddedDocument):
    inicio = DateTimeField()
    fin = DateTimeField()


class Horario(mongoengine.EmbeddedDocument):
    lunes = ListField(EmbeddedDocumentField(DiaHorario))
    martes = ListField(EmbeddedDocumentField(DiaHorario))
    miercoles = ListField(EmbeddedDocumentField(DiaHorario))
    jueves = ListField(EmbeddedDocumentField(DiaHorario))
    viernes = ListField(EmbeddedDocumentField(DiaHorario))
    sabado = ListField(EmbeddedDocumentField(DiaHorario))
    domingo = ListField(EmbeddedDocumentField(DiaHorario))


class ZonaParquimetro(mongoengine.Document):
    nombre = StringField(max_length=250, required=True)
    delegacion = StringField(max_length=30, required=True)
    clave = IntField(min_value=0, required=True)
    cajones = IntField(min_value=0, required=True)
    equipos = IntField(min_value=0, required=True)
    inicio_operaciones = DateTimeField()
    horario = EmbeddedDocumentField(Horario)
    costo_minuto = FloatField(min_value=0)
    sup_km2 = FloatField(min_value=0)
    area = LineStringField(required=True)

    @property
    def caj_km2(self):
        return self.cajones / float(self.sup_km2)
