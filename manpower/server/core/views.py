from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db.models import Count, Prefetch, Q, Sum
from django.utils import timezone
from rest_framework import parsers, status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response

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
    CMSPageSerializer,
    CareerOpeningSerializer,
    CertificateSerializer,
    ClientSerializer,
    ContentBlockSerializer,
    DemandListSerializer,
    GalleryAlbumSerializer,
    GalleryImageSerializer,
    HeroSectionSerializer,
    MembershipSerializer,
    NewsArticleSerializer,
    PageMetaSerializer,
    SectorSerializer,
    SiteConfigurationSerializer,
    SocialLinkSerializer,
    TestimonialSerializer,
    absolute_media_url,
)


def _site():
    return SiteConfiguration.objects.prefetch_related("contact_numbers", "offices").order_by(
        "-updated_at"
    ).first()


def _serialize_news(article, request=None):
    return NewsArticleSerializer(article, context={"request": request}).data


@api_view(["GET"])
def health_check(request):
    return Response({"status": "ok", "timestamp": timezone.now()})


@api_view(["GET"])
def navigation_data(request):
    roots = NavigationLink.objects.filter(is_active=True, parent__isnull=True).prefetch_related(
        Prefetch("children", queryset=NavigationLink.objects.filter(is_active=True).order_by("order", "id"))
    )
    nav_links = []
    for link in roots:
        item = {
            "id": link.id,
            "label": link.label,
            "path": link.path,
            "order": link.order,
            "open_in_new_tab": link.open_in_new_tab,
            "children": [
                {
                    "id": c.id,
                    "label": c.label,
                    "path": c.path,
                    "order": c.order,
                    "open_in_new_tab": c.open_in_new_tab,
                }
                for c in link.children.all()
            ],
        }
        nav_links.append(item)

    footer_links = list(
        FooterLink.objects.filter(is_active=True).values("id", "label", "path", "order")
    )
    quick_links = list(
        QuickLink.objects.filter(is_active=True).values("id", "label", "path", "order")
    )
    social_links = SocialLinkSerializer(
        SocialLink.objects.filter(is_active=True), many=True, context={"request": request}
    ).data
    cms_nav = list(
        CMSPage.objects.filter(is_published=True, show_in_nav=True).values(
            "title", "slug", "order"
        )
    )
    return Response(
        {
            "navigation": nav_links,
            "footer_links": footer_links,
            "quick_links": quick_links,
            "social_links": social_links,
            "cms_pages": cms_nav,
        }
    )


@api_view(["GET"])
def home_page_data(request):
    heroes = HeroSection.objects.filter(is_active=True)
    featured_sectors = Sector.objects.filter(is_active=True, is_featured=True)
    if not featured_sectors.exists():
        featured_sectors = Sector.objects.filter(is_active=True)[:10]

    total_vacancies = (
        Job.objects.filter(is_active=True).aggregate(total=Sum("vacancies"))["total"] or 0
    )
    total_sectors = Sector.objects.filter(is_active=True).count()
    total_countries = Country.objects.filter(is_active=True).count()
    site = _site()

    return Response(
        {
            "hero_slides": HeroSectionSerializer(
                heroes, many=True, context={"request": request}
            ).data,
            "hero": HeroSectionSerializer(
                heroes.first(), context={"request": request}
            ).data
            if heroes.exists()
            else None,
            "ethic": {
                "eyebrow": site.ethic_eyebrow if site else "What we do",
                "heading": site.ethic_heading if site else "Ethical Recruitment",
                "body": site.ethic_body if site else "",
                "button_label": site.ethic_button_label if site else "Learn More",
                "button_path": site.ethic_button_path if site else "/ethical-recruitment",
            }
            if site
            else None,
            "sections": {
                "motto": {
                    "heading": site.motto_heading if site else "Our Motto",
                    "intro": site.motto_intro if site else "",
                },
                "expertise": {
                    "heading": site.expertise_heading if site else "Our Expertise",
                    "intro": site.expertise_intro if site else "",
                    "button_label": site.expertise_button_label if site else "Learn More",
                    "button_path": site.expertise_button_path if site else "/services",
                },
                "testimonials": {
                    "heading": site.testimonials_heading if site else "Testimonial",
                    "background_image_url": absolute_media_url(
                        request, site.testimonials_background if site else None
                    ),
                },
                "membership": {
                    "heading": site.membership_heading if site else "Membership",
                },
                "clients": {
                    "heading": site.clients_heading if site else "PROUD TO WORK WITH",
                },
                "stats": {
                    "background_image_url": absolute_media_url(
                        request, site.stats_background if site else None
                    ),
                },
                "partnership_form": {
                    "heading": site.partnership_form_heading if site else "Partner With Us",
                    "success_message": (
                        site.partnership_form_success
                        if site
                        else "Thank you — we received your message and will reply shortly."
                    ),
                    "submit_label": site.partnership_form_submit_label if site else "Submit",
                    "sending_label": site.partnership_form_sending_label if site else "Sending…",
                    "name_label": site.partnership_form_name_label if site else "Full name",
                    "phone_label": site.partnership_form_phone_label if site else "Phone",
                    "email_label": site.partnership_form_email_label if site else "Email",
                    "message_label": site.partnership_form_message_label if site else "Message",
                },
            },
            "motto": list(
                MottoStep.objects.filter(is_active=True).values(
                    "id", "step_label", "number", "title", "icon", "tone", "order"
                )
            ),
            "stats": list(
                HomeStatistic.objects.filter(is_active=True).values(
                    "id", "value", "label", "icon", "order"
                )
            ),
            "computed_stats": {
                "workers_deployed": total_vacancies,
                "different_sectors": total_sectors,
                "different_countries": total_countries,
            },
            "expertise": SectorSerializer(
                featured_sectors, many=True, context={"request": request}
            ).data,
            "testimonials": TestimonialSerializer(
                Testimonial.objects.filter(is_active=True),
                many=True,
                context={"request": request},
            ).data,
            "memberships": MembershipSerializer(
                Membership.objects.filter(is_active=True),
                many=True,
                context={"request": request},
            ).data,
            "clients": ClientSerializer(
                Client.objects.filter(is_active=True),
                many=True,
                context={"request": request},
            ).data,
        }
    )


