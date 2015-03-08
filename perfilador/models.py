# coding=utf-8
from django.contrib import auth
from django.contrib.auth.models import _user_get_all_permissions, _user_has_perm, _user_has_module_perms
from django.utils.timezone import now as datetime_now
from django.utils.translation import ugettext_lazy as _
from mongoengine import EmailField, DateTimeField
from mongoengine.django.auth import Permission, Group, make_password, check_password
from mongoengine.document import Document
from mongoengine.fields import StringField, ListField, ReferenceField, \
    BooleanField, IntField, EmbeddedDocumentField


class User(Document):
    """
    Custom User Document that adds some functionality to store the groups for a given user. The rest of
    code is equal to User from MongoEngine.
    """

    # TODO Check for inheritance
    username = StringField(max_length=30, required=True,
                           verbose_name=_('username'),
                           help_text=_(u"Requerido. 30 caracteres o menos. Letras, números y los caracteres @.+-_"),
                           unique=True, )

    first_name = StringField(max_length=30,
                             verbose_name=_('first name'))

    last_name = StringField(max_length=60,
                            verbose_name=_('last name'))
    email = EmailField(verbose_name=_(u'Dirección de email'), required=True, unique=True)
    password = StringField(max_length=128,
                           verbose_name=_('password'),
                           help_text=_(
                               u"Para que su clave sea más robusta:\
                               <ul class='help-block'><li>Darle al menos seis caracteres</li>\
                               <li>Añadir letras minúsculas</li>\
                               <li>Añadir letras mayúscula</li>\
                               <li>Añadir cifras</li>\
                               <li>Añadir signos de puntuación</li></ul>"))
    is_staff = BooleanField(default=False,
                            verbose_name=_('staff status'),
                            help_text=_("Designates whether the user can log into this admin site."))
    is_active = BooleanField(default=True,
                             verbose_name=_('active'),
                             help_text=_(
                                 "Designates whether this user should be treated as active. Unselect \
                                 this instead of deleting accounts."))
    is_superuser = BooleanField(default=False,
                                verbose_name=_('superuser status'),
                                help_text=_(
                                    "Designates that this user has all permissions without explicitly assigning them."))
    last_login = DateTimeField(default=datetime_now,
                               verbose_name=_('last login'))
    date_joined = DateTimeField(default=datetime_now,
                                verbose_name=_('date joined'))

    user_permissions = ListField(ReferenceField(Permission), verbose_name=_('user permissions'),
                                 help_text=_('Permissions for the user.'))

    groups = ListField(ReferenceField(Group), verbose_name=_('Rol'),
                       help_text=_('Rol del usuario'))

    site_from = IntField(min_value=0, max_value=1)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    meta = {
        'allow_inheritance': True,
        'indexes': [
            {'fields': ['username'], 'unique': True, 'sparse': True}
        ]
    }

    def __unicode__(self):
        return self.username

    def get_full_name(self):
        """Returns the users first and last names, separated by a space.
        """
        full_name = u'%s %s' % (self.first_name or '', self.last_name or '')
        return full_name.strip()

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True

    def set_password(self, raw_password):
        """Sets the user's password - always use this rather than directly
        assigning to :attr:`~mongoengine.django.auth.User.password` as the
        password is hashed before storage.
        """
        self.password = make_password(raw_password)
        self.save()
        return self

    def check_password(self, raw_password):
        """Checks the user's password against a provided password - always use
        this rather than directly comparing to
        :attr:`~mongoengine.django.auth.User.password` as the password is
        hashed before storage.
        """
        return check_password(raw_password, self.password)

    @classmethod
    def create_user(cls, username, password, email=None):
        """Create (and save) a new user with the given username, password and
        email address.
        """
        now = datetime_now()

        # Normalize the address by lowercasing the domain part of the email
        # address.
        if email is not None:
            try:
                email_name, domain_part = email.strip().split('@', 1)
            except ValueError:
                pass
            else:
                email = '@'.join([email_name, domain_part.lower()])

        user_to_save = cls(username=username, email=email, date_joined=now)
        user_to_save.set_password(password)
        user_to_save.save()
        return user_to_save

    def get_group_permissions(self, obj=None):
        """
        Returns a list of permission strings that this user has through his/her
        groups. This method queries all available auth backends. If an object
        is passed in, only permissions matching this object are returned.
        """
        permissions = set()
        for backend in auth.get_backends():
            if hasattr(backend, "get_group_permissions"):
                permissions.update(backend.get_group_permissions(self, obj))
        return permissions

    def get_all_permissions(self, obj=None):
        return _user_get_all_permissions(self, obj)

    def has_perm(self, perm):
        return self.has_perms(perm, None)

    def has_perms(self, perm, obj=None):
        """
        Returns True if the user has the specified permission. This method
        queries all available auth backends, but returns immediately if any
        backend returns True. Thus, a user who has permission from a single
        auth backend is assumed to have permission in general. If an object is
        provided, permissions for this specific object are checked.
        """

        # Active superusers have all permissions.
        if self.is_active and self.is_superuser:
            return True

        # Otherwise we need to check the backends.
        return _user_has_perm(self, perm, obj)

    def has_module_perms(self, app_label):
        """
        Returns True if the user has any permissions in the given app label.
        Uses pretty much the same logic as has_perms, above.
        """
        # Active superusers have all permissions.
        if self.is_active and self.is_superuser:
            return True

        return _user_has_module_perms(self, app_label)

    def email_user(self, subject, message, from_email=None):
        """Sends an e-mail to this User."""
        from django.core.mail import send_mail

        send_mail(subject, message, from_email, [self.email])


    def save(self, force_insert=False, validate=True, clean=True,
             write_concern=None, cascade=None, cascade_kwargs=None,
             _refs=None, **kwargs):

        return super(User, self).save(force_insert, validate, clean, write_concern, cascade, cascade_kwargs, _refs,
                                      **kwargs)