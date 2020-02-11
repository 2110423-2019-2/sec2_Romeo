from rest_framework import serializers
from photographers.models import PhotographerInfo

class PhotographerSerializer(serializers.ModelSerializer) :
    class Meta :
       model = PhotographerInfo
       fields = ('PhotographerFname','PhotographerLname','')