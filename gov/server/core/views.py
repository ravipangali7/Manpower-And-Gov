from django.db.models import Q
from rest_framework import filters, mixins, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.views import APIView

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


class ContentSerializer(ModelSerializer):
    date = serializers.DateTimeField(source="published_at")
    fileUrl = serializers.CharField(source="file_url", allow_blank=True)
    metaTitle = serializers.CharField(source="meta_title", allow_blank=True, required=False)
    metaDescription = serializers.CharField(
        source="meta_description", allow_blank=True, required=False
    )

    class Meta:
        model = Content
        fields = [
            "id",
            "title",
            "category",
            "date",
            "summary",
            "body",
            "fileUrl",
            "featured",
            "metaTitle",
            "metaDescription",
            "display_order",
            "created_at",
            "updated_at",
        ]


class AgencySerializer(ModelSerializer):
    type = serializers.CharField(source="agency_type")

    class Meta:
        model = Agency
        fields = [
            "id",
            "type",
            "name",
            "license",
            "address",
            "phone",
            "email",
            "status",
            "display_order",
            "created_at",
            "updated_at",
        ]

class ServiceSerializer(ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class OfficialSerializer(ModelSerializer):
    class Meta:
        model = Official
        fields = "__all__"


class TeamMemberSerializer(ModelSerializer):
    photoUrl = serializers.URLField(source="photo_url", allow_blank=True, required=False)

    class Meta:
        model = TeamMember
        fields = [
            "id",
            "name",
            "designation",
            "division",
            "section",
            "phone",
            "email",
            "photoUrl",
            "display_order",
            "created_at",
            "updated_at",
        ]


class StaticPageSerializer(ModelSerializer):
    metaDescription = serializers.CharField(
        source="meta_description", allow_blank=True, required=False
    )

    class Meta:
        model = StaticPage
        fields = [
            "id",
            "slug",
            "title",
            "body",
            "metaDescription",
            "display_order",
            "created_at",
            "updated_at",
        ]


class AlbumSerializer(ModelSerializer):
    type = serializers.CharField(source="media_type")
    date = serializers.DateField(source="published_at", allow_null=True, required=False)

    class Meta:
        model = Album
        fields = [
            "id",
            "title",
            "count",
            "type",
            "date",
            "display_order",
            "created_at",
            "updated_at",
        ]

class ContactSectionSerializer(ModelSerializer):
    no = serializers.CharField(source="serial_no")

    class Meta:
        model = ContactSection
        fields = [
            "id",
            "no",
            "name",
            "rows",
            "display_order",
            "created_at",
            "updated_at",
        ]

class JobSerializer(ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"


class SiteSettingsSerializer(ModelSerializer):
    siteName = serializers.CharField(source="site_name")
    tollFree = serializers.CharField(source="toll_free", allow_blank=True)
    adminUser = serializers.CharField(source="admin_user")
    adminPassword = serializers.CharField(source="admin_password")
    siteUrl = serializers.CharField(source="site_url", allow_blank=True, required=False)
    ogImageUrl = serializers.CharField(source="og_image_url", allow_blank=True, required=False)
    facebookUrl = serializers.CharField(source="facebook_url", allow_blank=True, required=False)
    twitterUrl = serializers.CharField(source="twitter_url", allow_blank=True, required=False)
    gscVerification = serializers.CharField(
        source="gsc_verification", allow_blank=True, required=False
    )

    class Meta:
        model = SiteSettings
        fields = [
            "id",
            "siteName",
            "ministry",
            "address",
            "phone",
            "tollFree",
            "email",
            "adminUser",
            "adminPassword",
            "siteUrl",
            "ogImageUrl",
            "facebookUrl",
            "twitterUrl",
            "gscVerification",
            "created_at",
            "updated_at",
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep.pop("id", None)
        return rep


class BaseModelViewSet(viewsets.ModelViewSet):
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ["display_order", "created_at", "updated_at", "id"]
    ordering = ["display_order", "-created_at"]


class ContentViewSet(BaseModelViewSet):
    serializer_class = ContentSerializer
    queryset = Content.objects.all()
    search_fields = ["title", "summary", "body", "category", "meta_title", "meta_description"]
    ordering_fields = BaseModelViewSet.ordering_fields + ["published_at", "category"]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")
        featured = self.request.query_params.get("featured")
        q = self.request.query_params.get("q")
        if category:
            queryset = queryset.filter(category=category)
        if featured is not None:
            queryset = queryset.filter(featured=featured.lower() in {"1", "true", "yes"})
        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) | Q(summary__icontains=q) | Q(body__icontains=q)
            )
        return queryset


class AgencyViewSet(BaseModelViewSet):
    serializer_class = AgencySerializer
    queryset = Agency.objects.all()
    search_fields = ["name", "license", "address", "phone", "email", "agency_type"]
    ordering_fields = BaseModelViewSet.ordering_fields + ["agency_type", "name", "status"]

    def get_queryset(self):
        queryset = super().get_queryset()
        agency_type = self.request.query_params.get("type")
        status_filter = self.request.query_params.get("status")
        if agency_type:
            queryset = queryset.filter(agency_type=agency_type)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset


class ServiceViewSet(BaseModelViewSet):
    serializer_class = ServiceSerializer
    queryset = Service.objects.all()
    search_fields = ["title", "href", "description"]


class OfficialViewSet(BaseModelViewSet):
    serializer_class = OfficialSerializer
    queryset = Official.objects.all()
    search_fields = ["name", "role", "email", "phone"]


class TeamMemberViewSet(BaseModelViewSet):
    serializer_class = TeamMemberSerializer
    queryset = TeamMember.objects.all()
    search_fields = ["name", "designation", "section", "email", "phone"]


class StaticPageViewSet(BaseModelViewSet):
    serializer_class = StaticPageSerializer
    queryset = StaticPage.objects.all()
    search_fields = ["title", "slug", "body", "meta_description"]
    ordering_fields = BaseModelViewSet.ordering_fields + ["slug", "title"]

    @action(detail=False, methods=["get"], url_path="by-slug/(?P<slug>[^/.]+)")
    def by_slug(self, request, slug=None):
        page = self.get_queryset().filter(slug=slug).first()
        if not page:
            return Response({"detail": "Page not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(self.get_serializer(page).data)


class AlbumViewSet(BaseModelViewSet):
    serializer_class = AlbumSerializer
    queryset = Album.objects.all()
    search_fields = ["title", "media_type"]
    ordering_fields = BaseModelViewSet.ordering_fields + ["published_at", "media_type", "count"]

    def get_queryset(self):
        queryset = super().get_queryset()
        media_type = self.request.query_params.get("type")
        if media_type:
            queryset = queryset.filter(media_type=media_type)
        return queryset


class ContactSectionViewSet(BaseModelViewSet):
    serializer_class = ContactSectionSerializer
    queryset = ContactSection.objects.all()
    search_fields = ["serial_no", "name", "rows"]


class JobViewSet(BaseModelViewSet):
    serializer_class = JobSerializer
    queryset = Job.objects.all()
    search_fields = ["title", "company", "country", "salary", "contract"]
    ordering_fields = BaseModelViewSet.ordering_fields + ["deadline", "status", "vacancies"]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get("status")
        country = self.request.query_params.get("country")
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if country:
            queryset = queryset.filter(country__iexact=country)
        return queryset


class SiteSettingsViewSet(
    mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):
    serializer_class = SiteSettingsSerializer
    queryset = SiteSettings.objects.all().order_by("id")

    def list(self, request, *args, **kwargs):
        obj, _ = SiteSettings.objects.get_or_create(
            singleton_key="default",
            defaults={"site_name": "Department of Foreign Employment"},
        )
        return Response(self.get_serializer(obj).data)

    def create(self, request, *args, **kwargs):
        obj = SiteSettings.objects.filter(singleton_key="default").first()
        if obj:
            serializer = self.get_serializer(obj, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(singleton_key="default")
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PublicSiteDataView(APIView):
    def get(self, request):
        settings_obj, _ = SiteSettings.objects.get_or_create(
            singleton_key="default",
            defaults={"site_name": "Department of Foreign Employment"},
        )
        data = {
            "contents": ContentSerializer(Content.objects.all(), many=True).data,
            "agencies": AgencySerializer(Agency.objects.all(), many=True).data,
            "services": ServiceSerializer(Service.objects.all(), many=True).data,
            "officials": OfficialSerializer(Official.objects.all(), many=True).data,
            "team": TeamMemberSerializer(TeamMember.objects.all(), many=True).data,
            "pages": StaticPageSerializer(StaticPage.objects.all(), many=True).data,
            "albums": AlbumSerializer(Album.objects.all(), many=True).data,
            "contactSections": ContactSectionSerializer(ContactSection.objects.all(), many=True).data,
            "jobs": JobSerializer(Job.objects.all(), many=True).data,
            "settings": SiteSettingsSerializer(settings_obj).data,
        }
        return Response(data)


class PublicSitemapUrlsView(APIView):
    """Return indexable path list for FE sitemap merge (static + pages + contents)."""

    def get(self, request):
        from .sitemaps import all_sitemap_urls

        include_static = request.query_params.get("include_static", "1").lower() not in {
            "0",
            "false",
            "no",
        }
        return Response(all_sitemap_urls(include_static=include_static))
