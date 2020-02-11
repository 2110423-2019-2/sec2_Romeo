from django.urls import path
from .views import PhotographerListAPIView, PhotographerDetailAPIView

urlpatterns = [
    path('photographers/', PhotographerListAPIView.as_view(), name="Photographers List"),
    path('photographers/<int:pk>/',PhotographerDetailAPIView, name = 'Photographer Detail')
]