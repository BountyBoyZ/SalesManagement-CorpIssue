# Generated by Django 5.0.11 on 2025-02-27 18:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('CorpIssue', '0016_invoice_corp_code_project_team_code'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='invoice',
            name='version_number',
        ),
    ]
