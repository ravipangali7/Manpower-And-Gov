"""IndexNow helpers — notify search engines when content URLs change.

Set INDEXNOW_KEY in the environment (and host `{key}.txt` on the public site).
When the key is unset, all calls no-op. Failures never raise to callers.
"""

from __future__ import annotations

import json
import logging
import os
import urllib.error
import urllib.request
from typing import Iterable
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"


def get_indexnow_key() -> str:
    return (os.environ.get("INDEXNOW_KEY") or "").strip()


def resolve_site_host_and_origin() -> tuple[str, str] | tuple[None, None]:
    """Return (host, origin) from SITE_URL or FRONTEND_URL (env / Django settings)."""
    origin = (
        os.environ.get("SITE_URL")
        or os.environ.get("FRONTEND_URL")
        or ""
    ).strip().rstrip("/")
    if not origin:
        try:
            from django.conf import settings

            origin = (
                getattr(settings, "SITE_URL", None)
                or getattr(settings, "FRONTEND_URL", None)
                or ""
            ).strip().rstrip("/")
        except Exception:  # noqa: BLE001 — fail soft during migrations / early boot
            return None, None
    if not origin:
        return None, None
    parsed = urlparse(origin if "://" in origin else f"https://{origin}")
    host = parsed.netloc or parsed.path.split("/")[0]
    if not host:
        return None, None
    scheme = parsed.scheme or "https"
    return host, f"{scheme}://{host}"


def submit_indexnow(urls: Iterable[str]) -> dict:
    """
    POST url list to IndexNow. Returns a status dict; never raises.
    Skips when INDEXNOW_KEY is unset or urls are empty.
    """
    key = get_indexnow_key()
    url_list = [u for u in urls if u]
    if not key or not url_list:
        return {"ok": True, "skipped": True}

    host, origin = resolve_site_host_and_origin()
    if not host:
        logger.info("IndexNow skipped: no SITE_URL / FRONTEND_URL configured")
        return {"ok": True, "skipped": True, "reason": "no_host"}

    payload = {
        "host": host,
        "key": key,
        "keyLocation": f"https://{host}/{key}.txt",
        "urlList": url_list,
    }
    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        INDEXNOW_ENDPOINT,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            status = getattr(response, "status", 200)
            return {"ok": 200 <= status < 300, "status": status}
    except urllib.error.HTTPError as exc:
        logger.warning("IndexNow HTTP error: %s", exc.code)
        return {"ok": False, "status": exc.code}
    except Exception as exc:  # noqa: BLE001
        logger.warning("IndexNow request failed: %s", exc)
        return {"ok": False, "error": str(exc)}


def notify_urls(urls: Iterable[str]) -> dict:
    """Ping IndexNow for absolute public URLs (fail soft)."""
    if not get_indexnow_key():
        return {"ok": True, "skipped": True}
    return submit_indexnow(urls)


def notify_news_saved(article) -> dict:
    """Build /news/{slug} URL and ping IndexNow."""
    if not get_indexnow_key():
        return {"ok": True, "skipped": True}
    host, origin = resolve_site_host_and_origin()
    if not origin or not getattr(article, "slug", None):
        return {"ok": True, "skipped": True, "reason": "no_host_or_slug"}
    if not getattr(article, "is_published", True):
        return {"ok": True, "skipped": True, "reason": "unpublished"}
    return submit_indexnow([f"{origin}/news/{article.slug}"])


def notify_cms_page_saved(page) -> dict:
    """Build public page URL and ping IndexNow.

    Known fixed routes: methodology, careers. Other CMS pages use /pages/{slug}.
    """
    if not get_indexnow_key():
        return {"ok": True, "skipped": True}
    host, origin = resolve_site_host_and_origin()
    slug = getattr(page, "slug", None)
    if not origin or not slug:
        return {"ok": True, "skipped": True, "reason": "no_host_or_slug"}
    if not getattr(page, "is_published", True):
        return {"ok": True, "skipped": True, "reason": "unpublished"}
    fixed = {"methodology": "/methodology", "careers": "/careers", "career": "/careers"}
    path = fixed.get(slug, f"/pages/{slug}")
    return submit_indexnow([f"{origin}{path}"])


def notify_jobs_listing() -> dict:
    """Ping the public vacancies listing after a job save."""
    if not get_indexnow_key():
        return {"ok": True, "skipped": True}
    host, origin = resolve_site_host_and_origin()
    if not origin:
        return {"ok": True, "skipped": True, "reason": "no_host"}
    return submit_indexnow([f"{origin}/vacancies"])
