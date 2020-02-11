from django.contrib import admin
from .models import PhotographerInfo, Photo, AvailTime, Equipment

admin.site.register(PhotographerInfo)
admin.site.register(Photo)
admin.site.register(AvailTime)
admin.site.register(Equipment)

# Register your models here.
