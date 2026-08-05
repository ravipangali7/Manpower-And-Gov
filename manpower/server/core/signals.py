from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import CMSPage, Job, NewsArticle


@receiver(post_save, sender=NewsArticle)
def news_indexnow_on_save(sender, instance, **kwargs):
    """Ping IndexNow after news save when INDEXNOW_KEY is set (fail soft)."""
    try:
        from .indexnow import notify_news_saved

        notify_news_saved(instance)
    except Exception:  # noqa: BLE001 — never break CMS saves
        pass


@receiver(post_save, sender=CMSPage)
def cms_page_indexnow_on_save(sender, instance, **kwargs):
    """Ping IndexNow after CMS page save when INDEXNOW_KEY is set (fail soft)."""
    try:
        from .indexnow import notify_cms_page_saved

        notify_cms_page_saved(instance)
    except Exception:  # noqa: BLE001 — never break CMS saves
        pass


@receiver(post_save, sender=Job)
def job_indexnow_on_save(sender, instance, **kwargs):
    """Ping vacancies listing after job save when INDEXNOW_KEY is set (fail soft)."""
    try:
        from .indexnow import notify_jobs_listing

        notify_jobs_listing()
    except Exception:  # noqa: BLE001 — never break CMS saves
        pass
