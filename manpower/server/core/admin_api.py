from django.contrib.auth import get_user_model
from rest_framework import parsers, status, viewsets
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import (
    AboutAccordionItem,
    CMSPage,
    CareerOpening,
    Certificate,
    Client,
    ContactInquiry,
    ContactNumber,
    ContentBlock,
    Country,
    DemandList,
    FAQ,
    FooterLink,
    GalleryAlbum,
    GalleryImage,
    HeroSection,
    HomeStatistic,
    Job,
    MediaAsset,
    Membership,
    MottoStep,
    NavigationLink,
    NewsArticle,
    OfficeLocation,
    PageMeta,
    PartnershipInquiry,
    QuickLink,
    RecruitmentStep,
    RegistrationSubmission,
    Sector,
    SiteConfiguration,
    SocialLink,
    Testimonial,
    WhyChooseUsItem,
)
from .serializers import (
    AboutAccordionItemSerializer,
    CMSPageSerializer,
    CareerOpeningSerializer,
    CertificateSerializer,
    ClientSerializer,
    ContactInquirySerializer,
    ContactNumberSerializer,
    ContentBlockSerializer,
    CountrySerializer,
    DemandListSerializer,
    FAQSerializer,
    FooterLinkSerializer,
    GalleryAlbumSerializer,
    GalleryImageSerializer,
    HeroSectionSerializer,
    HomeStatisticSerializer,
    JobSerializer,
    MediaAssetSerializer,
    MembershipSerializer,
    MottoStepSerializer,
    NavigationLinkSerializer,
    NewsArticleSerializer,
    OfficeLocationSerializer,
    PageMetaSerializer,
    PartnershipInquirySerializer,
    QuickLinkSerializer,
    RecruitmentStepSerializer,
    RegistrationSubmissionSerializer,
    SectorSerializer,
    SiteConfigurationSerializer,
    SocialLinkSerializer,
    TestimonialSerializer,
    UserAdminSerializer,
    UserSerializer,
    WhyChooseUsItemSerializer,
)

User = get_user_model()


class StaffTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_staff:
            raise PermissionDenied(
                "Staff access required. This account cannot use Super Admin."
            )
        data["user"] = UserSerializer(self.user).data
        return data


class StaffTokenObtainPairView(TokenObtainPairView):
    serializer_class = StaffTokenObtainPairSerializer
    permission_classes = [AllowAny]


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def me(request):
    return Response(UserSerializer(request.user).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def dashboard(request):
    return Response(
        {
            "jobs_total": Job.objects.count(),
            "jobs_active": Job.objects.filter(is_active=True).count(),
            "news_total": NewsArticle.objects.count(),
            "news_published": NewsArticle.objects.filter(is_published=True).count(),
            "sectors_total": Sector.objects.count(),
            "demands_total": DemandList.objects.filter(is_active=True).count(),
            "gallery_total": GalleryImage.objects.count(),
            "pages_total": CMSPage.objects.count(),
            "inquiries_open": (
                ContactInquiry.objects.filter(handled=False).count()
                + PartnershipInquiry.objects.filter(handled=False).count()
                + RegistrationSubmission.objects.filter(handled=False).count()
            ),
            "contact_open": ContactInquiry.objects.filter(handled=False).count(),
            "partnership_open": PartnershipInquiry.objects.filter(handled=False).count(),
            "registration_open": RegistrationSubmission.objects.filter(handled=False).count(),
            "users_total": User.objects.count(),
        }
    )


class AdminModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx


class MultiPartMixin:
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]


class JobViewSet(AdminModelViewSet):
    queryset = Job.objects.select_related("sector", "country").all()
    serializer_class = JobSerializer


class NewsArticleViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleSerializer


class SectorViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = Sector.objects.all()
    serializer_class = SectorSerializer


