from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class OrderedModel(TimeStampedModel):
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        abstract = True
        ordering = ["display_order", "-created_at"]


class Content(OrderedModel):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=64, db_index=True)
    published_at = models.DateTimeField()
    summary = models.TextField(blank=True)
    body = models.TextField(blank=True)
    file_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    class Meta(OrderedModel.Meta):
        indexes = [
            models.Index(fields=["category", "-published_at"]),
            models.Index(fields=["featured", "-published_at"]),
        ]

    def __str__(self):
        return self.title


class Agency(OrderedModel):
    STATUS_ACTIVE = "Active"
    STATUS_SUSPENDED = "Suspended"
    STATUS_EXPIRED = "Expired"
    STATUS_CHOICES = (
        (STATUS_ACTIVE, "Active"),
        (STATUS_SUSPENDED, "Suspended"),
        (STATUS_EXPIRED, "Expired"),
    )

    agency_type = models.CharField(max_length=64, db_index=True)
    name = models.CharField(max_length=255)
    license = models.CharField(max_length=128)
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=64, blank=True)
    email = models.EmailField(blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_ACTIVE)

    class Meta(OrderedModel.Meta):
        indexes = [models.Index(fields=["agency_type", "status"])]

    def __str__(self):
        return self.name


class Service(OrderedModel):
    title = models.CharField(max_length=255)
    href = models.URLField(max_length=500)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title


class Official(OrderedModel):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=64, blank=True)

    def __str__(self):
        return f"{self.name} ({self.role})"


class TeamMember(OrderedModel):
    name = models.CharField(max_length=200)
    designation = models.CharField(max_length=200)
    division = models.CharField(max_length=200, blank=True)
    section = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=64, blank=True)
    email = models.EmailField(blank=True)
    photo_url = models.URLField(blank=True, max_length=500)

    def __str__(self):
        return self.name


class StaticPage(OrderedModel):
    slug = models.SlugField(max_length=150, unique=True)
    title = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    meta_description = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug and self.title:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Album(OrderedModel):
    TYPE_PHOTOS = "Photographs"
    TYPE_AV = "Audio Visual"
    TYPE_CHOICES = (
        (TYPE_PHOTOS, "Photographs"),
        (TYPE_AV, "Audio Visual"),
    )

    title = models.CharField(max_length=255)
    count = models.PositiveIntegerField(default=0)
    media_type = models.CharField(max_length=32, choices=TYPE_CHOICES, default=TYPE_PHOTOS)
    published_at = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title


class ContactSection(OrderedModel):
    serial_no = models.CharField(max_length=32)
    name = models.CharField(max_length=255)
    rows = models.TextField(help_text="One contact row per line.")

    def __str__(self):
        return self.name


class Job(OrderedModel):
    STATUS_OPEN = "Open"
    STATUS_CLOSED = "Closed"
    STATUS_CHOICES = (
        (STATUS_OPEN, "Open"),
        (STATUS_CLOSED, "Closed"),
    )

    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    country = models.CharField(max_length=120)
    vacancies = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    salary = models.CharField(max_length=120, blank=True)
    contract = models.CharField(max_length=120, blank=True)
    deadline = models.DateField()
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_OPEN)

    class Meta(OrderedModel.Meta):
        indexes = [models.Index(fields=["status", "deadline"])]

    def __str__(self):
        return f"{self.title} - {self.company}"


class SiteSettings(TimeStampedModel):
    singleton_key = models.CharField(max_length=32, unique=True, default="default")
    site_name = models.CharField(max_length=255)
    ministry = models.CharField(max_length=255, blank=True)
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=100, blank=True)
    toll_free = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    admin_user = models.CharField(max_length=150, default="admin")
    admin_password = models.CharField(max_length=255, default="admin123")
    site_url = models.URLField(blank=True, help_text="Public frontend origin, e.g. https://dofe.gov.np")
    og_image_url = models.URLField(blank=True, max_length=500)
    facebook_url = models.URLField(blank=True, max_length=500)
    twitter_url = models.URLField(blank=True, max_length=500)
    gsc_verification = models.CharField(
        max_length=255,
        blank=True,
        help_text="Google Search Console HTML-tag verification token",
    )

    class Meta:
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.site_name
