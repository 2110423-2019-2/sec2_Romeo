# Generated by Django 3.0.4 on 2020-03-19 16:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('customers', '0001_initial'),
        ('photographers', '0002_photographer_style'),
        ('jobs', '0002_jobreservation_job_reservation'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobinfo',
            name='job_customer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='jobs_by_customer', to='customers.Customer'),
        ),
        migrations.AddField(
            model_name='jobinfo',
            name='job_photographer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='jobs_of_photographer', to='photographers.Photographer'),
        ),
        migrations.AddField(
            model_name='jobinfo',
            name='job_reservation',
            field=models.ManyToManyField(blank=True, null=True, to='jobs.JobReservation'),
        ),
    ]