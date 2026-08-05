from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Content


@receiver(post_save, sender=Content)
def content_indexnow_on_save(sender, instance, **kwargs):
    """Ping IndexNow after Content save when INDEXNOW_KEY is set (fail soft)."""
    try:
        from .indexnow import notify_content_saved

        notify_content_saved(instance)
    except Exception:  # noqa: BLE001 — never break CMS saves
        pass
