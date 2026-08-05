from datetime import date, datetime, timezone as dt_timezone
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify

from core.models import (
    AboutAccordionItem,
    CMSPage,
    CareerOpening,
    Certificate,
    Client,
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
    QuickLink,
    RecruitmentStep,
    Sector,
    SiteConfiguration,
    SocialLink,
    Testimonial,
    WhyChooseUsItem,
)

# Website image assets (same files used by the public frontend)
WEB_ASSETS = Path(__file__).resolve().parents[4] / "web" / "src" / "assets"
WEB_PUBLIC = Path(__file__).resolve().parents[4] / "web" / "public"


class Command(BaseCommand):
    help = "Seed the database with Vision & Value Overseas website content"

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush-content",
            action="store_true",
            help="Clear seeded content tables before inserting (keeps users).",
        )

    def handle(self, *args, **options):
        if options["flush_content"]:
            self._flush()

        site = self._seed_site()
        self._seed_media(site)
        self._seed_nav()
        self._seed_home(site)
        self._seed_about()
        self._seed_services()
        self._seed_ethical_recruitment()
        self._seed_jobs()
        self._seed_news()
        self._seed_awards()
        self._seed_gallery()
        self._seed_contact(site)
        self._seed_cms_pages()
        self._seed_seo()
        self.stdout.write(self.style.SUCCESS("Seed complete — Super Admin mirrors website content."))

    def _flush(self):
        Job.objects.all().delete()
        NewsArticle.objects.all().delete()
        DemandList.objects.all().delete()
        CareerOpening.objects.all().delete()
        HeroSection.objects.all().delete()
        HomeStatistic.objects.all().delete()
        MottoStep.objects.all().delete()
        Testimonial.objects.all().delete()
        Membership.objects.all().delete()
        Client.objects.all().delete()
        WhyChooseUsItem.objects.all().delete()
        AboutAccordionItem.objects.all().delete()
        RecruitmentStep.objects.all().delete()
        Certificate.objects.all().delete()
        FAQ.objects.all().delete()
        NavigationLink.objects.all().delete()
        FooterLink.objects.all().delete()
        QuickLink.objects.all().delete()
        SocialLink.objects.all().delete()
        PageMeta.objects.all().delete()
        CMSPage.objects.all().delete()
        ContactNumber.objects.all().delete()
        OfficeLocation.objects.all().delete()
        GalleryImage.objects.all().delete()
        GalleryAlbum.objects.all().delete()
        MediaAsset.objects.all().delete()
        Sector.objects.all().delete()
        Country.objects.all().delete()
        SiteConfiguration.objects.all().delete()

    def _attach(self, field, path: Path, name: str | None = None):
        """Attach a local file to an ImageField/FileField if the file exists."""
        if not path.exists():
            self.stdout.write(self.style.WARNING(f"Missing asset: {path}"))
            return False
        with path.open("rb") as fh:
            field.save(name or path.name, File(fh), save=False)
        return True

    def _seed_site(self):
        defaults = {
            "company_name": "Vision & Value Overseas Pvt. Ltd.",
            "short_name": "VNVNEPAL",
            "address": "Dhapasi Marg, Basundhara-3, Kathmandu, Nepal",
            "primary_email": "info@vnvnepal.com",
            "po_box": "P.O. Box: 7764",
            "notice_text": (
                "NOTICE: At Vision & Value, we value your privacy and assure you that any "
                "concerns or complaints raised by candidates, visitors, stakeholders, or "
                "partners will be handled with complete confidentiality."
            ),
            "tagline": "Ethical Overseas Manpower Recruitment from Nepal",
            "map_embed_url": "https://www.google.com/maps?q=Dhapasi+Marg+Basundhara+Kathmandu&output=embed",
            "business_hours": "Sunday to Friday, 9:30 AM – 5:30 PM. We are closed on Saturdays and public holidays.",
            "cv_download_url": "",
            "license_number": "DOFE Licensed Recruitment Agency",
            "meta_title": "VNVNEPAL | Ethical Manpower & Overseas Recruitment Agency Nepal",
            "meta_description": (
                "Vision & Value Overseas Pvt. Ltd. is an ethical recruitment agency in Nepal, "
                "deploying skilled workers across Asia, the Middle East and Europe."
            ),
            "meta_keywords": "manpower nepal, overseas recruitment, ethical recruitment, VNVNEPAL",
            "partner_cta_heading": "Partner With Us",
            "partner_cta_body": (
                "Experience the strength of partnership with Vision and Value, your trusted "
                "recruitment ally. Collaborate with us to unlock a world of talent and opportunity, "
                "as we work together to shape the future of your organization through strategic "
                "staffing solutions and exceptional service"
            ),
            "partner_cta_button_label": "Partner With Us",
            "partner_cta_button_path": "/contact",
            "hiring_enabled": True,
            "hiring_heading": "WE ARE HIRING!",
            "hiring_subheading": "Open Positions",
            "hiring_button_label": "APPLY NOW",
            "hiring_button_path": "/online-registration",
            "ethic_eyebrow": "What we do",
            "ethic_heading": "Ethical Recruitment",
            "ethic_body": (
                "We have established ourselves as a reliable provider of migrant workers to "
                "partners across the globe by adhering to ethical recruitment standards and "
                "practices advocated by esteemed organizations like RBA, IRIS, and Fair Hiring. "
                "Our commitment to these principles ensures a seamless and unparalleled "
                "experience for our clients."
            ),
            "ethic_button_label": "Learn More",
            "ethic_button_path": "/ethical-recruitment",
            "motto_heading": "Our Motto",
            "motto_intro": (
                "At Vision we always deliver by following a simple policy- when it comes to our "
                "clients, we simply"
            ),
            "expertise_heading": "Our Expertise",
            "expertise_intro": (
                "Our capacity enables us to provide highly qualified employees in the following "
                "sectors, without compromising on quality."
            ),
            "expertise_button_label": "Learn More",
            "expertise_button_path": "/services",
            "testimonials_heading": "Testimonial",
            "membership_heading": "Membership",
            "clients_heading": "PROUD TO WORK WITH",
            "partnership_form_heading": "Partner With Us",
            "partnership_form_success": (
                "Thank you — we received your message and will reply shortly."
            ),
            "partnership_form_submit_label": "Submit",
            "partnership_form_sending_label": "Sending…",
            "partnership_form_name_label": "Full name",
            "partnership_form_phone_label": "Phone",
            "partnership_form_email_label": "Email",
            "partnership_form_message_label": "Message",
        }
        site = SiteConfiguration.objects.order_by("id").first()
        if site:
            for key, value in defaults.items():
                setattr(site, key, value)
            site.save()
        else:
            site = SiteConfiguration.objects.create(**defaults)

        logo_path = WEB_ASSETS / "logo.png"
        if logo_path.exists() and not site.logo:
            self._attach(site.logo, logo_path)
            site.save()

        stats_bg = WEB_ASSETS / "stats-bg.jpg"
        if stats_bg.exists():
            self._attach(site.stats_background, stats_bg)
            site.save()

        testimonial_bg = WEB_ASSETS / "testimonial-bg.jpg"
        if testimonial_bg.exists():
            self._attach(site.testimonials_background, testimonial_bg)
            site.save()

        ContactNumber.objects.filter(site=site).delete()
        phones = [
            ("Office", "+977-14379749"),
            ("Office", "+977-14379450"),
            ("Office", "+977-14379162"),
        ]
        for i, (label, number) in enumerate(phones):
            ContactNumber.objects.create(site=site, label=label, number=number, order=i)

        OfficeLocation.objects.filter(site=site).delete()
        OfficeLocation.objects.create(
            site=site,
            title="Nepal Office",
            office_name="Vision & Value Overseas Pvt. Ltd.",
            address="Dhapasi Marg, Basundhara-3, Kathmandu, Nepal",
            email="info@vnvnepal.com",
            phone="+977-14379749 / +977-14379450 / +977-14379162",
            order=0,
        )
        OfficeLocation.objects.create(
            site=site,
            title="Dubai Representative",
            office_name="VNV UAE Desk",
            address="Dubai, United Arab Emirates",
            email="info@vnvnepal.com",
            phone="",
            order=1,
        )

        SocialLink.objects.all().delete()
        socials = [
            ("facebook", "Facebook", "https://facebook.com"),
            ("instagram", "Instagram", "https://instagram.com"),
            ("linkedin", "LinkedIn", "https://linkedin.com"),
            ("youtube", "YouTube", "https://youtube.com"),
        ]
        for i, (platform, label, url) in enumerate(socials):
            SocialLink.objects.create(platform=platform, label=label, url=url, order=i)

        CareerOpening.objects.all().delete()
        careers = [
            "Accountant",
            "Documentation Assistant",
            "Talent Acquisition Officer",
            "Office Assistant",
            "Social Media Handler",
            "Videographer / Editor",
        ]
        for i, title in enumerate(careers):
            CareerOpening.objects.create(
                title=title,
                description=f"Open position: {title}. Send your CV to career@vnvnepal.com",
                order=i,
                is_active=True,
            )

        return site

    def _seed_media(self, site):
        """Upload website images into Super Admin media fields."""
        og = WEB_PUBLIC / "og-default.jpg"
        hero = WEB_ASSETS / "hero-seminar.jpg"
        banner = WEB_ASSETS / "page-banner.jpg"
        team = WEB_ASSETS / "about-team.jpg"
        stats = WEB_ASSETS / "stats-bg.jpg"
        favicon = WEB_PUBLIC / "favicon.ico"

        if not site.og_image and og.exists():
            self._attach(site.og_image, og, "og-default.jpg")
        if not site.favicon and favicon.exists():
            self._attach(site.favicon, favicon, "favicon.ico")
        site.save()

        assets = [
            ("Hero Seminar", hero, "Homepage hero — recruitment seminar"),
            ("Page Banner", banner, "Inner page banner background"),
            ("About Team", team, "Vision & Value Overseas staff group photo"),
            ("Stats Background", stats, "Homepage statistics section background"),
            ("OG Default", og, "Default Open Graph share image"),
        ]
        for title, path, alt in assets:
            if not path.exists():
                continue
            if MediaAsset.objects.filter(title=title).exists():
                continue
            asset = MediaAsset(title=title, alt_text=alt)
            self._attach(asset.file, path)
            asset.save()

    def _seed_nav(self):
        # Match the public website menu exactly
        NavigationLink.objects.all().delete()
        # Full site menu — matches CMS / reference header (10 items)
        top = [
            ("Home", "/", 0),
            ("About Us", "/about", 1),
            ("Methodology", "/methodology", 2),
            ("Our Services", "/services", 3),
            ("News & Updates", "/news", 4),
            ("Jobs", "/vacancies", 5),
            ("Demand List", "/demands", 6),
            ("Gallery", "/gallery", 7),
            ("Awards & Recognition", "/awards", 8),
            ("Contact", "/contact", 9),
        ]
        created = {}
        for label, path, order in top:
            created[label] = NavigationLink.objects.create(
                label=label, path=path, order=order
            )

        for i, (label, path) in enumerate(
            [
                ("Overseas Recruitment", "/services/overseas-recruitment"),
                ("Sectors and Industries", "/services"),
            ]
        ):
            NavigationLink.objects.create(
                label=label, path=path, order=i, parent=created["Our Services"]
            )

        for i, (label, path) in enumerate(
            [
                ("Online Registration", "/online-registration"),
                ("Vacancies", "/vacancies"),
                ("Careers at VNV", "/careers"),
            ]
        ):
            NavigationLink.objects.create(
                label=label, path=path, order=i, parent=created["Jobs"]
            )

        FooterLink.objects.all().delete()
        for i, (label, path) in enumerate(
            [
                ("Human Trafficking & Modern Slavery Act", "/about"),
                ("Department of Foreign Employment", "https://dofe.gov.np"),
                ("Ethical Recruitment", "/ethical-recruitment"),
                ("Privacy Policy", "/privacy"),
                ("Terms & Conditions", "/terms"),
            ]
        ):
            FooterLink.objects.create(label=label, path=path, order=i)

        QuickLink.objects.all().delete()
        for i, (label, path) in enumerate(
            [
                ("About Us", "/about"),
                ("News & Updates", "/news"),
                ("Contact Us", "/contact"),
                ("VNV Gallery", "/gallery"),
                ("Demand List", "/demands"),
                ("Careers", "/careers"),
                ("Stakeholders", "/about"),
                ("Awards & Recognition", "/awards"),
            ]
        ):
            QuickLink.objects.create(label=label, path=path, order=i)

    def _seed_home(self, site):
        HeroSection.objects.all().delete()
        hero = HeroSection(
            eyebrow="Trusted by employers worldwide",
            title="Ethical Overseas Manpower Recruitment from Nepal",
            subtitle="Ethical recruitment from Kathmandu",
            body=(
                "Vision & Value Overseas (VNVNEPAL) is a Kathmandu-based ethical overseas "
                "manpower recruitment agency that places Nepali workers with employers across "
                "Asia, the Middle East and Europe — zero recruitment fees for candidates, no "
                "sub-agents, and licensed compliance from demand letter through post-deployment "
                "support."
            ),
            cta_primary_label="Our Services",
            cta_primary_path="/services",
            cta_secondary_label="Learn More →",
            cta_secondary_path="/about",
            rating=4.9,
            order=0,
            is_active=True,
        )
        self._attach(hero.background_image, WEB_ASSETS / "hero-seminar.jpg")
        hero.save()

        MottoStep.objects.all().delete()
        for i, (step, number, title, tone) in enumerate(
            [
                ("STEP 01", 1, "LISTEN", "red"),
                ("STEP 02", 2, "PLAN", "blue"),
                ("STEP 03", 3, "RECRUIT", "red"),
                ("STEP 04", 4, "DELIVER", "blue"),
            ]
        ):
            MottoStep.objects.create(
                step_label=step,
                number=number,
                title=title,
                tone=tone,
                icon=title.lower(),
                order=i,
            )

        HomeStatistic.objects.all().delete()
        for i, (value, label, icon) in enumerate(
            [
                ("1000+", "Workers Deployed", "users"),
                ("35", "Different Sectors", "wrench"),
                ("12", "Different Countries", "globe"),
            ]
        ):
            HomeStatistic.objects.create(value=value, label=label, icon=icon, order=i)

        featured = [
            "Hospitality",
            "Integrated Facility Management",
            "Environmental services",
            "Recruitment",
            "Pharmacy",
            "Health and Fitness",
            "Waste Management",
            "Entertainment",
            "Beauty and Make-up",
            "Laundry",
        ]
        all_sectors = [
            "Hospitality",
            "Integrated Facility Management",
            "Environmental services",
            "Recruitment",
            "Pharmacy",
            "Health and Fitness",
            "Waste Management",
            "Entertainment",
            "Beauty and Make-up",
            "Laundry",
            "Fishery",
            "Hotels and Restaurants",
            "Engineering",
            "IT",
            "Production Factory",
            "Health Care",
            "Catering",
            "Security Guards",
            "Gourmet Food and Wine Industry",
            "Sweets and Chocolates",
            "Food Flavour and Spices",
            "Bakery",
            "Café and Cafeteria",
            "Tourism",
            "Aviation",
            "Poultry",
            "Housekeeping",
            "Food and Beverage",
            "Cleaning and Maintenance",
            "Construction",
            "Manufacturing",
            "Cruise Ships",
            "Retail",
            "Transportation and Logistics",
            "Electronics",
            "Real Estate",
            "Trade and Commerce",
            "Automotive",
            "Hotel / Hospitality",
            "Medical / Hospital",
            "Fitness & wellness",
            "Airlines",
            "Cleaner",
            "Barista",
            "Restaurant",
            "Fast Food Chain",
            "Farm/Agriculture",
            "Engineering/Construction",
            "Cruise Ship",
        ]
        for i, name in enumerate(all_sectors):
            Sector.objects.update_or_create(
                name=name,
                defaults={
                    "slug": slugify(name),
                    "order": i,
                    "is_featured": name in featured,
                    "is_active": True,
                    "description": (
                        "Our capacity enables us to provide highly qualified employees in this "
                        "sector without compromising on quality."
                        if name in featured
                        else ""
                    ),
                },
            )

        Testimonial.objects.all().delete()
        testimonials = [
            (
                "Working with Vision & Value Overseas (VNVNEPAL) was an absolute pleasure. "
                "Their ethical approach to recruitment and their dedication to finding the "
                "right candidates for our company's needs exceeded our expectations. We "
                "highly recommend their services.",
                "LAEEQ AHMED (Director of Human Resources)",
                "lissi",
            ),
            (
                "VNVNEPAL delivered a fully screened team ahead of schedule. Their compliance "
                "documentation and pre-departure counselling are the best we have seen from "
                "any recruitment partner in South Asia.",
                "MARIA SANTOS (Talent Acquisition Lead)",
                "sea zen",
            ),
            (
                "Zero recruitment fee, complete transparency and genuinely skilled staff. "
                "Vision & Value has become our default hiring partner for all Gulf properties.",
                "RAJEEV MENON (Cluster General Manager)",
                "Millennium",
            ),
        ]
        for i, (quote, author, brand) in enumerate(testimonials):
            Testimonial.objects.create(quote=quote, author=author, brand=brand, order=i)

        Membership.objects.all().delete()
        for i, title in enumerate(
            ["Sedex Member", "NAFEA Nepal", "ALP Member 2024", "IOM Partner"]
        ):
            Membership.objects.create(title=title, order=i)

        Client.objects.all().delete()
        for i, name in enumerate(
            ["HYATT", "Radisson Blu", "MILLENNIUM", "sea zen", "DUNKIN'", "sodexo"]
        ):
            Client.objects.create(name=name, order=i)

    def _seed_about(self):
        WhyChooseUsItem.objects.all().delete()
        items = [
            (
                "01",
                "Ethical Recruitment",
                "At Vision & Value Overseas, we go the extra mile to ensure ethical recruitment "
                "practices. We have taken a proactive stance by eliminating the involvement of "
                "sub-agents entirely.",
            ),
            (
                "02",
                "Independent Third-Party Monitoring",
                "To further ensure the integrity of our recruitment process, we have implemented "
                "independent third-party monitoring. This external oversight validates every "
                "step we take.",
            ),
            (
                "03",
                "Hotline Service for Complaints",
                "We prioritize the well-being and satisfaction of both candidates and employers. "
                "To address any concerns or grievances, we provide a dedicated 24/7 hotline "
                "service.",
            ),
            (
                "04",
                "Strong Compliance Team",
                "Our dedicated compliance team is committed to upholding legal and regulatory "
                "standards in recruitment and employment. They closely monitor every placement.",
            ),
            (
                "05",
                "Quality Placement",
                "At Vision & Value Overseas, our commitment to quality placement sets us apart. "
                "We strive to ensure that each placement we make is the right long-term fit.",
            ),
            (
                "06",
                "Internationally Recognized",
                "As esteemed members of Association of Labour Providers (ALP) UK, SEDEX, and "
                "Foreign Employment Agencies Association Nepal, we carry an internationally "
                "trusted name.",
            ),
            (
                "07",
                "ISO 9001:2015 Certification",
                "Our ISO 9001:2015 certification is a testament to our stringent quality "
                "management systems, ensuring that our processes consistently deliver "
                "top-notch results.",
            ),
            (
                "08",
                "Government Approved",
                "Our accreditation and licensing by the Government of Nepal and Gangmasters and "
                "Labour Abuse Authority (GLAA) UK demonstrate full legal standing.",
            ),
        ]
        for i, (number, title, body) in enumerate(items):
            WhyChooseUsItem.objects.create(number=number, title=title, body=body, order=i)

        AboutAccordionItem.objects.all().delete()
        accordion = [
            (
                "Company Vision",
                "Vision & Value, true to its name, has revolutionized the recruitment industry "
                "since 2007. Our humble beginnings with a small team were driven by a vision to "
                "establish ethical recruitment practices and ensure secure migration as the "
                "standard. Our aspiration is to become the preferred partner for both clients "
                "and candidates, offering top-notch professional solutions that cater to a wide "
                "range of disciplines.",
            ),
            (
                "Company Mission",
                "To connect employers and job seekers through a transparent, zero-cost and fully "
                "compliant recruitment process, delivering world-class services that exceed "
                "expectations at every stage of the journey.",
            ),
            (
                "Core Values",
                "Integrity, transparency, accountability and respect for every worker we place. "
                "We refuse sub-agents, we publish our processes and we monitor every placement "
                "through independent third parties.",
            ),
        ]
        for i, (title, body) in enumerate(accordion):
            AboutAccordionItem.objects.create(title=title, body=body, order=i)

        about_blocks = [
            {
                "key": "about.welcome",
                "page": "about",
                "label": "Welcome section",
                "heading": "Welcome to",
                "body": (
                    "Vision & Value Overseas (VNVNEPAL) is a Kathmandu-based ethical overseas manpower "
                    "recruitment agency that connects Nepali job seekers with licensed employers worldwide "
                    "through transparent, zero-cost, sub-agent-free placement — from counselling and "
                    "screening to documentation, pre-departure training and post-deployment support."
                ),
                "body_2": (
                    "Vision & Value Overseas Pvt. Ltd. serves international employers and Nepali job seekers from "
                    "Dhapasi Marg, Basundhara-3, Kathmandu, Nepal. We supply skilled workers across hospitality, facilities, healthcare "
                    "and related sectors under a simple policy — when it comes to our clients, we "
                    "Listen – Plan – Recruit & Deliver."
                ),
                "body_3": (
                    "Contact us at +977-14379749 or info@vnvnepal.com."
                ),
                "order": 0,
            },
            {
                "key": "about.affiliations",
                "page": "about",
                "label": "Affiliations strip",
                "heading": "",
                "body": (
                    "Our work aligns with international and national frameworks for safe labour migration, "
                    "including guidance from the International Organization for Migration (IOM), "
                    "licensing under Nepal's Department of Foreign Employment (DoFE), "
                    "and membership standards of the Nepal Association of Foreign Employment Agencies (NAFEA). "
                    "Ethical recruitment principles are also reflected in IOM's IRIS: Ethical Recruitment initiative."
                ),
                "order": 1,
            },
            {
                "key": "about.logo_story",
                "page": "about",
                "label": "Story of Our Logo",
                "heading": "Story of Our Logo",
                "body": (
                    '"Vision" and "Value" are iconified in a symbol that acknowledges the human input and '
                    "production of goods and services. The treatment symbolizes the healthy balance that is "
                    "bought about by ethical hiring."
                ),
                "order": 2,
            },
            {
                "key": "about.why_video",
                "page": "about",
                "label": "Why Choose Us video block",
                "heading": (
                    "Experience the services without any subagents, independent third-party monitoring and a "
                    "robust compliance team."
                ),
                "subheading": "Why Choose Us",
                "body": "Your trusted partner for fair & ethical recruitment",
                "body_2": "VNVNEPAL",
                # Official VNVNEPAL intro — editable in Admin → About → Page copy
                "video_url": "https://youtu.be/YFTedtFQRjE",
                "cta_label": "Read more",
                "cta_path": "/ethical-recruitment",
                "order": 3,
            },
            {
                "key": "about.sourcing",
                "page": "about",
                "label": "Candidate Sourcing",
                "heading": "Candidate Sourcing: A Rigorous Approach",
                "body": (
                    'Different clients have different requirements and expectations from their workers. The '
                    '"one size fits all" strategy may not be effective in this context. A candidate with '
                    "extensive experience in Qatar or Malaysia in a certain position may not be familiar "
                    "with the work etiquette in Saudi Arabia or Oman. Therefore, VNVNEPAL ensures the "
                    "suitability of candidates from the very beginning—through employment counseling and "
                    "pre-screening sessions to pre-departure training."
                ),
                "body_2": (
                    "VNVNEPAL upholds a strict commitment to ethical recruitment practices, which includes "
                    "safeguarding the privacy and interests of both candidates and employers. By not "
                    "disclosing the details of our sourcing strategies publicly, we ensure the protection of "
                    "our clients' and candidates' information and prevent any compromises."
                ),
                "body_3": (
                    "By choosing Vision & Value Overseas, you can trust that our candidate sourcing process "
                    "is grounded in ethical practices, and that we are fully committed to finding the best "
                    "talent for your organization's success."
                ),
                "order": 4,
            },
            {
                "key": "about.accordion_media",
                "page": "about",
                "label": "Vision / Mission side image",
                "heading": "",
                "body": "",
                "order": 5,
            },
        ]
        for block in about_blocks:
            ContentBlock.objects.update_or_create(
                key=block["key"],
                defaults={**block, "is_active": True},
            )

        portal_blocks = [
            {
                "key": "contact.help",
                "page": "contact",
                "label": "Contact help sidebar",
                "heading": "How can we help?",
                "subheading": "Contact Us",
                "body": (
                    "To learn more about Vision & Value Overseas (VNVNEPAL), fill out the contact form and "
                    "a member of the team will be in touch soon."
                ),
                "body_2": (
                    "Tell us whether you are an employer or a job seeker.\n"
                    "Employers: attach or summarise your demand letter and role list. Job seekers: include "
                    "preferred country, trade and passport status.\n"
                    "Or take the next step now — register online, browse current vacancies, or review our services."
                ),
                "cta_label": "Register online",
                "cta_path": "/online-registration",
                "order": 0,
            },
            {
                "key": "awards.intro",
                "page": "awards",
                "label": "Awards intro",
                "heading": "Licences, memberships and recognition",
                "body": (
                    "Vision & Value Overseas holds government licensing, quality certifications and "
                    "international memberships that underpin our ethical recruitment standards."
                ),
                "order": 0,
            },
            {
                "key": "demands.intro",
                "page": "demands",
                "label": "Demands intro",
                "heading": "",
                "body": (
                    "Published demand lists for overseas placements. Candidates can review openings and "
                    "register online; employers may contact our partnership desk."
                ),
                "cta_label": "Register online",
                "cta_path": "/online-registration",
                "order": 0,
            },
            {
                "key": "vacancies.intro",
                "page": "vacancies",
                "label": "Vacancies heading",
                "heading": "Explore All the Job Openings Available",
                "body": "",
                "order": 0,
            },
            {
                "key": "vacancies.next_steps",
                "page": "vacancies",
                "label": "Vacancies next steps",
                "heading": "Next steps",
                "body": (
                    "Shortlist roles that match your trade and destination, then register online with your CV "
                    "and passport details.\n"
                    "Visit or call our Kathmandu office if you need counselling — recruitment remains free of "
                    "charge for candidates.\n"
                    "Employers planning bulk hiring should contact our partnership desk with a demand letter, "
                    "or review our recruitment services."
                ),
                "cta_label": "Register online",
                "cta_path": "/online-registration",
                "order": 1,
            },
        ]
        for block in portal_blocks:
            ContentBlock.objects.update_or_create(
                key=block["key"],
                defaults={**block, "is_active": True},
            )

    def _seed_services(self):
        RecruitmentStep.objects.all().delete()
        steps = [
            (
                "Manpower Requisition",
                "We receive the demand letter, power of attorney and job order, then verify it "
                "with the Department of Foreign Employment.",
            ),
            (
                "Sourcing & Advertising",
                "Nationwide sourcing through our own branch network — never through sub-agents — "
                "plus digital and print advertising.",
            ),
            (
                "Screening & Interview",
                "Trade tests, skill assessments and employer interviews conducted in person or "
                "online at our Kathmandu facility.",
            ),
            (
                "Medical & Documentation",
                "Government approved medical centres, visa stamping, insurance, labour approval "
                "and orientation certification.",
            ),
            (
                "Pre-Departure Training",
                "Culture, workplace etiquette, language basics and rights awareness before every "
                "worker flies.",
            ),
            (
                "Post-Deployment Support",
                "24/7 hotline, grievance handling and independent third-party monitoring "
                "throughout the contract.",
            ),
        ]
        for i, (title, body) in enumerate(steps):
            RecruitmentStep.objects.create(title=title, body=body, order=i)

        service_blocks = [
            {
                "key": "services.intro",
                "page": "services",
                "label": "Services intro",
                "heading": "What is overseas recruitment?",
                "body": (
                    "Overseas recruitment is the licensed process of matching job seekers in one country with "
                    "verified employers abroad — covering demand verification, sourcing, screening, "
                    "documentation, visas, pre-departure training and post-deployment support. Vision & "
                    "Value Overseas (VNVNEPAL) delivers this from Kathmandu as an ethical, zero-cost, "
                    "sub-agent-free manpower agency for Nepali candidates and global employers."
                ),
                "body_2": (
                    "At Vision & Value, we strongly believe in promoting diversity and equal opportunity. "
                    "As a result, our candidates place their trust in our ability to connect them with "
                    "suitable job opportunities on a global scale. To fulfill this commitment, we have "
                    "assembled teams that possess the necessary skills and expertise to handle recruitment "
                    "across diverse industries."
                ),
                "body_3": (
                    "Currently, our capacity enables us to provide highly qualified employees in the following "
                    "sectors, without compromising on quality. However, our expertise is not limited to these "
                    "sectors alone. We continuously adapt and expand our capabilities to meet the evolving "
                    "needs of our valued clients."
                ),
                "cta_label": "Overseas recruitment process",
                "cta_path": "/services/overseas-recruitment",
                "order": 0,
            },
            {
                "key": "overseas.what",
                "page": "overseas-recruitment",
                "label": "What is overseas recruitment",
                "heading": "What is overseas recruitment?",
                "body": (
                    "Overseas recruitment is how licensed agencies place workers with employers in another "
                    "country under government-approved demand letters. Vision & Value Overseas (VNVNEPAL) "
                    "manages the full cycle for Nepali candidates: sourcing without sub-agents, interviews and "
                    "trade tests, medical and visa documentation, orientation and ongoing support after "
                    "arrival — with zero recruitment fees charged to workers."
                ),
                "order": 0,
            },
            {
                "key": "overseas.how",
                "page": "overseas-recruitment",
                "label": "How it works",
                "heading": "How it works",
                "body": (
                    "Vision & Value Overseas holds a valid licence from the Government of Nepal "
                    "(Department of Foreign Employment) to recruit and deploy Nepali workers abroad. "
                    "Our ethical practices draw on standards promoted by the International Organization "
                    "for Migration and IRIS Ethical Recruitment. From the moment a demand letter reaches "
                    "our desk to the day your worker completes their contract, every step is documented, "
                    "audited and free of any cost to the candidate."
                ),
                "order": 1,
            },
        ]
        for block in service_blocks:
            ContentBlock.objects.update_or_create(
                key=block["key"],
                defaults={**block, "is_active": True},
            )

    def _seed_ethical_recruitment(self):
        ethical_blocks = [
            {
                "key": "ethical.hero",
                "page": "ethical-recruitment",
                "label": "Page banner title",
                "heading": "Ethical Recruitment",
                "order": 0,
            },
            {
                "key": "ethical.history",
                "page": "ethical-recruitment",
                "label": "A brief history of ethical recruitment",
                "heading": "A BRIEF HISTORY OF ETHICAL RECRUITMENT",
                "subheading": "file-text",
                "body": (
                    "The history of ethical recruitment is relatively short, but it has been hailed as "
                    "need of the hour in recent years. The term \"ethical recruitment\" describes the "
                    "process of recruiting and hiring workers in a way that is **FAIR**, **TRANSPARENT**, "
                    "and **RESPECTFUL** of the rights of pretty much everyone involved in the process, "
                    "primarily the rights of the candidates applying for the job, and secondarily the "
                    "employer who is hiring as well as the agency who mediated the interactions between "
                    "job seekers and job givers.\n\n"
                    "The first major international agreement on ethical recruitment was the "
                    "**International Labour Organization's (ILO)** Convention 97 on Migration for "
                    "Employment (Revised), which was adopted in 1949. This convention established a "
                    "number of principles for the protection of migrant workers, including the right to "
                    "be free from discrimination, the right to a fair wage, and the right to return to "
                    "their home country.\n\n"
                    "In the 1990s, there was a growing awareness of the problem of human trafficking, "
                    "and this led to the development of a number of codes of conduct and other initiatives "
                    "to promote ethical recruitment. One of the most important of these initiatives was "
                    "the **ILO's Private Employment Agencies Convention, 1997 (No. 181)**. This code sets "
                    "out a number of standards that recruitment agencies must meet in order to be "
                    "considered ethical.\n\n"
                    "In recent years, there has been a growing focus on ethical recruitment in the "
                    "context of international development. The **ILO's Fair Recruitment** initiative in "
                    "the context of labour exploitation in development sector by unscrupulous employment "
                    "agencies and individuals was developed in 2014, and this framework provides guidance "
                    "to governments, employers, and recruitment agencies on how to ensure that recruitment "
                    "practices are ethical and do not lead to exploitation of migrant workers.\n\n"
                    "Today, there is a growing consensus that ethical recruitment is essential for "
                    "ensuring that the benefits of labor migration are shared fairly and that migrant "
                    "workers are protected from exploitation. There are a number of organizations that "
                    "are working to promote ethical recruitment, including the **ILO**, the "
                    "**International Organization for Migration (IOM)**, the **Responsible Business "
                    "Alliance (RBA)**, and **The Fair Hiring Initiative Inc.**\n\n"
                    "Ethical recruitment is not only good for the individual candidates, but it is also "
                    "good for businesses and for society as a whole. By ensuring that recruitment "
                    "practices are ethical, we can help to create a more just and equitable world."
                ),
                "order": 1,
            },
            {
                "key": "ethical.why",
                "page": "ethical-recruitment",
                "label": "Why ethical recruitment",
                "heading": "WHY ETHICAL RECRUITMENT?",
                "subheading": "settings",
                "body": (
                    "Ethical recruitment is of paramount importance in light of the concerning statistics "
                    "and challenges faced in the foreign employment sector. From the financial year "
                    "2019/20 to October 2022, a staggering **6,778 workers**, both individually and "
                    "institutionally, lodged complaints citing various forms of fraud within the sector. "
                    "The year 2021/22 alone witnessed **3,155 individuals** and institutions registering "
                    "complaints related to fraud. Such practices involve unscrupulous agents and "
                    "institutions taking money from potential migrants with promises of overseas "
                    "employment, only to backtrack and leave them stranded without fulfilling their "
                    "commitments. This alarming trend has inflicted a painful wound on the foreign "
                    "employment sector, tarnishing its reputation and affecting even genuine manpower "
                    "service providers.\n\n"
                    "It is Vision & Value's responsibility to educate all migrants seeking careers "
                    "overseas that charging exorbitant fees to migrant workers is against national and "
                    "international policies and rules. An onus that falls on us is to inform even the "
                    "candidates who do not seek any assistance from **VNVNEPAL** to go abroad that he or "
                    "she is not liable to pay any money, other than those stipulated under government "
                    "obligations, to any individual or institution, such as agents, sub-agents or a "
                    "manpower recruitment agency. We are dedicated to empowering candidates with "
                    "knowledge and awareness, ensuring they can make informed decisions and protect "
                    "their rights during the recruitment process. Our commitment to ethical recruitment "
                    "extends to fostering a fair and transparent environment that benefits both "
                    "candidates and employers while deterring fraudulent practices that mar the foreign "
                    "employment sector."
                ),
                "order": 2,
            },
            {
                "key": "ethical.zero_cost",
                "page": "ethical-recruitment",
                "label": "Why zero cost recruitment",
                "heading": "WHY ZERO COST RECRUITMENT?",
                "subheading": "lightbulb",
                "body": (
                    "**Zero-cost recruitment** stands as the gold standard of ethical recruitment "
                    "processes, reflecting our commitment to candidates' welfare and fair employment "
                    "practices. At Vision & Value Overseas Pvt. Ltd., we firmly believe that candidates "
                    "should never bear any financial burden during the recruitment journey. Eliminating "
                    "recruitment fees ensures that candidates are not exploited or misled by "
                    "unscrupulous agents or agencies seeking to profit at their expense. By adhering to "
                    "the zero-cost principle, we strive to create a transparent and trustworthy "
                    "environment where candidates can pursue overseas opportunities without fear of "
                    "financial exploitation. Emphasizing zero-cost recruitment is not just a matter of "
                    "ethical responsibility; it is a fundamental belief in the dignity and respect owed "
                    "to every aspiring migrant worker. We take great pride in upholding the gold "
                    "standard of ethical recruitment, ensuring that candidates' dreams of overseas "
                    "careers are realized through a fair and just process."
                ),
                "order": 3,
            },
            {
                "key": "ethical.comparison",
                "page": "ethical-recruitment",
                "label": "Ethical vs zero-cost comparison",
                "heading": "DIFFERENCE BETWEEN ETHICAL AND ZERO-COST RECRUITMENT",
                "subheading": "list-checks",
                "body": (
                    "The two terms are often used interchangeably. Even at VNVNEPAL, we do that quite "
                    "often. However, there's a subtle difference between the two terms that everybody "
                    "needs to understand."
                ),
                "body_2": (
                    "Refers to the practice of recruiting workers in a way that is fair, transparent, "
                    "and respectful of their rights.|||Workers are not charged any fees for the "
                    "recruitment process.\n"
                    "Can include zero cost recruitment.|||In some cases, it may be the only feasible "
                    "way to ensure that workers are not exploited.\n"
                    "Zero-cost is not always possible, as the employer may not be able to afford to "
                    "bear the full costs of recruitment, such as government fees, medical costs "
                    "(eg: GAMCA medical), insurance costs etc.|||Is a specific type of ethical "
                    "recruitment in which \"cost\" is given more priority than the opportunity itself.\n"
                    "Workers are clearly and honestly informed about the job, job position, employer's "
                    "identity, host country, salary, benefits, facilities (food, accommodation and "
                    "transportation), and any government charges, if applicable. They are also assured "
                    "of freedom of movement and the right to retain personal documents.|||In some cases, "
                    "unethical recruitment practices can occur, such as sending a worker overseas without "
                    "charging them any money, but then sending them to the wrong worksite or temporarily "
                    "holding their legal documents."
                ),
                "body_3": "Ethical|||Zero-cost",
                "order": 4,
            },
        ]
        for block in ethical_blocks:
            ContentBlock.objects.update_or_create(
                key=block["key"],
                defaults={**block, "is_active": True},
            )

    def _seed_jobs(self):
        countries = [
            "Bahrain",
            "Maldives",
            "Qatar",
            "UAE",
            "Kuwait",
            "Saudi Arabia",
            "Oman",
            "United Kingdom",
            "Malaysia",
            "Nepal",
        ]
        for i, name in enumerate(countries):
            Country.objects.update_or_create(name=name, defaults={"order": i, "is_active": True})

        Job.objects.all().delete()
        jobs = [
            (
                "Waiter / Waitress",
                "Atlantis Hospitality Group",
                "Hotel / Hospitality",
                "Kuwait",
                25,
                "KWD 150 + Food & Accommodation",
            ),
            (
                "Commis Chef",
                "Gulf Catering Services",
                "Catering",
                "Qatar",
                18,
                "QAR 1,800 + Benefits",
            ),
            (
                "Housekeeping Attendant",
                "Millennium Hotels & Resorts",
                "Hotel / Hospitality",
                "Kuwait",
                30,
                "KWD 130 + Overtime",
            ),
            (
                "Barista",
                "Sea Zen Coffee Company",
                "Restaurant",
                "Qatar",
                12,
                "QAR 1,600 + Tips",
            ),
            (
                "Kitchen Steward",
                "Radisson Blu",
                "Catering",
                "Kuwait",
                20,
                "KWD 120 + Duty Meals",
            ),
            (
                "Front Office Receptionist",
                "Hyatt Group",
                "Hotel / Hospitality",
                "Qatar",
                6,
                "QAR 2,400 + Accommodation",
            ),
        ]
        for title, company, sector_name, country_name, vacancies, salary in jobs:
            sector, _ = Sector.objects.get_or_create(
                name=sector_name, defaults={"slug": slugify(sector_name)}
            )
            country = Country.objects.get(name=country_name)
            Job.objects.create(
                title=title,
                company=company,
                sector=sector,
                country=country,
                vacancies=vacancies,
                salary=salary,
                description=(
                    f"Open position for {title} at {company} in {country_name}. "
                    f"Ethical overseas recruitment via Vision & Value Overseas (VNVNEPAL). "
                    f"Zero recruitment fees for candidates."
                ),
                requirements=(
                    "Valid passport, relevant experience or training, medical fitness, "
                    "and willingness to work overseas under a licensed demand letter."
                ),
                is_active=True,
                is_featured=True,
            )

        DemandList.objects.all().delete()
        kuwait = Country.objects.filter(name="Kuwait").first()
        qatar = Country.objects.filter(name="Qatar").first()
        hospitality = Sector.objects.filter(name="Hotel / Hospitality").first()
        catering = Sector.objects.filter(name="Catering").first()
        DemandList.objects.create(
            title="Hotel Staff Demand — Kuwait",
            employer="Atlantis Hospitality Group",
            country=kuwait,
            sector=hospitality,
            positions=55,
            description="Waiters, housekeeping and front office roles.",
            published_at=date(2026, 6, 1),
            order=0,
        )
        DemandList.objects.create(
            title="Catering Crew Demand — Qatar",
            employer="Gulf Catering Services",
            country=qatar,
            sector=catering,
            positions=38,
            description="Commis chefs and kitchen stewards for catering contracts.",
            published_at=date(2026, 5, 15),
            order=1,
        )

    def _seed_news(self):
        """All 12 news articles exactly as displayed on the website."""
        NewsArticle.objects.all().delete()
        articles = [
            {
                "slug": "contact-vnvnepal",
                "title": "Contact VNVNEPAL",
                "author": "vnv",
                "published": "2026-06-12",
                "modified": "2026-06-20",
                "excerpt": (
                    "Reach out to our recruitment desk for partnership enquiries, bulk hiring "
                    "plans and candidate support."
                ),
                "body": [
                    "Vision & Value Overseas (VNVNEPAL) welcomes employers, job seekers and partners who need a clear point of contact for overseas manpower recruitment from Nepal. Our Kathmandu desk handles partnership enquiries, bulk hiring plans, candidate counselling and post-deployment support under one licensed operation.",
                    "Employers can share a demand letter, job description and destination-country requirements; our team responds with a sourcing plan, timeline and compliance checklist aligned with the Department of Foreign Employment. Job seekers can call, email or visit our Basundhara office with a CV and passport copy — we never charge candidates a recruitment fee.",
                    "For the fastest response, use the contact form on this website, phone our published landlines during Sunday–Friday business hours, or email info@vnvnepal.com. You can also browse current vacancies and complete online registration before visiting the office.",
                ],
            },
            {
                "slug": "passport-retrieval-notice",
                "title": "Important Notice on Passport Retrieval (पासपोर्ट पुनः प्राप्ति बारे अत्यन्त जरुरी सूचना)",
                "author": "vnv",
                "published": "2026-05-28",
                "modified": "2026-05-30",
                "excerpt": (
                    "Candidates who have submitted passports to our office are requested to "
                    "collect them within the notified period."
                ),
                "body": [
                    "Vision & Value Overseas (VNVNEPAL) has issued an important notice for candidates who previously submitted passports to our Kathmandu office for processing. If your file has been closed, cancelled or is no longer in active deployment, you are requested to collect your passport within the notified collection window.",
                    "Please bring a valid photo ID and any receipt or acknowledgement slip issued at submission. If a family member collects on your behalf, they must carry an authorization letter signed by the passport holder plus copies of both IDs. Our compliance desk will verify the record before release.",
                    "Uncollected documents create risk for candidates and delay office operations. If you cannot visit within the stated period, contact our team immediately to arrange an alternative date. For questions, call our published numbers or visit Dhapasi Marg, Basundhara-3, Kathmandu during business hours.",
                ],
            },
            {
                "slug": "nepals-healthcare-workforce-goes-global",
                "title": (
                    "Nepal's Healthcare Workforce Goes Global: Why the World's Best Hospitals "
                    "Are Choosing Nepali Talent?"
                ),
                "author": "vnv",
                "published": "2026-04-15",
                "modified": "2026-04-22",
                "excerpt": (
                    "Powering healthcare systems in GCC, UK, USA, Europe and Japan with trained "
                    "Nepali healthcare professionals."
                ),
                "body": [
                    "Hospitals and care providers across the GCC, the United Kingdom, Europe, the United States and Japan are expanding demand for licensed and trained healthcare professionals from Nepal. Vision & Value Overseas (VNVNEPAL) supports this pipeline through ethical, zero-cost recruitment that screens skills, credentials and language readiness before deployment.",
                    "Nepali nurses, caregivers and allied health staff are valued for clinical discipline, adaptability and patient-centred communication. Employers typically request verified certificates, experience letters, medical fitness and destination-specific orientation. VNVNEPAL coordinates counselling, document checks and pre-departure briefing so candidates arrive job-ready.",
                    "For healthcare employers, the advantage is a transparent process without sub-agents: clear timelines, audited documentation and post-deployment support. Candidates seeking overseas healthcare roles can register online, review openings on our vacancies page, or contact our Kathmandu team to discuss eligibility for specific destination markets.",
                ],
            },
            {
                "slug": "iom-nepal-ssf-training",
                "title": "Training by IOM-Nepal on Social Security Fund (SSF)",
                "author": "vnv",
                "published": "2026-03-04",
                "excerpt": (
                    "Our team participated in a capacity building session on the Social Security "
                    "Fund led by IOM-Nepal."
                ),
                "body": [
                    "Members of the Vision & Value Overseas (VNVNEPAL) team joined a capacity-building session on Nepal’s Social Security Fund (SSF) facilitated with IOM-Nepal. The training covered contribution rules, documentation expectations and how recruitment agencies should advise migrant workers about social protection before departure.",
                    "Understanding SSF matters for ethical overseas recruitment: candidates need accurate information about contributions, benefits and how foreign employment interacts with domestic social security. Our compliance and counselling staff use this guidance when preparing workers for Gulf, Asian and European placements.",
                    "VNVNEPAL will continue aligning our candidate orientation materials with national social-protection guidance so families receive clear, practical answers — not informal rumours. Employers and candidates with SSF-related questions during recruitment can raise them with our Kathmandu office.",
                ],
            },
            {
                "slug": "vnvnepal-thanks-the-uae-government",
                "title": "VNVNEPAL Thanks the UAE Government for Pardoning 267 Nepali Individuals",
                "author": "vnvgraphics",
                "published": "2025-12-18",
                "excerpt": (
                    "Vision & Value Overseas expresses sincere gratitude to the UAE Government "
                    "for its humanitarian decision."
                ),
                "body": [
                    "Vision & Value Overseas (VNVNEPAL) expresses sincere gratitude to the Government of the United Arab Emirates for the humanitarian decision to pardon 267 Nepali individuals. Acts of clemency that reunite families and restore dignity strengthen trust between labour-sending and destination countries.",
                    "As an ethical recruitment agency licensed in Nepal, we advocate safe, lawful migration and fair treatment of workers throughout the employment cycle. We encourage candidates to follow destination laws, keep documents secure and use official channels for grievances — including our 24/7 support pathways for placements we manage.",
                    "VNVNEPAL remains committed to transparent hiring for UAE and wider GCC employers: verified demand letters, medical and documentation support, and zero recruitment fees for candidates. Partners who share this standard are welcome to contact our partnership desk in Kathmandu.",
                ],
            },
            {
                "slug": "zero-cost-recruitment",
                "title": (
                    "Zero cost: 'The families of daughters who go for foreign employment no "
                    "longer have to carry the burden of debt'"
                ),
                "author": "vnv",
                "published": "2025-10-22",
                "modified": "2025-11-02",
                "excerpt": (
                    "Our zero-cost model removes the debt burden traditionally carried by "
                    "migrant worker families."
                ),
                "body": [
                    "For years, many Nepali families financed foreign employment through high-interest loans tied to informal recruitment fees. Vision & Value Overseas (VNVNEPAL) operates a zero-cost model for candidates: workers do not pay us for the job, and we reject sub-agent chains that shift cost onto households.",
                    "When daughters and sons migrate without recruitment debt, remittances can support education, healthcare and savings instead of interest payments. Employers fund a compliant process; candidates focus on skills, medical clearance and pre-departure readiness. Independent monitoring and our compliance team help keep that promise auditable.",
                    "Job seekers should treat any request for a recruitment fee as a red flag. Register through official VNVNEPAL channels, verify openings on our website, and ask our counselling desk to explain what costs (if any) are government or medical fees versus prohibited recruitment charges.",
                ],
            },
            {
                "slug": "scaffolders-global-opportunities",
                "title": "Global Opportunities for Aspiring Scaffolders with VNVNEPAL",
                "author": "vnv",
                "published": "2025-08-14",
                "excerpt": (
                    "Certified scaffolding training and placement pathways for skilled Nepali "
                    "workers across the Gulf and Europe."
                ),
                "body": [
                    "Scaffolding remains a high-demand trade across Gulf construction and industrial projects, with growing interest from European contractors who need certified, safety-aware crews. Vision & Value Overseas (VNVNEPAL) connects aspiring and experienced Nepali scaffolders with employers through ethical, documented overseas recruitment.",
                    "Candidates typically need trade competence, height-safety awareness and medical fitness. Where employers specify certification or trade tests, we coordinate screening at our facilities and align pre-departure briefings with site safety expectations in the destination country.",
                    "If you are a scaffolder seeking overseas work, browse construction-related vacancies, complete online registration, or visit our Kathmandu office with your experience letters and passport. Employers hiring scaffolding teams can send demand details to our partnership desk for a sourcing plan.",
                ],
            },
            {
                "slug": "hospitality-staffing-excellence",
                "title": "Unlock Excellence in Hospitality Staffing with VNVNEPAL!",
                "author": "vnv",
                "published": "2025-06-09",
                "modified": "2025-06-18",
                "excerpt": "#1 Hospitality Recruitment Agency in Nepal, trusted by international hotel groups.",
                "body": [
                    "International hotels, resorts and catering operators continue to recruit Nepali hospitality talent for front office, housekeeping, F&B service and kitchen roles. Vision & Value Overseas (VNVNEPAL) specialises in ethical hospitality staffing from Nepal, with screening that matches brand standards and destination culture.",
                    "Our process covers CV shortlisting, interviews (in person or online), skill checks where required, medical and documentation support, and pre-departure orientation on workplace etiquette. Candidates are never charged a recruitment fee; employers receive job-ready teams through a licensed, sub-agent-free channel.",
                    "Hotel groups planning seasonal or permanent hiring can contact our partnership team with role profiles and volume. Candidates interested in hospitality abroad should review hotel and catering vacancies and register online before visiting our Basundhara office.",
                ],
            },
            {
                "slug": "baking-as-a-metaphor-for-life",
                "title": "Baking as a metaphor for life",
                "author": "vnv",
                "published": "2025-03-21",
                "excerpt": "Stories from our pastry and bakery candidates deployed to five-star kitchens abroad.",
                "body": [
                    "Pastry and bakery careers reward patience, precision and continuous learning — qualities we see daily in Nepali candidates preparing for five-star kitchens abroad. Vision & Value Overseas (VNVNEPAL) has placed bakery and pastry professionals with employers who need reliable, trainable talent.",
                    "Successful candidates often combine formal training or hotel experience with a willingness to adapt to new recipes, hygiene systems and service rhythms. Pre-departure counselling helps them understand contract terms, kitchen hierarchy and cultural expectations in the host country.",
                    "Aspiring bakers and pastry cooks can explore catering and hospitality openings on our vacancies page or speak with our counselling team about skill evidence employers typically request. We keep recruitment zero-cost for candidates and transparent for kitchen managers hiring from Nepal.",
                ],
            },
            {
                "slug": "ssw-japan-program",
                "title": (
                    "VNVNEPAL: Connecting Japanese Employers with Skilled Workers under "
                    "SSW Japan Program"
                ),
                "author": "vnv",
                "published": "2024-11-27",
                "modified": "2025-01-10",
                "excerpt": (
                    "Specified Skilled Worker pathways connecting Japanese employers with "
                    "trained Nepali candidates."
                ),
                "body": [
                    "Japan’s Specified Skilled Worker (SSW) framework creates structured pathways for Nepali talent in designated sectors. Vision & Value Overseas (VNVNEPAL) helps Japanese employers and Nepali candidates navigate ethical recruitment under this programme — with clear documentation, skills readiness and candidate counselling.",
                    "SSW placements typically require language preparation, skills assessments and careful matching to employer needs. Our team explains process stages to candidates and coordinates with employers on timelines so expectations stay realistic and compliant with Nepali foreign-employment rules.",
                    "Japanese employers seeking Nepali SSW candidates, and workers exploring Japan pathways, can contact VNVNEPAL’s Kathmandu office for guidance. We do not charge candidates recruitment fees and we do not use sub-agents for sourcing.",
                ],
            },
            {
                "slug": "why-ethical-recruitment",
                "title": "WHY ETHICAL RECRUITMENT?",
                "author": "vnv",
                "published": "2024-09-05",
                "modified": "2024-10-12",
                "excerpt": "Say no fees for your job — the principle behind everything we do.",
                "body": [
                    "Ethical recruitment means workers do not buy their jobs. Vision & Value Overseas (VNVNEPAL) was built around that principle: zero recruitment fees for candidates, no sub-agent layers, and independent monitoring that helps verify process integrity for employers and workers alike.",
                    "When agencies charge informal fees, families take on debt before a first salary arrives. Ethical practice replaces that with transparent employer-funded hiring, published processes and a compliance team that watches documentation, medical steps and labour approvals.",
                    "Candidates should refuse fee requests and verify licences. Employers who want durable staffing relationships benefit from lower grievance risk and better retention. Learn more about our overseas recruitment process, or contact VNVNEPAL to partner on fair hiring from Nepal.",
                ],
            },
            {
                "slug": "national-policy-dialogue",
                "title": "National Policy Dialogue on Labour Migration",
                "author": "vnv",
                "published": "2024-07-16",
                "excerpt": (
                    "Vision & Value joined policymakers and agencies at the national dialogue "
                    "on safe labour migration."
                ),
                "body": [
                    "Vision & Value Overseas (VNVNEPAL) participated in a national policy dialogue on labour migration, joining policymakers, practitioners and fellow agencies to discuss safer, fairer overseas employment for Nepali workers.",
                    "Dialogues of this kind surface practical issues: documentation bottlenecks, candidate protection, destination-country coordination and the cost of informal recruitment. Our contribution reflects day-to-day experience placing workers across Asia, the Middle East and Europe under a licensed, ethical model.",
                    "We will keep translating policy conversations into operational practice — clearer counselling, stronger compliance checks and employer partnerships that reject fee-based hiring. Stakeholders who want to collaborate on responsible recruitment can reach our Kathmandu team.",
                ],
            },
        ]
        for article in articles:
            NewsArticle.objects.create(
                slug=article["slug"],
                title=article["title"],
                author=article["author"],
                excerpt=article["excerpt"],
                content="\n\n".join(article["body"]),
                is_published=True,
                published_at=timezone.make_aware(
                    datetime.strptime(article["published"], "%Y-%m-%d"), dt_timezone.utc
                ),
                meta_title=f"{article['title'][:80]} | VNVNEPAL",
                meta_description=article["excerpt"],
            )

    def _seed_awards(self):
        Certificate.objects.all().delete()
        certs = [
            "Government of Nepal (Department of Foreign Employment) License Certificate",
            "RBA Training Certificate",
            "ISO Certification",
            "SEDEX Membership Certificate",
            "ALP UK Membership 2024",
            "NAFEA Membership Certificate",
        ]
        for i, title in enumerate(certs):
            Certificate.objects.create(title=title, tag="CERTIFICATES", order=i)

    def _seed_gallery(self):
        GalleryImage.objects.all().delete()
        GalleryAlbum.objects.all().delete()

        album = GalleryAlbum.objects.create(
            title="VNV Gallery",
            slug="vnv-gallery",
            description=(
                "Photos from Vision & Value Overseas events, training, orientation and "
                "office life in Kathmandu."
            ),
            order=0,
            is_active=True,
        )
        self._attach(album.cover, WEB_ASSETS / "about-team.jpg")
        album.save()

        images = [
            ("Recruitment Seminar", WEB_ASSETS / "hero-seminar.jpg", "Seminar with candidates"),
            ("Our Team", WEB_ASSETS / "about-team.jpg", "Staff group photo"),
            ("Page Banner", WEB_ASSETS / "page-banner.jpg", "Office / brand banner"),
            ("Deployment Stats", WEB_ASSETS / "stats-bg.jpg", "Workers deployed worldwide"),
        ]
        for i, (title, path, caption) in enumerate(images):
            if not path.exists():
                continue
            img = GalleryImage(
                album=album,
                title=title,
                caption=caption,
                order=i,
                is_active=True,
            )
            self._attach(img.image, path)
            img.save()

    def _seed_contact(self, site):
        # Exact FAQs from the public Contact page
        FAQ.objects.all().delete()
        faqs = [
            (
                "What are your business hours?",
                "Sunday to Friday, 9:30 AM – 5:30 PM. We are closed on Saturdays and public holidays.",
            ),
            (
                "How do employers start a talent hunt with VNVNEPAL?",
                "Send us your demand letter and job description; our talent team will revert with a "
                "sourcing plan within 48 hours.",
            ),
            (
                "How can job seekers register with Vision & Value Overseas?",
                "Register online or visit our Kathmandu office with your CV and passport copy. "
                "We never charge candidates a recruitment fee.",
            ),
            (
                "Do you charge candidates a recruitment fee?",
                "No. Vision & Value operates a zero-cost model for candidates. Any request for a "
                "recruitment fee is a red flag.",
            ),
        ]
        for i, (q, a) in enumerate(faqs):
            FAQ.objects.create(question=q, answer=a, order=i)

    def _seed_cms_pages(self):
        pages = [
            (
                "about",
                "About Us",
                "Ethical, sub-agent free recruitment of Nepali workers for employers worldwide.",
                (
                    "## Welcome to Vision & Value Overseas (VNVNEPAL)\n\n"
                    "Vision & Value Overseas (VNVNEPAL) is a Kathmandu-based ethical overseas manpower "
                    "recruitment agency that connects Nepali job seekers with licensed employers worldwide "
                    "through transparent, zero-cost, sub-agent-free placement — from counselling and "
                    "screening to documentation, pre-departure training and post-deployment support.\n\n"
                    "We serve international employers and Nepali job seekers from Dhapasi Marg, "
                    "Basundhara-3, Kathmandu, Nepal. We supply skilled workers across hospitality, "
                    "facilities, healthcare and related sectors under a simple policy — when it comes "
                    "to our clients, we **Listen – Plan – Recruit & Deliver**.\n\n"
                    "Contact us at +977-14379749 or info@vnvnepal.com.\n\n"
                    "### Motto intro\n"
                    "At Vision we always deliver by following a simple policy- when it comes to our "
                    "clients, we simply Listen, Plan, Recruit and Deliver.\n\n"
                    "### Stats caption\n"
                    "VNVNEPAL has successfully deployed more than 30K staff across Asia, Middle East "
                    "and Europe in the various sectors.\n\n"
                    "### Expertise intro\n"
                    "Our capacity enables us to provide highly qualified employees in the following "
                    "sectors, without compromising on quality. However, our expertise is not limited "
                    "to these sectors alone. We continuously adapt and expand our capabilities to "
                    "meet the evolving needs of our valued clients."
                ),
                True,
            ),
            (
                "methodology",
                "Methodology",
                "Our Listen–Plan–Recruit–Deliver methodology for ethical overseas recruitment.",
                (
                    "## Our Methodology\n\n"
                    "Vision & Value follows a four-step ethical recruitment methodology: Listen, Plan, "
                    "Recruit and Deliver. Every placement is documented, monitored and free of "
                    "sub-agent involvement.\n\n"
                    "### Listen\nWe begin by understanding employer requirements and candidate "
                    "aspirations.\n\n"
                    "### Plan\nWe design a compliant sourcing plan aligned with DOFE rules.\n\n"
                    "### Recruit\nWe screen, interview and prepare candidates without charging fees.\n\n"
                    "### Deliver\nWe complete documentation, orientation and post-deployment support."
                ),
                True,
            ),
            (
                "careers-overview",
                "Careers at VNV",
                "Join the Vision & Value team in Kathmandu.",
                (
                    "## Careers\n\n"
                    "We are hiring: Accountant, Documentation Assistant, Talent Acquisition Officer, "
                    "Office Assistant, Social Media Handler, and Videographer / Editor.\n\n"
                    "Apply through online registration or email **career@vnvnepal.com**."
                ),
                True,
            ),
            (
                "privacy",
                "Privacy Policy",
                "How Vision & Value Overseas collects, uses and protects personal information.",
                (
                    "## Privacy Policy\n\n"
                    "This Privacy Policy explains how Vision & Value Overseas Pvt. Ltd. (VNVNEPAL) "
                    "handles personal information when you visit our website, contact us, register "
                    "as a candidate, or enquire as an employer. We are a licensed overseas "
                    "recruitment agency based in Kathmandu, Nepal.\n\n"
                    "### Who we are\n"
                    "Vision & Value Overseas Pvt. Ltd.\n"
                    "Dhapasi Marg, Basundhara-3, Kathmandu, Nepal\n"
                    "P.O. Box: 7764\n"
                    "Phone: +977-14379749, +977-14379450, +977-14379162\n"
                    "Email: info@vnvnepal.com\n\n"
                    "### Information we collect\n"
                    "We may collect information you provide directly — such as your name, phone "
                    "number, email, CV details, passport or identity documents needed for lawful "
                    "recruitment, and messages sent through our contact or registration forms. We "
                    "also receive routine technical data from your browser when you use our site.\n\n"
                    "### How we use information\n"
                    "- To respond to enquiries from candidates, employers and partners\n"
                    "- To screen, place and support candidates in overseas employment where permitted\n"
                    "- To meet legal and regulatory duties under Nepal foreign employment law\n"
                    "- To improve our website and services\n\n"
                    "We do not sell personal information. Recruitment for candidates follows our "
                    "zero-cost policy — we do not charge workers recruitment fees.\n\n"
                    "### Sharing and confidentiality\n"
                    "We share candidate or employer details only as needed for recruitment or when "
                    "the law requires it. Concerns or complaints are handled with confidentiality.\n\n"
                    "### Retention and security\n"
                    "We keep records only as long as needed for recruitment, support, and legal "
                    "compliance, and take reasonable steps to protect personal data.\n\n"
                    "### Your choices\n"
                    "You may request access to, correction of, or deletion of personal information "
                    "we hold about you, subject to legal retention requirements. Contact "
                    "info@vnvnepal.com.\n\n"
                    "### Updates\n"
                    "We may update this policy from time to time. Last updated: 30 July 2026."
                ),
                False,
            ),
            (
                "terms",
                "Terms & Conditions",
                "Terms of use for the Vision & Value Overseas website and recruitment enquiries.",
                (
                    "## Terms & Conditions\n\n"
                    "These Terms & Conditions govern use of the website and online forms operated by "
                    "Vision & Value Overseas Pvt. Ltd. (VNVNEPAL). By using this site you agree to "
                    "these terms.\n\n"
                    "### Company details\n"
                    "Vision & Value Overseas Pvt. Ltd.\n"
                    "Dhapasi Marg, Basundhara-3, Kathmandu, Nepal\n"
                    "P.O. Box: 7764\n"
                    "Phone: +977-14379749, +977-14379450, +977-14379162\n"
                    "Email: info@vnvnepal.com\n\n"
                    "### What we do\n"
                    "We provide overseas manpower recruitment services from Nepal under licences "
                    "required by the Government of Nepal. Website content is not a binding job offer "
                    "until confirmed in writing through our formal process.\n\n"
                    "### Website use\n"
                    "- Use the site only for lawful recruitment and information purposes\n"
                    "- Do not submit false, misleading or fraudulent information\n"
                    "- Do not attempt to disrupt or misuse the site or our systems\n"
                    "- Respect intellectual property in our text, logos and materials\n\n"
                    "### Candidates and fees\n"
                    "We operate an ethical, zero-cost recruitment model for workers: candidates are "
                    "not charged recruitment fees by our agency. Registering online does not "
                    "guarantee placement.\n\n"
                    "### Employers and partners\n"
                    "Partnership and hiring enquiries are subject to verification of demand "
                    "documents, compliance checks, and written agreements.\n\n"
                    "### Accuracy and liability\n"
                    "We aim to keep site information accurate but do not warrant that all content "
                    "is complete or up to date.\n\n"
                    "### Privacy\n"
                    "Personal data is handled as described in our Privacy Policy.\n\n"
                    "### Governing law\n"
                    "These terms are governed by the laws of Nepal. Disputes relating to this "
                    "website will be subject to the courts of Kathmandu, Nepal.\n\n"
                    "### Contact\n"
                    "Questions: info@vnvnepal.com or +977-14379749. Last updated: 30 July 2026."
                ),
                False,
            ),
            (
                "homepage-copy",
                "Homepage Section Copy",
                "Editable homepage section text mirrored from the public website.",
                (
                    "## Hero\n"
                    "**Eyebrow:** Trusted by employers worldwide\n"
                    "**Title:** Ethical Overseas Manpower Recruitment from Nepal\n"
                    "**Subtitle:** Ethical recruitment from Kathmandu\n\n"
                    "## Motto\n"
                    "At Vision we always deliver by following a simple policy- when it comes to our "
                    "clients, we simply\n\n"
                    "## Stats caption\n"
                    "VNVNEPAL has successfully deployed more than 30K staff across Asia, Middle East "
                    "and Europe in the various sectors.\n\n"
                    "## Expertise intro\n"
                    "Our capacity enables us to provide highly qualified employees in the following "
                    "sectors, without compromising on quality. However, our expertise is not limited "
                    "to these sectors alone. We continuously adapt and expand our capabilities to "
                    "meet the evolving needs of our valued clients."
                ),
                False,
            ),
        ]
        for i, (slug, title, excerpt, content, show_nav) in enumerate(pages):
            page, _ = CMSPage.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title,
                    "excerpt": excerpt,
                    "content": content,
                    "is_published": True,
                    "show_in_nav": show_nav,
                    "meta_title": f"{title} | VNVNEPAL",
                    "meta_description": excerpt,
                    "order": i,
                },
            )
            if slug == "about" and not page.banner_image:
                self._attach(page.banner_image, WEB_ASSETS / "about-team.jpg")
                page.save()
            elif slug in ("privacy", "terms") and not page.banner_image:
                self._attach(page.banner_image, WEB_ASSETS / "page-banner.jpg")
                page.save()

    def _seed_seo(self):
        pages = [
            (
                "/",
                "VNVNEPAL | Ethical Manpower & Overseas Recruitment Agency Nepal",
                "Vision & Value Overseas Pvt. Ltd. is an ethical recruitment agency in Nepal, deploying skilled workers across Asia, the Middle East and Europe.",
            ),
            (
                "/about",
                "About Vision & Value Overseas (VNVNEPAL) | Ethical Recruiter",
                "Learn about Vision & Value Overseas Pvt. Ltd. — a decade of ethical, sub-agent free recruitment of Nepali workers for employers worldwide.",
            ),
            (
                "/services",
                "Our Services | Manpower Recruitment Sectors — VNVNEPAL",
                "Explore the industries and sectors Vision & Value Overseas recruits for worldwide.",
            ),
            (
                "/services/overseas-recruitment",
                "Overseas Recruitment Services | VNVNEPAL Nepal",
                "Step-by-step ethical overseas recruitment from Nepal — requisition to post-deployment support.",
            ),
            (
                "/ethical-recruitment",
                "Ethical Recruitment | Vision & Value Overseas (VNVNEPAL)",
                "Learn about ethical and zero-cost recruitment standards at Vision & Value Overseas — fair, transparent hiring for Nepali migrant workers.",
            ),
            (
                "/news",
                "News & Updates | VNVNEPAL Recruitment Insights",
                "News and updates from Vision & Value Overseas on ethical recruitment and overseas employment.",
            ),
            (
                "/vacancies",
                "Current Overseas Vacancies | VNVNEPAL",
                "Browse active overseas job openings for Nepali candidates.",
            ),
            (
                "/methodology",
                "Methodology | Ethical Recruitment Process — VNVNEPAL",
                "Our Listen–Plan–Recruit–Deliver methodology for ethical overseas recruitment from Nepal.",
            ),
            (
                "/pages/methodology",
                "Methodology | Ethical Recruitment Process — VNVNEPAL",
                "Our Listen–Plan–Recruit–Deliver methodology for ethical overseas recruitment from Nepal.",
            ),
            (
                "/demands",
                "Demand List | VNVNEPAL",
                "View current employer demand letters and openings.",
            ),
            (
                "/gallery",
                "Gallery | VNVNEPAL",
                "Photos from training, orientation and deployment events.",
            ),
            (
                "/awards",
                "Awards & Recognition | VNVNEPAL",
                "Licences, ISO, SEDEX, ALP and NAFEA certificates held by Vision & Value Overseas.",
            ),
            (
                "/careers",
                "Careers at Vision & Value | VNVNEPAL",
                "Internal career openings at Vision & Value Overseas.",
            ),
            (
                "/contact",
                "Contact Vision & Value Overseas | Kathmandu, Nepal",
                "Contact VNVNEPAL in Basundhara, Kathmandu — phone, email and enquiry form for employers and job seekers.",
            ),
            (
                "/online-registration",
                "Online Registration | VNVNEPAL",
                "Register online as a candidate with Vision & Value Overseas for overseas employment.",
            ),
            (
                "/privacy",
                "Privacy Policy | Vision & Value Overseas (VNVNEPAL)",
                "How Vision & Value Overseas Pvt. Ltd. collects, uses and protects personal information.",
            ),
            (
                "/terms",
                "Terms & Conditions | Vision & Value Overseas (VNVNEPAL)",
                "Terms of use for the Vision & Value Overseas (VNVNEPAL) website and recruitment enquiries.",
            ),
        ]
        for path, title, description in pages:
            meta, _ = PageMeta.objects.update_or_create(
                path=path,
                defaults={
                    "title": title,
                    "description": description,
                    "keywords": "manpower nepal, overseas recruitment, ethical recruitment, VNVNEPAL",
                    "is_active": True,
                },
            )
            if not meta.og_image and (WEB_PUBLIC / "og-default.jpg").exists():
                self._attach(meta.og_image, WEB_PUBLIC / "og-default.jpg")
                meta.save()
