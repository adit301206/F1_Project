from django.urls import path
from .views import F1DriversAPIView

urlpatterns = [
    path('api/drivers/', F1DriversAPIView.as_view(), name='f1_drivers_api'),
]
