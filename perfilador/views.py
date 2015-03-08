import json

from django.http.response import HttpResponse
import mongogeneric

from perfilador.forms import UserForm
from perfilador.models import User


class CreateUserView(mongogeneric.CreateView):
    form_class = UserForm
    document = User
    success_url = "/"

    def form_valid(self, form):
        User.create_user(form.cleaned_data['username'], form.cleaned_data['password'], form.cleaned_data['email'])

        return HttpResponse(json.dumps({'success': True}), content_type='application/json')

    def form_invalid(self, form):
        print form
        return HttpResponse(json.dumps({'errors': form.errors, 'success': False}), content_type='application/json')