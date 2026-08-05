from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = 'Super Admin'
admin.site.site_title = 'Super Admin'
admin.site.index_title = 'Super Admin dashboard'

urlpatterns = [
    path('api/', include('core.urls')),
    path('admin/', admin.site.urls),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

