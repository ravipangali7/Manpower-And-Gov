from django.contrib import admin
from . import models


class OrderedModelAdmin(admin.ModelAdmin):
    ordering = ("order", "id")
    list_display = ("__str__", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)


class ContactNumberInline(admin.TabularInline):
    model = models.ContactNumber
    extra = 1
    ordering = ("order",)


class OfficeLocationInline(admin.TabularInline):
    model = models.OfficeLocation
    extra = 1
    ordering = ("order",)


@admin.register(models.SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    list_display = ("company_name", "primary_email", "business_hours", "updated_at")
    search_fields = ("company_name", "primary_email")
    inlines = [ContactNumberInline, OfficeLocationInline]
    fieldsets = (
        (
            "Company",
            {
                "fields": (
                    "company_name",
                    "short_name",
                    "tagline",
                    "address",
                    "po_box",
                    "primary_email",
                    "business_hours",
                    "license_number",
                    "logo",
                    "favicon",
                )
            },
        ),
        ("Notice & Map", {"fields": ("notice_text", "map_embed_url", "cv_download_url")}),
        ("SEO Defaults", {"fields": ("meta_title", "meta_description", "meta_keywords", "og_image")}),
        (
            "Partner CTA",
            {
                "fields": (
                    "partner_cta_heading",
                    "partner_cta_body",
                    "partner_cta_button_label",
                    "partner_cta_button_path",
                )
            },
        ),
        (
            "Hiring Widget",
            {
                "fields": (
                    "hiring_enabled",
                    "hiring_heading",
                    "hiring_subheading",
                    "hiring_button_label",
                    "hiring_button_path",
                )
            },
        ),
        (
            "Home Ethic Block",
            {
                "fields": (
                    "ethic_eyebrow",
                    "ethic_heading",
                    "ethic_body",
                    "ethic_button_label",
                    "ethic_button_path",
                )
            },
        ),
        (
            "Home Sections",
            {
                "fields": (
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
                    "testimonials_background",
                )
            },
        ),
        (
            "Home Partnership Form",
            {
                "fields": (
                    "partnership_form_heading",
                    "partnership_form_success",
                    "partnership_form_submit_label",
                    "partnership_form_sending_label",
                    "partnership_form_name_label",
                    "partnership_form_phone_label",
                    "partnership_form_email_label",
                    "partnership_form_message_label",
                )
            },
        ),
    )


@admin.register(models.ContactNumber)
class ContactNumberAdmin(admin.ModelAdmin):
    list_display = ("number", "label", "site", "order")
    list_editable = ("order",)
    ordering = ("order", "id")
    search_fields = ("number", "label")


@admin.register(models.OfficeLocation)
class OfficeLocationAdmin(admin.ModelAdmin):
    list_display = ("title", "office_name", "site", "email", "order")
    list_editable = ("order",)
    ordering = ("order", "id")
    search_fields = ("title", "office_name", "address")


@admin.register(models.SocialLink)
class SocialLinkAdmin(OrderedModelAdmin):
    list_display = ("platform", "label", "url", "order", "is_active")
    search_fields = ("platform", "label", "url")


@admin.register(models.NavigationLink)
class NavigationLinkAdmin(OrderedModelAdmin):
    list_display = ("label", "path", "parent", "order", "is_active", "open_in_new_tab")
    search_fields = ("label", "path")
    list_filter = ("is_active", "parent")


@admin.register(models.HeroSection)
class HeroSectionAdmin(OrderedModelAdmin):
    list_display = ("title", "rating", "order", "is_active", "updated_at")
    search_fields = ("title", "subtitle")


@admin.register(models.HomeStatistic)
class HomeStatisticAdmin(OrderedModelAdmin):
    list_display = ("__str__", "icon", "order", "is_active")
    search_fields = ("label", "value", "icon")


@admin.register(models.MottoStep)
class MottoStepAdmin(OrderedModelAdmin):
    list_display = ("title", "number", "step_label", "tone", "order", "is_active")
    search_fields = ("title", "step_label")


@admin.register(models.Sector)
class SectorAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_featured", "is_active", "order")
    list_editable = ("is_featured", "is_active", "order")
    list_filter = ("is_featured", "is_active")
    ordering = ("order", "name")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(models.Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ("name", "flag_emoji", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter = ("is_active",)
    ordering = ("order", "name")
    search_fields = ("name",)


@admin.register(models.Testimonial)
class TestimonialAdmin(OrderedModelAdmin):
    list_display = ("author", "brand", "order", "is_active")
    search_fields = ("author", "brand", "quote")


@admin.register(models.Membership)
class MembershipAdmin(OrderedModelAdmin):
    search_fields = ("title",)


@admin.register(models.Client)
class ClientAdmin(OrderedModelAdmin):
    search_fields = ("name",)


@admin.register(models.WhyChooseUsItem)
class WhyChooseUsItemAdmin(OrderedModelAdmin):
    list_display = ("number", "title", "order", "is_active")
    search_fields = ("number", "title")


@admin.register(models.AboutAccordionItem)
class AboutAccordionItemAdmin(OrderedModelAdmin):
    search_fields = ("title", "body")


@admin.register(models.RecruitmentStep)
class RecruitmentStepAdmin(OrderedModelAdmin):
    search_fields = ("title", "body")


@admin.register(models.NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "is_published", "published_at", "updated_at")
    list_editable = ("is_published", "published_at")
    list_filter = ("is_published", "published_at")
    search_fields = ("title", "author", "excerpt", "content")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(models.Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "company",
        "sector",
        "country",
        "vacancies",
        "is_featured",
        "is_active",
        "created_at",
    )
    list_filter = ("is_active", "is_featured", "sector", "country")
    search_fields = ("title", "company", "salary")


@admin.register(models.DemandList)
class DemandListAdmin(OrderedModelAdmin):
    list_display = ("title", "employer", "country", "sector", "positions", "is_active", "order")
    list_filter = ("is_active", "country", "sector")
    search_fields = ("title", "employer", "description")


@admin.register(models.CareerOpening)
class CareerOpeningAdmin(OrderedModelAdmin):
    list_display = ("title", "order", "is_active")
    search_fields = ("title", "description")


@admin.register(models.Certificate)
class CertificateAdmin(OrderedModelAdmin):
    list_display = ("title", "tag", "order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "tag")
    fields = ("title", "tag", "image", "document", "order", "is_active")


class GalleryImageInline(admin.TabularInline):
    model = models.GalleryImage
    extra = 1
    ordering = ("order",)


@admin.register(models.GalleryAlbum)
class GalleryAlbumAdmin(OrderedModelAdmin):
    list_display = ("title", "slug", "order", "is_active")
    search_fields = ("title", "description")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [GalleryImageInline]


@admin.register(models.GalleryImage)
class GalleryImageAdmin(OrderedModelAdmin):
    list_display = ("title", "album", "order", "is_active")
    search_fields = ("title", "caption")
    list_filter = ("is_active", "album")


@admin.register(models.PageMeta)
class PageMetaAdmin(admin.ModelAdmin):
    list_display = ("path", "title", "is_active", "updated_at")
    list_editable = ("is_active",)
    search_fields = ("path", "title", "description", "keywords")


@admin.register(models.CMSPage)
class CMSPageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_published", "show_in_nav", "order", "updated_at")
    list_editable = ("is_published", "show_in_nav", "order")
    search_fields = ("title", "slug", "content")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(models.FooterLink)
class FooterLinkAdmin(OrderedModelAdmin):
    search_fields = ("label", "path")


@admin.register(models.QuickLink)
class QuickLinkAdmin(OrderedModelAdmin):
    search_fields = ("label", "path")


@admin.register(models.FAQ)
class FAQAdmin(OrderedModelAdmin):
    search_fields = ("question", "answer")


@admin.register(models.MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("title", "file", "created_at")
    search_fields = ("title", "alt_text", "file")


@admin.register(models.ContentBlock)
class ContentBlockAdmin(OrderedModelAdmin):
    list_display = ("label", "key", "page", "order", "is_active", "updated_at")
    list_filter = ("page", "is_active")
    search_fields = ("label", "key", "heading", "body")
    list_editable = ("order", "is_active")


@admin.register(models.ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "subject", "handled", "created_at")
    list_editable = ("handled",)
    list_filter = ("handled", "created_at")
    search_fields = ("full_name", "email", "subject", "message")
    readonly_fields = ("full_name", "email", "subject", "message", "phone", "created_at", "updated_at")


@admin.register(models.PartnershipInquiry)
class PartnershipInquiryAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "phone", "handled", "created_at")
    list_editable = ("handled",)
    list_filter = ("handled", "created_at")
    search_fields = ("full_name", "email", "phone", "message")
    readonly_fields = ("full_name", "email", "phone", "message", "created_at", "updated_at")


@admin.register(models.RegistrationSubmission)
class RegistrationSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "last_name",
        "email",
        "position",
        "preferred_country",
        "handled",
        "created_at",
    )
    list_editable = ("handled",)
    list_filter = ("handled", "preferred_country", "created_at")
    search_fields = ("first_name", "last_name", "email", "position", "preferred_country")
    readonly_fields = (
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
        "updated_at",
    )
