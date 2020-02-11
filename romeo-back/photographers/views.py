from django.shortcuts import render
from django.views.generic import TemplateView


class PhotographersHomePageView(TemplateView):
    template_name = 'home.html'
# Create your views here.
