# Generated by Django 3.0.3 on 2020-03-25 19:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('jobs', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReviewInfo',
            fields=[
                ('ReviewJob', models.OneToOneField(limit_choices_to={'JobStatus': 'Closed'}, on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='jobs.JobInfo')),
                ('ReviewDetail', models.TextField()),
            ],
        ),
    ]
