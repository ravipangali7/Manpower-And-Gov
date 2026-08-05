from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SiteConfiguration(TimestampedModel):
    company_name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=255)
    primary_email = models.EmailField()
    po_box = models.CharField(max_length=100, blank=True)
    notice_text = models.TextField(blank=True)
    tagline = models.CharField(max_length=255, blank=True)
    map_embed_url = models.URLField(blank=True, max_length=500)
    business_hours = models.CharField(max_length=255, blank=True)
    cv_download_url = models.URLField(blank=True)
    license_number = models.CharField(max_length=120, blank=True)
    logo = models.ImageField(upload_to="site/", blank=True, null=True)
    favicon = models.ImageField(upload_to="site/", blank=True, null=True)
    # Default SEO
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)
    og_image = models.ImageField(upload_to="seo/", blank=True, null=True)
    # Partner CTA
    partner_cta_heading = models.CharField(max_length=200, blank=True, default="Partner With Us")
    partner_cta_body = models.TextField(blank=True)
    partner_cta_button_label = models.CharField(max_length=80, blank=True, default="Contact Us")
    partner_cta_button_path = models.CharField(max_length=200, blank=True, default="/contact")
    # Hiring widget
    hiring_enabled = models.BooleanField(default=True)
    hiring_heading = models.CharField(max_length=120, blank=True, default="WE ARE HIRING!")
    hiring_subheading = models.CharField(max_length=120, blank=True, default="Open Positions")
    hiring_button_label = models.CharField(max_length=80, blank=True, default="APPLY NOW")
    hiring_button_path = models.CharField(max_length=200, blank=True, default="/online-registration")
    # Home intro block
    ethic_heading = models.CharField(max_length=200, blank=True, default="Ethical Recruitment")
    ethic_eyebrow = models.CharField(max_length=80, blank=True, default="What we do")
    ethic_body = models.TextField(blank=True)
    ethic_button_label = models.CharField(max_length=80, blank=True, default="Learn More")
    ethic_button_path = models.CharField(max_length=200, blank=True, default="/ethical-recruitment")
    # Home section copy & media
    motto_heading = models.CharField(max_length=120, blank=True, default="Our Motto")
    motto_intro = models.TextField(
        blank=True,
        default=(
            "At Vision we always deliver by following a simple policy- when it comes to our "
            "clients, we simply"
        ),
    )
    expertise_heading = models.CharField(max_length=120, blank=True, default="Our Expertise")
    expertise_intro = models.TextField(
        blank=True,
        default=(
            "Our capacity enables us to provide highly qualified employees in the following "
            "sectors, without compromising on quality."
        ),
    )
    expertise_button_label = models.CharField(max_length=80, blank=True, default="Learn More")
    expertise_button_path = models.CharField(max_length=200, blank=True, default="/services")
    testimonials_heading = models.CharField(max_length=120, blank=True, default="Testimonial")
    membership_heading = models.CharField(max_length=120, blank=True, default="Membership")
    clients_heading = models.CharField(max_length=120, blank=True, default="PROUD TO WORK WITH")
    stats_background = models.ImageField(upload_to="home/", blank=True, null=True)
    testimonials_background = models.ImageField(upload_to="home/", blank=True, null=True)
    # Home partnership inquiry form
    partnership_form_heading = models.CharField(max_length=120, blank=True, default="Partner With Us")
    partnership_form_success = models.TextField(
        blank=True,
        default="Thank you — we received your message and will reply shortly.",
    )
    partnership_form_submit_label = models.CharField(max_length=80, blank=True, default="Submit")
    partnership_form_sending_label = models.CharField(max_length=80, blank=True, default="Sending…")
    partnership_form_name_label = models.CharField(max_length=80, blank=True, default="Full name")
    partnership_form_phone_label = models.CharField(max_length=80, blank=True, default="Phone")
    partnership_form_email_label = models.CharField(max_length=80, blank=True, default="Email")
    partnership_form_message_label = models.CharField(max_length=80, blank=True, default="Message")

    class Meta:
        verbose_name = "Site Configuration"
        verbose_name_plural = "Site Configuration"

    def __str__(self):
        return self.company_name


class ContactNumber(TimestampedModel):
    site = models.ForeignKey(
        SiteConfiguration, on_delete=models.CASCADE, related_name="contact_numbers"
    )
    label = models.CharField(max_length=100, blank=True)
    number = models.CharField(max_length=30)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.label or 'Phone'}: {self.number}"


