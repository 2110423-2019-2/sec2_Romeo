# Generated by Django 3.0.3 on 2020-03-25 19:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AvailTime',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('avail_date', models.CharField(choices=[('SUNDAY', 'Sunday'), ('MONDAY', 'Monday'), ('TUESDAY', 'Tuesday'), ('WEDNESDAY', 'Wednesday'), ('THURSDAY', 'Thursday'), ('FRIDAY', 'Friday'), ('SATURDAY', 'Saturday')], max_length=20)),
                ('avail_time', models.CharField(choices=[('HALF_DAY_MORNING', 'Half-day(Morning-Noon)'), ('HALF_DAY_NOON', 'Half-day(Noon-Evening)'), ('FULL_DAY', 'Full-Day'), ('NIGHT', 'Night'), ('FULL_DAY_NIGHT', 'Full-Day and Night')], max_length=16)),
                ('photographer_price', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Equipment',
            fields=[
                ('equipment_name', models.CharField(max_length=100, primary_key=True, serialize=False, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('photo_link', models.URLField(primary_key=True, serialize=False, unique=True)),
            ],
        ),
    ]
