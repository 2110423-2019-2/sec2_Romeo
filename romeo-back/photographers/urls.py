from django.urls import path
from .views import PhotographersHomePageView
urlpatterns = [
    path('', PhotographersHomePageView.as_view(), name='photohome')
]