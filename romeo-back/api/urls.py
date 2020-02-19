from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from .views import PhotographerViewSet, PhotoViewSet, EquipmentViewSet, PhotoViewSet, AvailTimeViewSet, \
    StyleViewSet, CustomerViewSet, JobsViewSet, UserViewSet

router = DefaultRouter()
router.register(r'photographers', PhotographerViewSet, basename='photographers')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'jobs', JobsViewSet, basename='jobs')
router.register(r'users', UserViewSet, basename='users')
router.register(r'equipments', EquipmentViewSet, basename='equipments')
router.register(r'photos', PhotoViewSet, basename='photos')
router.register(r'availtimes', AvailTimeViewSet, basename='availtimes')
router.register(r'styles', StyleViewSet, basename='styles')


urlpatterns = router.urls
