from django.contrib import admin
from .models import (
    Agency,
    Album,
    ContactSection,
    Content,
    Job,
    Official,
    Service,
    SiteSettings,
    StaticPage,
    TeamMember,
)


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "published_at", "featured", "display_order")
    list_filter = ("category", "featured")
    search_fields = ("title", "summary", "body", "meta_title", "meta_description")
    ordering = ("display_order", "-published_at")
    fieldsets = (
        (None, {"fields": ("title", "category", "published_at", "featured", "display_order")}),
        ("Body", {"fields": ("summary", "body", "file_url")}),
        ("SEO", {"fields": ("meta_title", "meta_description"), "classes": ("collapse",)}),
    )


@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    list_display = ("name", "agency_type", "license", "status", "display_order")
    list_filter = ("agency_type", "status")
    search_fields = ("name", "license", "address", "phone", "email")
    ordering = ("agency_type", "display_order", "name")


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "href", "display_order")
    search_fields = ("title", "href", "description")
    ordering = ("display_order", "title")


@admin.register(Official)
class OfficialAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "email", "phone", "display_order")
    search_fields = ("name", "role", "email", "phone")
    ordering = ("display_order", "name")


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "designation", "division", "section", "phone", "display_order")
    list_filter = ("division", "section", "designation")
    search_fields = ("name", "designation", "division", "section", "email", "phone")
    ordering = ("display_order", "name")


@admin.register(StaticPage)
class StaticPageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "display_order", "updated_at")
    search_fields = ("title", "slug", "body", "meta_description")
    prepopulated_fields = {"slug": ("title",)}
    ordering = ("display_order", "title")
    fieldsets = (
        (None, {"fields": ("title", "slug", "body", "display_order")}),
        ("SEO", {"fields": ("meta_description",), "classes": ("collapse",)}),
    )


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ("title", "media_type", "count", "published_at", "display_order")
    list_filter = ("media_type",)
    search_fields = ("title",)
    ordering = ("display_order", "-published_at", "title")


@admin.register(ContactSection)
class ContactSectionAdmin(admin.ModelAdmin):
    list_display = ("serial_no", "name", "display_order")
    search_fields = ("serial_no", "name", "rows")
    ordering = ("display_order", "serial_no")


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "country", "vacancies", "deadline", "status")
    list_filter = ("status", "country")
    search_fields = ("title", "company", "country", "salary", "contract")
    ordering = ("display_order", "status", "deadline")


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("site_name", "ministry", "phone", "email", "updated_at")
    search_fields = ("site_name", "ministry", "address", "phone", "email")
    fieldsets = (
        (None, {"fields": ("site_name", "ministry", "singleton_key")}),
        ("NAP / Contact", {"fields": ("address", "phone", "toll_free", "email")}),
        (
            "SEO / Social",
            {
                "fields": (
                    "site_url",
                    "og_image_url",
                    "facebook_url",
                    "twitter_url",
                    "gsc_verification",
                )
            },
        ),
        ("Admin demo credentials", {"fields": ("admin_user", "admin_password")}),
    )
