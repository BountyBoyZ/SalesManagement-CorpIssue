from django.contrib import admin
from TeamFeature.models import TeamCorpFeature


@admin.register(TeamCorpFeature)
class TeamCorpFeatureAdmin(admin.ModelAdmin):
    list_filter = ('YearNumber',)
