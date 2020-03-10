# Generated by Django 3.0.3 on 2020-03-10 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photographers', '0002_auto_20200310_0906'),
    ]

    operations = [
        migrations.RenameField(
            model_name='availtime',
            old_name='AvailDate',
            new_name='avail_date',
        ),
        migrations.RenameField(
            model_name='availtime',
            old_name='AvailTime',
            new_name='avail_time',
        ),
        migrations.RenameField(
            model_name='equipment',
            old_name='EquipmentName',
            new_name='equipment_name',
        ),
        migrations.RenameField(
            model_name='photo',
            old_name='PhotoLink',
            new_name='photo_link',
        ),
        migrations.RenameField(
            model_name='style',
            old_name='StyleName',
            new_name='style_name',
        ),
        migrations.RemoveField(
            model_name='photographer',
            name='photographer_price',
        ),
        migrations.AddField(
            model_name='availtime',
            name='photographer_price',
            field=models.FloatField(default=100),
            preserve_default=False,
        ),
    ]