@api_view(["GET"])
def about_page_data(request):
    blocks = ContentBlock.objects.filter(page="about", is_active=True)
    return Response(
        {
            "why_choose_us": list(
                WhyChooseUsItem.objects.filter(is_active=True).values(
                    "id", "number", "title", "body", "order"
                )
            ),
            "accordion": list(
                AboutAccordionItem.objects.filter(is_active=True).values(
                    "id", "title", "body", "order"
                )
            ),
            "content_blocks": ContentBlockSerializer(
                blocks, many=True, context={"request": request}
            ).data,
        }
    )


@api_view(["GET"])
def services_page_data(request):
    blocks = ContentBlock.objects.filter(
        page__in=["services", "overseas-recruitment"], is_active=True
    ).order_by("order", "id")
    return Response(
        {
            "sectors": SectorSerializer(
                Sector.objects.filter(is_active=True).order_by("order", "name"),
                many=True,
                context={"request": request},
            ).data,
            "recruitment_steps": list(
                RecruitmentStep.objects.filter(is_active=True)
                .order_by("order", "id")
                .values("id", "title", "body", "order")
            ),
            "content_blocks": ContentBlockSerializer(
                blocks, many=True, context={"request": request}
            ).data,
        }
    )


def _parse_comparison_pairs(text: str):
    rows = []
    for raw in (text or "").replace("\r\n", "\n").split("\n"):
        line = raw.strip()
        if not line or "|||" not in line:
            continue
        left, right = line.split("|||", 1)
        rows.append({"left": left.strip(), "right": right.strip()})
    return rows


@api_view(["GET"])
def ethical_recruitment_page_data(request):
    blocks = ContentBlock.objects.filter(
        page="ethical-recruitment", is_active=True
    ).order_by("order", "id")
    comparison_block = next((b for b in blocks if b.key == "ethical.comparison"), None)
    headers = _parse_comparison_pairs(comparison_block.body_3 if comparison_block else "")
    left_header = headers[0]["left"] if headers else "Ethical"
    right_header = headers[0]["right"] if headers else "Zero-cost"
    hero = next((b for b in blocks if b.key == "ethical.hero"), None)

    return Response(
        {
            "page_title": (hero.heading if hero and hero.heading else "Ethical Recruitment"),
            "content_blocks": ContentBlockSerializer(
                blocks, many=True, context={"request": request}
            ).data,
            "comparison": {
                "heading": comparison_block.heading if comparison_block else "",
                "icon": comparison_block.subheading if comparison_block else "",
                "intro": comparison_block.body if comparison_block else "",
                "left_header": left_header,
                "right_header": right_header,
                "rows": _parse_comparison_pairs(
                    comparison_block.body_2 if comparison_block else ""
                ),
            }
            if comparison_block
            else None,
        }
    )


def _related_lookup(param, *, name_field, id_field, slug_field=None):
    """Match by name/slug, and by numeric id only when the param is digits."""
    if not param:
        return Q()
    query = Q(**{f"{name_field}__iexact": param})
    if slug_field:
        query |= Q(**{slug_field: param})
    if str(param).isdigit():
        query |= Q(**{id_field: int(param)})
    return query


