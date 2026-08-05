from django.db import migrations, models


def forward_paths(apps, schema_editor):
    SiteConfiguration = apps.get_model("core", "SiteConfiguration")
    SiteConfiguration.objects.filter(ethic_button_path="/about").update(
        ethic_button_path="/ethical-recruitment"
    )
    FooterLink = apps.get_model("core", "FooterLink")
    FooterLink.objects.filter(
        label="Ethical Recruitment",
        path="/services/overseas-recruitment",
    ).update(path="/ethical-recruitment")


def reverse_paths(apps, schema_editor):
    SiteConfiguration = apps.get_model("core", "SiteConfiguration")
    SiteConfiguration.objects.filter(ethic_button_path="/ethical-recruitment").update(
        ethic_button_path="/about"
    )
    FooterLink = apps.get_model("core", "FooterLink")
    FooterLink.objects.filter(
        label="Ethical Recruitment",
        path="/ethical-recruitment",
    ).update(path="/services/overseas-recruitment")


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0003_content_blocks"),
    ]

    operations = [
        migrations.AlterField(
            model_name="contentblock",
            name="page",
            field=models.CharField(
                choices=[
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
                ],
                db_index=True,
                max_length=60,
            ),
        ),
        migrations.AlterField(
            model_name="siteconfiguration",
            name="ethic_button_path",
            field=models.CharField(
                blank=True, default="/ethical-recruitment", max_length=200
            ),
        ),
        migrations.RunPython(forward_paths, reverse_paths),
    ]
