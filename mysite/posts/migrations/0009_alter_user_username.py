# Generated by Django 3.2.6 on 2021-08-09 05:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0008_alter_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(blank=True, max_length=255, unique=True),
        ),
    ]
