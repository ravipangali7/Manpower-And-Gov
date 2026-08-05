from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AgencyViewSet,
    AlbumViewSet,
    ContactSectionViewSet,
    ContentViewSet,
    JobViewSet,
    OfficialViewSet,
    PublicSiteDataView,
    PublicSitemapUrlsView,
    ServiceViewSet,
    SiteSettingsViewSet,
    StaticPageViewSet,
    TeamMemberViewSet,
)

router = DefaultRouter()
router.register("contents", ContentViewSet, basename="contents")
router.register("agencies", AgencyViewSet, basename="agencies")
router.register("services", ServiceViewSet, basename="services")
router.register("officials", OfficialViewSet, basename="officials")
router.register("team", TeamMemberViewSet, basename="team")
router.register("pages", StaticPageViewSet, basename="pages")
router.register("albums", AlbumViewSet, basename="albums")
router.register("contact-sections", ContactSectionViewSet, basename="contact-sections")
router.register("jobs", JobViewSet, basename="jobs")
router.register("settings", SiteSettingsViewSet, basename="settings")

urlpatterns = [
    path("", include(router.urls)),
    path("public/site-data/", PublicSiteDataView.as_view(), name="public-site-data"),
    path(
        "public/sitemap-urls/",
        PublicSitemapUrlsView.as_view(),
        name="public-sitemap-urls",
    ),
]