class OfficeLocation(TimestampedModel):
    site = models.ForeignKey(
        SiteConfiguration, on_delete=models.CASCADE, related_name="offices"
    )
    title = models.CharField(max_length=120)
    office_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class SocialLink(TimestampedModel):
    PLATFORM_CHOICES = (
        ("facebook", "Facebook"),
        ("instagram", "Instagram"),
        ("linkedin", "LinkedIn"),
        ("twitter", "Twitter / X"),
        ("youtube", "YouTube"),
        ("tiktok", "TikTok"),
        ("other", "Other"),
    )
    platform = models.CharField(max_length=40, choices=PLATFORM_CHOICES)
    label = models.CharField(max_length=80, blank=True)
    url = models.URLField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.label or self.platform


class NavigationLink(TimestampedModel):
    label = models.CharField(max_length=120)
    path = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    open_in_new_tab = models.BooleanField(default=False)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="children",
    )

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.label


class HeroSection(TimestampedModel):
    """Homepage hero slider — multiple active rows rotate on the frontend."""

    eyebrow = models.CharField(max_length=180, blank=True)
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)
    body = models.TextField(blank=True)
    background_image = models.ImageField(upload_to="hero/", blank=True, null=True)
    cta_primary_label = models.CharField(max_length=80, blank=True)
    cta_primary_path = models.CharField(max_length=200, blank=True)
    cta_secondary_label = models.CharField(max_length=80, blank=True)
    cta_secondary_path = models.CharField(max_length=200, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=4.9)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Hero Slide"
        verbose_name_plural = "Hero Slides"

    def __str__(self):
        return self.title


