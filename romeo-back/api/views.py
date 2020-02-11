from django.shortcuts import render
from rest_framework import generics
from photographers.models import PhotographerInfo
from .serializers import PhotographerSerializer
# Create your views here.

class PhotographerListAPIView(generics.ListAPIView) :
    queryset = PhotographerInfo.objects.all()
    serializer_class = PhotographerSerializer

class PhotographerDetailAPIView(generics.RetrieveAPIView):
    queryset = PhotographerInfo.objects.all()
    serializer_class = PhotographerSerializer