class CountryViewSet(AdminModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class HeroSectionViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = HeroSection.objects.all()
    serializer_class = HeroSectionSerializer


class HomeStatisticViewSet(AdminModelViewSet):
    queryset = HomeStatistic.objects.all()
    serializer_class = HomeStatisticSerializer


class MottoStepViewSet(AdminModelViewSet):
    queryset = MottoStep.objects.all()
    serializer_class = MottoStepSerializer


class TestimonialViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer


class MembershipViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer


class ClientViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class WhyChooseUsItemViewSet(AdminModelViewSet):
    queryset = WhyChooseUsItem.objects.all()
    serializer_class = WhyChooseUsItemSerializer


class AboutAccordionItemViewSet(AdminModelViewSet):
    queryset = AboutAccordionItem.objects.all()
    serializer_class = AboutAccordionItemSerializer


class RecruitmentStepViewSet(AdminModelViewSet):
    queryset = RecruitmentStep.objects.all()
    serializer_class = RecruitmentStepSerializer


class CertificateViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer


class NavigationLinkViewSet(AdminModelViewSet):
    queryset = NavigationLink.objects.all()
    serializer_class = NavigationLinkSerializer


class FooterLinkViewSet(AdminModelViewSet):
    queryset = FooterLink.objects.all()
    serializer_class = FooterLinkSerializer


class QuickLinkViewSet(AdminModelViewSet):
    queryset = QuickLink.objects.all()
    serializer_class = QuickLinkSerializer


class FAQViewSet(AdminModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer


class SocialLinkViewSet(AdminModelViewSet):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer


class ContactNumberViewSet(AdminModelViewSet):
    queryset = ContactNumber.objects.select_related("site").all()
    serializer_class = ContactNumberSerializer


class OfficeLocationViewSet(AdminModelViewSet):
    queryset = OfficeLocation.objects.select_related("site").all()
    serializer_class = OfficeLocationSerializer


class DemandListViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = DemandList.objects.select_related("sector", "country").all()
    serializer_class = DemandListSerializer


class CareerOpeningViewSet(AdminModelViewSet):
    queryset = CareerOpening.objects.all()
    serializer_class = CareerOpeningSerializer


class GalleryAlbumViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = GalleryAlbum.objects.prefetch_related("images").all()
    serializer_class = GalleryAlbumSerializer


class GalleryImageViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = GalleryImage.objects.select_related("album").all()
    serializer_class = GalleryImageSerializer


class PageMetaViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = PageMeta.objects.all()
    serializer_class = PageMetaSerializer


class CMSPageViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = CMSPage.objects.all()
    serializer_class = CMSPageSerializer


class MediaAssetViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer


class ContentBlockViewSet(MultiPartMixin, AdminModelViewSet):
    queryset = ContentBlock.objects.all()
    serializer_class = ContentBlockSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        section = self.request.query_params.get("section") or self.request.query_params.get(
            "page_key"
        )
        if section:
            qs = qs.filter(page=section)
        return qs


class UserViewSet(AdminModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserAdminSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_superuser:
            return qs.filter(id=self.request.user.id)
        return qs

    def perform_create(self, serializer):
        if not self.request.user.is_superuser:
            raise PermissionDenied("Only superusers can create staff accounts.")
        # CMS login requires is_staff; default new accounts to staff when omitted.
        is_staff = serializer.validated_data.get("is_staff", True)
        serializer.save(is_staff=is_staff)

    def perform_destroy(self, instance):
        if instance == self.request.user:
            raise PermissionDenied("You cannot delete your own account.")
        if instance.is_superuser and not self.request.user.is_superuser:
            raise PermissionDenied("Only superusers can delete superusers.")
        instance.delete()


@api_view(["GET", "PUT", "PATCH"])
@parser_classes([parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser])
@permission_classes([IsAuthenticated, IsAdminUser])
def site_settings_admin(request):
    site = SiteConfiguration.objects.order_by("-updated_at").first()
    empty = {
        "id": None,
        "company_name": "",
        "short_name": "",
        "address": "",
        "primary_email": "",
        "po_box": "",
        "notice_text": "",
        "tagline": "",
        "map_embed_url": "",
        "business_hours": "",
        "cv_download_url": "",
        "license_number": "",
        "meta_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "partner_cta_heading": "Partner With Us",
        "partner_cta_body": "",
        "partner_cta_button_label": "Contact Us",
        "partner_cta_button_path": "/contact",
        "hiring_enabled": True,
        "hiring_heading": "WE ARE HIRING!",
        "hiring_subheading": "Open Positions",
        "hiring_button_label": "APPLY NOW",
        "hiring_button_path": "/online-registration",
        "ethic_heading": "Ethical Recruitment",
        "ethic_eyebrow": "What we do",
        "ethic_body": "",
        "ethic_button_label": "Learn More",
        "ethic_button_path": "/ethical-recruitment",
        "motto_heading": "Our Motto",
        "motto_intro": "",
        "expertise_heading": "Our Expertise",
        "expertise_intro": "",
        "expertise_button_label": "Learn More",
        "expertise_button_path": "/services",
        "testimonials_heading": "Testimonial",
        "membership_heading": "Membership",
        "clients_heading": "PROUD TO WORK WITH",
        "partnership_form_heading": "Partner With Us",
        "partnership_form_success": "Thank you — we received your message and will reply shortly.",
        "partnership_form_submit_label": "Submit",
        "partnership_form_sending_label": "Sending…",
        "partnership_form_name_label": "Full name",
        "partnership_form_phone_label": "Phone",
        "partnership_form_email_label": "Email",
        "partnership_form_message_label": "Message",
        "logo_url": None,
        "favicon_url": None,
        "og_image_url": None,
        "stats_background_url": None,
        "testimonials_background_url": None,
        "contact_numbers": [],
        "offices": [],
        "updated_at": None,
    }

    if site is None:
        if request.method == "GET":
            return Response(empty)
        serializer = SiteConfigurationSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        site = serializer.save()
        return Response(
            SiteConfigurationSerializer(site, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )

    if request.method == "GET":
        return Response(SiteConfigurationSerializer(site, context={"request": request}).data)

    # Support multipart for logo/favicon/background uploads; empty string clears the file.
    image_fields = {
        "logo",
        "favicon",
        "og_image",
        "stats_background",
        "testimonials_background",
    }
    raw = request.data
    data = {}
    for key in raw:
        value = raw.get(key)
        if key in image_fields and value in ("", None):
            data[key] = None
        elif key == "hiring_enabled" and isinstance(value, str):
            data[key] = value.strip().lower() in ("1", "true", "yes", "on")
        else:
            data[key] = value

    serializer = SiteConfigurationSerializer(
        site, data=data, partial=request.method == "PATCH", context={"request": request}
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


class ContactInquiryViewSet(AdminModelViewSet):
    queryset = ContactInquiry.objects.all()
    serializer_class = ContactInquirySerializer
    http_method_names = ["get", "patch", "head", "options"]


class PartnershipInquiryViewSet(AdminModelViewSet):
    queryset = PartnershipInquiry.objects.all()
    serializer_class = PartnershipInquirySerializer
    http_method_names = ["get", "patch", "head", "options"]


class RegistrationSubmissionViewSet(AdminModelViewSet):
    queryset = RegistrationSubmission.objects.all()
    serializer_class = RegistrationSubmissionSerializer
    http_method_names = ["get", "patch", "head", "options"]
