from django.core.management.base import BaseCommand

from CorpIssue import models

 

class Command(BaseCommand):

    help = 'Insert default const values into the database'

 

    def handle(self, *args, **kwargs):

        models.Invoice.objects.all().delete()

 

        self.stdout.write(self.style.SUCCESS('Default const values inserted successfully.'))