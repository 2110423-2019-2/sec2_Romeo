# Generated by Django 3.0.4 on 2020-03-13 18:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('photographers', '0003_auto_20200314_0056'),
        ('customers', '0005_auto_20200312_1601'),
        ('jobs', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobinfo',
            name='job_customer',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='jobs_by_customer', to='customers.Customer'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='jobinfo',
            name='job_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='jobinfo',
            name='job_photographer',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='jobs_of_photographer', to='photographers.Photographer'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='jobinfo',
            name='job_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='jobinfo',
            name='job_status',
            field=models.CharField(choices=[('PENDING', 'Pending'), ('MATCHED', 'Matched'), ('DECLINED', 'Declined'), ('PAID', 'Paid'), ('CANCELLED', 'Cancelled'), ('PROCESSING', 'Processing Photos'), ('DONE', 'Done'), ('COMPLETED', 'Completed'), ('CLOSED', 'Closed')], max_length=10),
        ),
    ]