def _serialize_content_blocks(request, page: str):
    blocks = ContentBlock.objects.filter(page=page, is_active=True).order_by("order", "id")
    return ContentBlockSerializer(blocks, many=True, context={"request": request}).data


@api_view(["GET"])
def vacancies_data(request):
    sector = request.query_params.get("sector")
    country = request.query_params.get("country")
    sort = request.query_params.get("sort", "newest")

    qs = Job.objects.select_related("sector", "country").filter(is_active=True)
    if sector:
        qs = qs.filter(
            _related_lookup(
                sector,
                name_field="sector__name",
                id_field="sector__id",
                slug_field="sector__slug",
            )
        )
    if country:
        qs = qs.filter(
            _related_lookup(
                country,
                name_field="country__name",
                id_field="country__id",
            )
        )

    if sort == "vacancies":
        qs = qs.order_by("-vacancies", "-created_at")
    elif sort == "title":
        qs = qs.order_by("title")
    else:
        qs = qs.order_by("-is_featured", "-created_at")

    jobs_data = [
        {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "sector": job.sector.name,
            "country": job.country.name,
            "vacancies": job.vacancies,
            "salary": job.salary,
            "description": job.description,
            "requirements": job.requirements,
            "deadline": job.deadline,
            "is_featured": job.is_featured,
            "created_at": job.created_at,
        }
        for job in qs
    ]

    sector_counts = (
        Sector.objects.filter(is_active=True)
        .annotate(count=Count("jobs", filter=Q(jobs__is_active=True)))
        .values("id", "name", "slug", "count")
    )
    country_counts = (
        Country.objects.filter(is_active=True)
        .annotate(count=Count("jobs", filter=Q(jobs__is_active=True)))
        .values("id", "name", "count")
    )

    return Response(
        {
            "jobs": jobs_data,
            "job_sectors": list(sector_counts),
            "job_countries": list(country_counts),
            "filters": {"sector": sector, "country": country, "sort": sort},
            "content_blocks": _serialize_content_blocks(request, "vacancies"),
        }
    )


@api_view(["GET"])
def demand_list_data(request):
    qs = DemandList.objects.filter(is_active=True).select_related("sector", "country")
    return Response(
        {
            "demands": DemandListSerializer(
                qs, many=True, context={"request": request}
            ).data,
            "content_blocks": _serialize_content_blocks(request, "demands"),
        }
    )


@api_view(["GET"])
def news_list(request):
    articles = NewsArticle.objects.filter(is_published=True).order_by(
        "-published_at", "-created_at"
    )
    return Response([_serialize_news(article, request) for article in articles])


