# Generated by Django 3.2.6 on 2021-08-09 00:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_auto_20210808_1733'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='posts',
            options={'managed': False},
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        
    ]
