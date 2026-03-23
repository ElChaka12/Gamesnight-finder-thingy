from datetime import timedelta

from django.db import migrations


def seed_demo_game_nights(apps, schema_editor):
    from django.utils import timezone

    GameNight = apps.get_model("events", "GameNight")

    if GameNight.objects.exists():
        return

    now = timezone.localtime(timezone.now()).replace(minute=0, second=0, microsecond=0)
    first_start = now.replace(hour=18)
    if first_start <= now:
        first_start += timedelta(days=1)

    game_nights = [
        GameNight(
            title="Residence Hall Kickoff",
            game_title="Codenames",
            description="Fast team play for students who want an easy first-night icebreaker.",
            host_name="Lebo",
            campus_name="Main Campus",
            venue="Tutu Hall Common Room",
            starts_at=first_start + timedelta(days=1),
            ends_at=first_start + timedelta(days=1, hours=2),
            skill_level="beginner",
            spots_total=10,
            spots_taken=4,
            is_featured=True,
            contact_link="https://example.com/gamenight/codenames",
        ),
        GameNight(
            title="Strategy Society Friday Table",
            game_title="Catan",
            description="A longer session for students who want a competitive but still friendly strategy night.",
            host_name="Aiden",
            campus_name="Engineering Campus",
            venue="Innovation Hub Atrium",
            starts_at=first_start + timedelta(days=3),
            ends_at=first_start + timedelta(days=3, hours=3),
            skill_level="mixed",
            spots_total=6,
            spots_taken=5,
            is_featured=True,
            contact_link="https://example.com/gamenight/catan",
        ),
        GameNight(
            title="Late-Night Bluffing Club",
            game_title="Blood on the Clocktower",
            description="A social deduction night for students who want something louder, bigger, and more theatrical.",
            host_name="Nandi",
            campus_name="South Campus",
            venue="Student Centre Rooftop",
            starts_at=first_start + timedelta(days=5, hours=1),
            ends_at=first_start + timedelta(days=5, hours=4),
            skill_level="competitive",
            spots_total=12,
            spots_taken=7,
            is_featured=False,
            contact_link="https://example.com/gamenight/clocktower",
        ),
    ]

    GameNight.objects.bulk_create(game_nights)


def remove_demo_game_nights(apps, schema_editor):
    GameNight = apps.get_model("events", "GameNight")
    GameNight.objects.filter(
        title__in=[
            "Residence Hall Kickoff",
            "Strategy Society Friday Table",
            "Late-Night Bluffing Club",
        ]
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("events", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_demo_game_nights, remove_demo_game_nights),
    ]
