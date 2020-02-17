# Generated by Django 3.0.3 on 2020-02-12 11:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('customers', '0004_customerinfo_paymentinfo'),
        ('photographers', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('JobCustomer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='customers.CustomerInfo')),
                ('JobPhotographer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='photographers.PhotographerInfo')),
            ],
        ),
    ]