class HomeStatistic(TimestampedModel):
    value = models.CharField(max_length=50)
    label = models.CharField(max_length=120)
    icon = models.CharField(
        max_length=80,
        blank=True,
        help_text="Icon key: users, wrench, globe, star, briefcase, map-pin, etc.",
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.label


class MottoStep(TimestampedModel):
    step_label = models.CharField(max_length=30)
    number = models.PositiveIntegerField()
    title = models.CharField(max_length=80)
    icon = models.CharField(max_length=80, blank=True, help_text="Optional icon key, e.g. listen, plan")
    tone = models.CharField(max_length=20, choices=(("red", "Red"), ("blue", "Blue")))
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Sector(TimestampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=80, blank=True)
    image = models.ImageField(upload_to="sectors/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Country(TimestampedModel):
    name = models.CharField(max_length=120, unique=True)
    flag_emoji = models.CharField(max_length=8, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class Testimonial(TimestampedModel):
    quote = models.TextField()
    author = models.CharField(max_length=180)
    brand = models.CharField(max_length=120, blank=True)
    photo = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.author


class Membership(TimestampedModel):
    title = models.CharField(max_length=160)
    url = models.URLField(blank=True)
    logo = models.ImageField(upload_to="memberships/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Client(TimestampedModel):
    name = models.CharField(max_length=160)
    url = models.URLField(blank=True)
    logo = models.ImageField(upload_to="clients/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Partner / Client"
        verbose_name_plural = "Partners / Clients"

    def __str__(self):
        return self.name


class WhyChooseUsItem(TimestampedModel):
    number = models.CharField(max_length=10)
    title = models.CharField(max_length=180)
    body = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class AboutAccordionItem(TimestampedModel):
    title = models.CharField(max_length=180)
    body = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class RecruitmentStep(TimestampedModel):
    title = models.CharField(max_length=180)
    body = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class NewsArticle(TimestampedModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    author = models.CharField(max_length=120)
    excerpt = models.TextField()
    content = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to="news/", blank=True, null=True)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Job(TimestampedModel):
    title = models.CharField(max_length=180)
    company = models.CharField(max_length=180)
    sector = models.ForeignKey(Sector, on_delete=models.PROTECT, related_name="jobs")
    country = models.ForeignKey(Country, on_delete=models.PROTECT, related_name="jobs")
    vacancies = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    salary = models.CharField(max_length=180, blank=True)
    description = models.TextField(blank=True)
    requirements = models.TextField(blank=True)
    deadline = models.DateField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at", "title"]

    def __str__(self):
        return f"{self.title} - {self.company}"


class DemandList(TimestampedModel):
    """Employer demand letters / demand list entries shown publicly."""

    title = models.CharField(max_length=255)
    employer = models.CharField(max_length=180, blank=True)
    country = models.ForeignKey(
        Country, on_delete=models.SET_NULL, null=True, blank=True, related_name="demands"
    )
    sector = models.ForeignKey(
        Sector, on_delete=models.SET_NULL, null=True, blank=True, related_name="demands"
    )
    positions = models.PositiveIntegerField(default=1)
    description = models.TextField(blank=True)
    document = models.FileField(upload_to="demands/", blank=True, null=True)
    published_at = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-published_at", "order", "-created_at"]
        verbose_name = "Demand List Item"
        verbose_name_plural = "Demand List"

    def __str__(self):
        return self.title


class CareerOpening(TimestampedModel):
    """Internal company career openings (footer hiring widget)."""

    title = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    apply_path = models.CharField(max_length=200, blank=True, default="/online-registration")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Career Opening"
        verbose_name_plural = "Career Openings"

    def __str__(self):
        return self.title


class Certificate(TimestampedModel):
    title = models.CharField(max_length=255)
    tag = models.CharField(max_length=60, default="CERTIFICATES")
    image = models.ImageField(upload_to="certificates/", blank=True, null=True)
    document = models.FileField(upload_to="certificates/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class GalleryAlbum(TimestampedModel):
    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    cover = models.ImageField(upload_to="gallery/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class GalleryImage(TimestampedModel):
    album = models.ForeignKey(
        GalleryAlbum, on_delete=models.CASCADE, related_name="images", null=True, blank=True
    )
    title = models.CharField(max_length=180, blank=True)
    image = models.ImageField(upload_to="gallery/")
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title or f"Gallery image {self.pk}"


class PageMeta(TimestampedModel):
    """Per-route SEO overrides managed from Super Admin."""

    path = models.CharField(max_length=200, unique=True, help_text="e.g. /, /about, /contact")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    keywords = models.CharField(max_length=500, blank=True)
    og_image = models.ImageField(upload_to="seo/", blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["path"]
        verbose_name = "Page SEO"
        verbose_name_plural = "Page SEO"

    def __str__(self):
        return f"{self.path} — {self.title}"


class CMSPage(TimestampedModel):
    """Simple CMS pages (Methodology, Career, custom pages)."""

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    excerpt = models.TextField(blank=True)
    content = models.TextField(blank=True)
    banner_image = models.ImageField(upload_to="pages/", blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    is_published = models.BooleanField(default=True)
    show_in_nav = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "title"]
        verbose_name = "CMS Page"
        verbose_name_plural = "CMS Pages"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class FooterLink(TimestampedModel):
    label = models.CharField(max_length=180)
    path = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.label


class QuickLink(TimestampedModel):
    label = models.CharField(max_length=180)
    path = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.label


class FAQ(TimestampedModel):
    question = models.CharField(max_length=180)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.question


class MediaAsset(TimestampedModel):
    title = models.CharField(max_length=180, blank=True)
    file = models.FileField(upload_to="media-library/")
    alt_text = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Media Asset"
        verbose_name_plural = "Media Library"

    def __str__(self):
        return self.title or self.file.name


class ContentBlock(TimestampedModel):
    """Editable page prose / section copy managed from Super Admin."""

    PAGE_CHOICES = (
        ("about", "About Us"),
        ("services", "Services"),
        ("overseas-recruitment", "Overseas Recruitment"),
        ("ethical-recruitment", "Ethical Recruitment"),
        ("home", "Home"),
        ("careers", "Careers"),
        ("contact", "Contact"),
        ("awards", "Awards"),
        ("gallery", "Gallery"),
        ("demands", "Demands"),
        ("vacancies", "Vacancies"),
        ("other", "Other"),
    )

    key = models.SlugField(max_length=120, unique=True)
    page = models.CharField(max_length=60, choices=PAGE_CHOICES, db_index=True)
    label = models.CharField(max_length=160, help_text="Admin-friendly name")
    heading = models.CharField(max_length=255, blank=True)
    subheading = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)
    body_2 = models.TextField(blank=True)
    body_3 = models.TextField(blank=True)
    image = models.ImageField(upload_to="content/", blank=True, null=True)
    video_url = models.URLField(blank=True, max_length=500)
    cta_label = models.CharField(max_length=80, blank=True)
    cta_path = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["page", "order", "id"]
        verbose_name = "Content Block"
        verbose_name_plural = "Content Blocks"

    def __str__(self):
        return f"{self.label} ({self.key})"


class ContactInquiry(TimestampedModel):
    full_name = models.CharField(max_length=180)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    handled = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Contact inquiries"

    def __str__(self):
        return f"{self.full_name} - {self.subject}"


class PartnershipInquiry(TimestampedModel):
    full_name = models.CharField(max_length=180)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    message = models.TextField()
    handled = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Partnership inquiries"

    def __str__(self):
        return f"{self.full_name} - Partnership inquiry"


class RegistrationSubmission(TimestampedModel):
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    email = models.EmailField()
    contact_number = models.CharField(max_length=30)
    permanent_address = models.CharField(max_length=255)
    temporary_address = models.CharField(max_length=255, blank=True)
    position = models.CharField(max_length=180)
    preferred_country = models.CharField(max_length=120)
    message = models.TextField(blank=True)
    cv_file = models.FileField(upload_to="cvs/", blank=True, null=True)
    handled = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.position}"
