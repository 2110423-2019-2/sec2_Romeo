# Generated by Django 3.0.3 on 2020-04-01 18:18
||||||| merged common ancestors
# Generated by Django 3.0.3 on 2020-04-01 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('payment_id', models.AutoField(primary_key=True, serialize=False)),
                ('payment_status', models.CharField(choices=[('DEPOSIT', 'Deposit'), ('REMAINING', 'Remaining')], max_length=10)),
                ('payment_amount', models.FloatField()),
            ],
        ),
    ]
