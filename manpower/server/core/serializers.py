from django.contrib.auth import get_user_model
from rest_framework import serializers

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

User = get_user_model()


def absolute_media_url(request, field):
    if not field:
        return None
    # Prefer relative /media/... so Vite/nginx can proxy same-origin to Django.
    # Absolute URLs still work for email/SSR consumers when request is provided.
    url = field.url
    if request is None:
        return url
    # Keep relative paths for browser fetches through the frontend origin.
    if url.startswith("/"):
        return url
    return request.build_absolute_uri(url)


class ImageUrlMixin:
    def get_image_url(self, obj, attr="image"):
        field = getattr(obj, attr, None)
        request = self.context.get("request")
        return absolute_media_url(request, field)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "is_superuser",
            "is_active",
            "date_joined",
        )
        read_only_fields = ("date_joined",)


class UserAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "is_superuser",
            "is_active",
            "password",
            "date_joined",
        )
        read_only_fields = ("date_joined",)

    def create(self, validated_data):
        password = validated_data.pop("password", None) or User.objects.make_random_password()
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class ContactNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactNumber
        fields = ("id", "site", "label", "number", "order", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")
        extra_kwargs = {"site": {"required": False}}

    def create(self, validated_data):
        if not validated_data.get("site"):
            site = SiteConfiguration.objects.order_by("-updated_at").first()
            if not site:
                raise serializers.ValidationError({"site": "Configure site settings first."})
            validated_data["site"] = site
        return super().create(validated_data)


class OfficeLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfficeLocation
        fields = (
            "id",
            "site",
            "title",
            "office_name",
            "address",
            "email",
            "phone",
            "order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")
        extra_kwargs = {"site": {"required": False}}

    def create(self, validated_data):
        if not validated_data.get("site"):
            site = SiteConfiguration.objects.order_by("-updated_at").first()
            if not site:
                raise serializers.ValidationError({"site": "Configure site settings first."})
            validated_data["site"] = site
        return super().create(validated_data)


class SiteConfigurationSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    favicon_url = serializers.SerializerMethodField()
    og_image_url = serializers.SerializerMethodField()
    stats_background_url = serializers.SerializerMethodField()
    testimonials_background_url = serializers.SerializerMethodField()
    contact_numbers = ContactNumberSerializer(many=True, read_only=True)
    offices = OfficeLocationSerializer(many=True, read_only=True)

    class Meta:
        model = SiteConfiguration
        fields = (
            "id",
            "company_name",
            "short_name",
            "address",
            "primary_email",
            "po_box",
            "notice_text",
            "tagline",
            "map_embed_url",
            "business_hours",
            "cv_download_url",
            "license_number",
            "logo",
            "logo_url",
            "favicon",
            "favicon_url",
            "meta_title",
            "meta_description",
            "meta_keywords",
            "og_image",
            "og_image_url",
            "partner_cta_heading",
            "partner_cta_body",
            "partner_cta_button_label",
            "partner_cta_button_path",
            "hiring_enabled",
            "hiring_heading",
            "hiring_subheading",
            "hiring_button_label",
            "hiring_button_path",
            "ethic_heading",
            "ethic_eyebrow",
            "ethic_body",
            "ethic_button_label",
            "ethic_button_path",
            "motto_heading",
            "motto_intro",
            "expertise_heading",
            "expertise_intro",
            "expertise_button_label",
            "expertise_button_path",
            "testimonials_heading",
            "membership_heading",
            "clients_heading",
            "stats_background",
            "stats_background_url",
            "testimonials_background",
            "testimonials_background_url",
            "partnership_form_heading",
            "partnership_form_success",
            "partnership_form_submit_label",
            "partnership_form_sending_label",
            "partnership_form_name_label",
            "partnership_form_phone_label",
            "partnership_form_email_label",
            "partnership_form_message_label",
            "contact_numbers",
            "offices",
            "updated_at",
        )
        read_only_fields = (
            "updated_at",
            "logo_url",
            "favicon_url",
            "og_image_url",
            "stats_background_url",
            "testimonials_background_url",
        )

    def get_logo_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.logo)

    def get_favicon_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.favicon)

    def get_og_image_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.og_image)

    def get_stats_background_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.stats_background)

    def get_testimonials_background_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.testimonials_background)


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ("id", "platform", "label", "url", "order", "is_active", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")


class NavigationLinkSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = NavigationLink
        fields = (
            "id",
            "label",
            "path",
            "order",
            "is_active",
            "open_in_new_tab",
            "parent",
            "children",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def get_children(self, obj):
        qs = obj.children.filter(is_active=True).order_by("order", "id")
        return NavigationLinkSerializer(qs, many=True, context=self.context).data


class HeroSectionSerializer(serializers.ModelSerializer):
    background_image_url = serializers.SerializerMethodField()

    class Meta:
        model = HeroSection
        fields = (
            "id",
            "eyebrow",
            "title",
            "subtitle",
            "body",
            "background_image",
            "background_image_url",
            "cta_primary_label",
            "cta_primary_path",
            "cta_secondary_label",
            "cta_secondary_path",
            "rating",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "background_image_url")

    def get_background_image_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.background_image)


class HomeStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeStatistic
        fields = (
            "id",
            "value",
            "label",
            "icon",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class MottoStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = MottoStep
        fields = (
            "id",
            "step_label",
            "number",
            "title",
            "icon",
            "tone",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class SectorSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Sector
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "icon",
            "image",
            "image_url",
            "is_featured",
            "is_active",
            "order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("slug", "created_at", "updated_at", "image_url")

    def get_image_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.image)


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ("id", "name", "flag_emoji", "is_active", "order", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")


class TestimonialSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = (
            "id",
            "quote",
            "author",
            "brand",
            "photo",
            "photo_url",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "photo_url")

    def get_photo_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.photo)


class MembershipSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Membership
        fields = (
            "id",
            "title",
            "url",
            "logo",
            "logo_url",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "logo_url")

    def get_logo_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.logo)


class ClientSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = (
            "id",
            "name",
            "url",
            "logo",
            "logo_url",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "logo_url")

    def get_logo_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.logo)


class WhyChooseUsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyChooseUsItem
        fields = ("id", "number", "title", "body", "order", "is_active", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")


class AboutAccordionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutAccordionItem
        fields = ("id", "title", "body", "order", "is_active", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")


class RecruitmentStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentStep
        fields = ("id", "title", "body", "order", "is_active", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")


class NewsArticleSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = NewsArticle
        fields = (
            "id",
            "title",
            "slug",
            "author",
            "excerpt",
            "content",
            "cover_image",
            "cover_image_url",
            "is_published",
            "published_at",
            "meta_title",
            "meta_description",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("slug", "created_at", "updated_at", "cover_image_url")

    def get_cover_image_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.cover_image)


class JobSerializer(serializers.ModelSerializer):
    sector_name = serializers.CharField(source="sector.name", read_only=True)
    country_name = serializers.CharField(source="country.name", read_only=True)

    class Meta:
        model = Job
        fields = (
            "id",
            "title",
            "company",
            "sector",
            "sector_name",
            "country",
            "country_name",
            "vacancies",
            "salary",
            "description",
            "requirements",
            "deadline",
            "is_featured",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class DemandListSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source="country.name", read_only=True, default=None)
    sector_name = serializers.CharField(source="sector.name", read_only=True, default=None)
    document_url = serializers.SerializerMethodField()

    class Meta:
        model = DemandList
        fields = (
            "id",
            "title",
            "employer",
            "country",
            "country_name",
            "sector",
            "sector_name",
            "positions",
            "description",
            "document",
            "document_url",
            "published_at",
            "is_active",
            "order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "document_url")

    def get_document_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.document)


class CareerOpeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerOpening
        fields = (
            "id",
            "title",
            "description",
            "apply_path",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class CertificateSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    document_url = serializers.SerializerMethodField()

    class Meta:
        model = Certificate
        fields = (
            "id",
            "title",
            "tag",
            "image",
            "image_url",
            "document",
            "document_url",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "image_url", "document_url")

    def get_image_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.image)

    def get_document_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.document)


class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = (
            "id",
            "album",
            "title",
            "image",
            "image_url",
            "caption",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "image_url")

    def get_image_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.image)


class GalleryAlbumSerializer(serializers.ModelSerializer):
    cover_url = serializers.SerializerMethodField()
    images = GalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = GalleryAlbum
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "cover",
            "cover_url",
            "order",
            "is_active",
            "images",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("slug", "created_at", "updated_at", "cover_url")

    def get_cover_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.cover)


class PageMetaSerializer(serializers.ModelSerializer):
    og_image_url = serializers.SerializerMethodField()

    class Meta:
        model = PageMeta
        fields = (
            "id",
            "path",
            "title",
            "description",
            "keywords",
            "og_image",
            "og_image_url",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "og_image_url")

    def get_og_image_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.og_image)


class CMSPageSerializer(serializers.ModelSerializer):
    banner_image_url = serializers.SerializerMethodField()

    class Meta:
        model = CMSPage
        fields = (
            "id",
            "title",
            "slug",
            "excerpt",
            "content",
            "banner_image",
            "banner_image_url",
            "meta_title",
            "meta_description",
            "is_published",
            "show_in_nav",
            "order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("slug", "created_at", "updated_at", "banner_image_url")

    def get_banner_image_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.banner_image)


class FooterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterLink
        fields = ("id", "label", "path", "order", "is_active", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")


class QuickLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickLink
        fields = ("id", "label", "path", "order", "is_active", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ("id", "question", "answer", "order", "is_active", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")


class MediaAssetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = ("id", "title", "file", "file_url", "alt_text", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at", "file_url")

    def get_file_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.file)


class ContentBlockSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ContentBlock
        fields = (
            "id",
            "key",
            "page",
            "label",
            "heading",
            "subheading",
            "body",
            "body_2",
            "body_3",
            "image",
            "image_url",
            "video_url",
            "cta_label",
            "cta_path",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "image_url")

    def get_image_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.image)


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = (
            "id",
            "full_name",
            "email",
            "subject",
            "message",
            "phone",
            "handled",
            "created_at",
        )
        read_only_fields = (
            "full_name",
            "email",
            "subject",
            "message",
            "phone",
            "created_at",
        )


class PartnershipInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnershipInquiry
        fields = (
            "id",
            "full_name",
            "email",
            "phone",
            "message",
            "handled",
            "created_at",
        )
        read_only_fields = ("full_name", "email", "phone", "message", "created_at")


class RegistrationSubmissionSerializer(serializers.ModelSerializer):
    cv_file_url = serializers.SerializerMethodField()

    class Meta:
        model = RegistrationSubmission
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "contact_number",
            "permanent_address",
            "temporary_address",
            "position",
            "preferred_country",
            "message",
            "cv_file",
            "cv_file_url",
            "handled",
            "created_at",
        )
        read_only_fields = (
            "first_name",
            "last_name",
            "email",
            "contact_number",
            "permanent_address",
            "temporary_address",
            "position",
            "preferred_country",
            "message",
            "cv_file",
            "created_at",
            "cv_file_url",
        )

    def get_cv_file_url(self, obj):
        return absolute_media_url(self.context.get("request"), obj.cv_file)
