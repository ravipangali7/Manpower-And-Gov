"""Public URL inventory for FE sitemap generation.

The SPA ships a static `web/public/sitemap.xml` for known routes.
This module (+ GET /api/public/sitemap-urls/) supplies dynamic Content
and StaticPage paths so the frontend can merge them into a full sitemap.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from .models import Content, StaticPage

# Static FE routes that are always indexable (mirrors web/public/sitemap.xml intent).
STATIC_PUBLIC_PATHS = [
    "/",
    "/services-list",
    "/gallery",
    "/our-team",
    "/contact-us",
    "/jobs",
    # /search is noindex — omit from sitemap inventory
]


def _iso(dt: datetime | None) -> str | None:
    if not dt:
        return None
    if hasattr(dt, "isoformat"):
        return dt.isoformat()
    return str(dt)


def content_sitemap_entries() -> list[dict[str, Any]]:
    return [
        {
            "loc": f"/content/{c.pk}",
            "lastmod": _iso(c.updated_at or c.published_at),
        }
        for c in Content.objects.only("id", "updated_at", "published_at").order_by("id")
    ]


def page_sitemap_entries() -> list[dict[str, Any]]:
    return [
        {
            "loc": f"/pages/{p.slug}",
            "lastmod": _iso(p.updated_at),
        }
        for p in StaticPage.objects.only("slug", "updated_at").order_by("slug")
    ]


def static_sitemap_entries() -> list[dict[str, Any]]:
    return [{"loc": path, "lastmod": None} for path in STATIC_PUBLIC_PATHS]


def all_sitemap_urls(*, include_static: bool = True) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    if include_static:
        entries.extend(static_sitemap_entries())
    entries.extend(page_sitemap_entries())
    entries.extend(content_sitemap_entries())
    return entries
