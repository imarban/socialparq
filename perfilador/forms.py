# coding=utf-8
from mongodbforms.documents import DocumentForm
from django import forms

from perfilador.models import User


class UserForm(DocumentForm):
    password = forms.CharField(label="Contraseña", widget=forms.PasswordInput, required=True)

    class Meta:
        document = User
        fields = ['username', 'email']