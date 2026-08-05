from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from . import admin_api, views

router = DefaultRouter()
# Content CRUD
router.register(r"admin/jobs", admin_api.JobViewSet, basename="admin-jobs")
router.register(r"admin/news", admin_api.NewsArticleViewSet, basename="admin-news")
router.register(r"admin/sectors", admin_api.SectorViewSet, basename="admin-sectors")
router.register(r"admin/countries", admin_api.CountryViewSet, basename="admin-countries")
router.register(r"admin/hero", admin_api.HeroSectionViewSet, basename="admin-hero")
router.register(r"admin/stats", admin_api.HomeStatisticViewSet, basename="admin-stats")
router.register(r"admin/motto", admin_api.MottoStepViewSet, basename="admin-motto")
router.register(r"admin/testimonials", admin_api.TestimonialViewSet, basename="admin-testimonials")
router.register(r"admin/memberships", admin_api.MembershipViewSet, basename="admin-memberships")
router.register(r"admin/clients", admin_api.ClientViewSet, basename="admin-clients")
router.register(r"admin/why-choose-us", admin_api.WhyChooseUsItemViewSet, basename="admin-why")
router.register(r"admin/about-accordion", admin_api.AboutAccordionItemViewSet, basename="admin-accordion")
router.register(r"admin/recruitment-steps", admin_api.RecruitmentStepViewSet, basename="admin-recruitment")
router.register(r"admin/certificates", admin_api.CertificateViewSet, basename="admin-certificates")
router.register(r"admin/navigation", admin_api.NavigationLinkViewSet, basename="admin-navigation")
router.register(r"admin/footer-links", admin_api.FooterLinkViewSet, basename="admin-footer-links")
router.register(r"admin/quick-links", admin_api.QuickLinkViewSet, basename="admin-quick-links")
router.register(r"admin/faqs", admin_api.FAQViewSet, basename="admin-faqs")
router.register(r"admin/social-links", admin_api.SocialLinkViewSet, basename="admin-social")
router.register(r"admin/contact-numbers", admin_api.ContactNumberViewSet, basename="admin-phones")
router.register(r"admin/offices", admin_api.OfficeLocationViewSet, basename="admin-offices")
router.register(r"admin/demands", admin_api.DemandListViewSet, basename="admin-demands")
router.register(r"admin/careers", admin_api.CareerOpeningViewSet, basename="admin-careers")
router.register(r"admin/gallery/albums", admin_api.GalleryAlbumViewSet, basename="admin-gallery-albums")
router.register(r"admin/gallery/images", admin_api.GalleryImageViewSet, basename="admin-gallery-images")
router.register(r"admin/page-seo", admin_api.PageMetaViewSet, basename="admin-page-seo")
router.register(r"admin/pages", admin_api.CMSPageViewSet, basename="admin-pages")
router.register(r"admin/content-blocks", admin_api.ContentBlockViewSet, basename="admin-content-blocks")
router.register(r"admin/media", admin_api.MediaAssetViewSet, basename="admin-media")
router.register(r"admin/users", admin_api.UserViewSet, basename="admin-users")
router.register(
    r"admin/inquiries/contact",
    admin_api.ContactInquiryViewSet,
    basename="admin-inquiries-contact",
)
router.register(
    r"admin/inquiries/partnership",
    admin_api.PartnershipInquiryViewSet,
    basename="admin-inquiries-partnership",
)
router.register(
    r"admin/inquiries/registration",
    admin_api.RegistrationSubmissionViewSet,
    basename="admin-inquiries-registration",
)

urlpatterns = [
    path("health/", views.health_check, name="health-check"),
    path("site-settings/", views.site_settings_data, name="site-settings"),
    path("navigation/", views.navigation_data, name="navigation-data"),
    path("pages/home/", views.home_page_data, name="home-page-data"),
    path("pages/about/", views.about_page_data, name="about-page-data"),
    path("pages/services/", views.services_page_data, name="services-page-data"),
    path(
        "pages/ethical-recruitment/",
        views.ethical_recruitment_page_data,
        name="ethical-recruitment-page-data",
    ),
    path("pages/contact/", views.contact_page_data, name="contact-page-data"),
    path("pages/awards/", views.awards_data, name="awards-data"),
    path("pages/gallery/", views.gallery_data, name="gallery-data"),
    path("pages/careers/", views.careers_data, name="careers-data"),
    path("cms-pages/", views.cms_pages_list, name="cms-pages-list"),
    path("cms-pages/<slug:slug>/", views.cms_page_detail, name="cms-page-detail"),
    path("seo/", views.page_seo, name="page-seo"),
    path("vacancies/", views.vacancies_data, name="vacancies-data"),
    path("demands/", views.demand_list_data, name="demand-list"),
    path("news/", views.news_list, name="news-list"),
    path("news/<slug:slug>/", views.news_detail, name="news-detail"),
    path("forms/contact/", views.submit_contact_inquiry, name="submit-contact-inquiry"),
    path("forms/partnership/", views.submit_partnership_inquiry, name="submit-partnership-inquiry"),
    path("forms/registration/", views.submit_registration, name="submit-registration"),
    # Auth
    path("auth/token/", admin_api.StaffTokenObtainPairView.as_view(), name="token-obtain"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/me/", admin_api.me, name="auth-me"),
    # Admin
    path("admin/dashboard/", admin_api.dashboard, name="admin-dashboard"),
    path("admin/site-settings/", admin_api.site_settings_admin, name="admin-site-settings"),
    path("", include(router.urls)),
]
