# Generated by Django 5.0.11 on 2025-02-01 19:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CorpIssue', '0004_alter_version_version_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='corp_code',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='CorpIssue.corp'),
        ),
    ]
