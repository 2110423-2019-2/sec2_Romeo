from django.contrib import admin
from .models import Photographer, Photo, AvailTime, Equipment

admin.site.register(Photographer)
admin.site.register(Photo)
admin.site.register(AvailTime)
admin.site.register(Equipment)

# Register your models here.
