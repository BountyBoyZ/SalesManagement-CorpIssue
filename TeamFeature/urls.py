from django.urls import path
import TeamFeature.views as TeamFeatureViews


app_name = 'TeamFeature'
urlpatterns = [
    path('', TeamFeatureViews.TeamFeatureView, name="redirect_view"),
    path('feature-view/', TeamFeatureViews.TeamFeature_FeatureView, name="redirect_view"),
    path('corp-view/', TeamFeatureViews.TeamFeature_CorpView, name="redirect_view"),
    path('insert/', TeamFeatureViews.TeamFeatureInsert, name="teamfeature_insert"),
    path('<str:username>/', TeamFeatureViews.TeamFeatureView, name="teamfeature_view"),
    path('importance/<str:feature>/<int:importance_number>/', TeamFeatureViews.FeatureImportance, name="feature_importance"),
    path('active/<str:feature>/<str:corp>/<str:year_number>/', TeamFeatureViews.TeamCorpFeatureActive, name="teamfeature_view"),
    path('deactivate/<str:feature>/<str:corp>/', TeamFeatureViews.TeamCorpFeatureDeactivate, name="teamfeature_view"),
    path('delete/<str:feature>/', TeamFeatureViews.TeamFeatureDelete, name="teamfeature_view"),
    path('update/<str:feature>/', TeamFeatureViews.TeamFeatureUpdate, name="teamfeature_view"),
]