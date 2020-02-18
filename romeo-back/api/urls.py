from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from .views import PhotographerViewSet, CustomerViewSet, JobsViewSet

router = DefaultRouter()
router.register(r'photographers', PhotographerViewSet, basename='photographers')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'jobs', JobsViewSet, basename='jobs')


urlpatterns = router.urls