@api_view(["GET"])
def news_detail(request, slug):
    article = (
        NewsArticle.objects.filter(is_published=True, slug=slug)
        .order_by("-published_at", "-created_at")
        .first()
    )
    if not article:
        return Response({"detail": "Article not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(_serialize_news(article, request))


@api_view(["GET"])
def awards_data(request):
    return Response(
        {
            "certificates": CertificateSerializer(
                Certificate.objects.filter(is_active=True),
                many=True,
                context={"request": request},
            ).data,
            "content_blocks": _serialize_content_blocks(request, "awards"),
        }
    )


@api_view(["GET"])
def gallery_data(request):
    albums = GalleryAlbum.objects.filter(is_active=True).prefetch_related(
        Prefetch(
            "images",
            queryset=GalleryImage.objects.filter(is_active=True).order_by("order", "id"),
        )
    )
    uncategorized = GalleryImage.objects.filter(is_active=True, album__isnull=True)
    return Response(
        {
            "albums": GalleryAlbumSerializer(
                albums, many=True, context={"request": request}
            ).data,
            "images": GalleryImageSerializer(
                uncategorized, many=True, context={"request": request}
            ).data,
        }
    )


@api_view(["GET"])
def careers_data(request):
    return Response(
        {
            "openings": CareerOpeningSerializer(
                CareerOpening.objects.filter(is_active=True), many=True
            ).data
        }
    )


@api_view(["GET"])
def cms_pages_list(request):
    pages = CMSPage.objects.filter(is_published=True)
    return Response(CMSPageSerializer(pages, many=True, context={"request": request}).data)


@api_view(["GET"])
def cms_page_detail(request, slug):
    page = CMSPage.objects.filter(is_published=True, slug=slug).first()
    if not page:
        return Response({"detail": "Page not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(CMSPageSerializer(page, context={"request": request}).data)


@api_view(["GET"])
def page_seo(request):
    path = request.query_params.get("path", "/")
    meta = PageMeta.objects.filter(is_active=True, path=path).first()
    if not meta:
        site = _site()
        if site:
            return Response(
                {
                    "path": path,
                    "title": site.meta_title or site.company_name,
                    "description": site.meta_description,
                    "keywords": site.meta_keywords,
                    "og_image_url": absolute_media_url(request, site.og_image),
                    "source": "site_defaults",
                }
            )
        return Response({"detail": "SEO not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(PageMetaSerializer(meta, context={"request": request}).data)


@api_view(["GET"])
def contact_page_data(request):
    site = _site()
    site_data = {}
    if site:
        site_data = SiteConfigurationSerializer(site, context={"request": request}).data

    return Response(
        {
            "site": site_data,
            "contact_numbers": list(
                ContactNumber.objects.order_by("order", "id").values(
                    "id", "label", "number", "order"
                )
            ),
            "offices": list(
                OfficeLocation.objects.order_by("order", "id").values(
                    "id", "title", "office_name", "address", "email", "phone", "order"
                )
            ),
            "faqs": list(
                FAQ.objects.filter(is_active=True).values(
                    "id", "question", "answer", "order"
                )
            ),
            "content_blocks": _serialize_content_blocks(request, "contact"),
        }
    )


@api_view(["GET"])
def site_settings_data(request):
    site = _site()
    if not site:
        return Response(
            {"detail": "Site configuration not found."}, status=status.HTTP_404_NOT_FOUND
        )

    data = SiteConfigurationSerializer(site, context={"request": request}).data
    data["social_links"] = SocialLinkSerializer(
        SocialLink.objects.filter(is_active=True), many=True, context={"request": request}
    ).data
    data["career_openings"] = CareerOpeningSerializer(
        CareerOpening.objects.filter(is_active=True), many=True
    ).data
    return Response(data)


@api_view(["POST"])
def submit_contact_inquiry(request):
    def _text(key, max_len=None):
        value = str(request.data.get(key) or "").strip()
        if max_len is not None:
            return value[:max_len]
        return value

    full_name = _text("full_name", 180)
    email = _text("email", 254)
    subject = _text("subject", 200)
    message = _text("message")
    phone = _text("phone", 30)

    missing = [
        field
        for field, value in (
            ("full_name", full_name),
            ("email", email),
            ("subject", subject),
        )
        if not value
    ]
    if missing:
        return Response(
            {"detail": "Missing required fields.", "missing_fields": missing},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        validate_email(email)
    except ValidationError:
        return Response(
            {"detail": "Enter a valid email address.", "missing_fields": ["email"]},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        inquiry = ContactInquiry.objects.create(
            full_name=full_name,
            email=email,
            subject=subject,
            message=message,
            phone=phone,
        )
    except Exception:
        return Response(
            {"detail": "Could not save your message. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {"id": inquiry.id, "message": "Contact inquiry submitted successfully."},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
def submit_partnership_inquiry(request):
    required_fields = ["full_name", "email", "phone", "message"]
    missing = [field for field in required_fields if not request.data.get(field)]
    if missing:
        return Response(
            {"detail": "Missing required fields.", "missing_fields": missing},
            status=status.HTTP_400_BAD_REQUEST,
        )

    inquiry = PartnershipInquiry.objects.create(
        full_name=request.data.get("full_name", "").strip(),
        email=request.data.get("email", "").strip(),
        phone=request.data.get("phone", "").strip(),
        message=request.data.get("message", "").strip(),
    )
    return Response(
        {"id": inquiry.id, "message": "Partnership inquiry submitted successfully."}
    )


@api_view(["POST"])
@parser_classes([parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser])
def submit_registration(request):
    required_fields = [
        "first_name",
        "last_name",
        "email",
        "contact_number",
        "permanent_address",
        "position",
        "preferred_country",
    ]
    missing = [field for field in required_fields if not request.data.get(field)]
    if missing:
        return Response(
            {"detail": "Missing required fields.", "missing_fields": missing},
            status=status.HTTP_400_BAD_REQUEST,
        )

    submission = RegistrationSubmission(
        first_name=request.data.get("first_name", "").strip(),
        last_name=request.data.get("last_name", "").strip(),
        email=request.data.get("email", "").strip(),
        contact_number=request.data.get("contact_number", "").strip(),
        permanent_address=request.data.get("permanent_address", "").strip(),
        temporary_address=request.data.get("temporary_address", "").strip(),
        position=request.data.get("position", "").strip(),
        preferred_country=request.data.get("preferred_country", "").strip(),
        message=request.data.get("message", "").strip(),
    )
    if request.FILES.get("cv_file"):
        submission.cv_file = request.FILES["cv_file"]
    submission.save()
    return Response({"id": submission.id, "message": "Registration submitted successfully."})
