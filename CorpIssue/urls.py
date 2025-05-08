from django.urls import path
from .views import list_corps, select_version, invoice_tasks, approve_task, reject_task,rejection_details,sub_tasks,approve_all_tasks,sales_manager_view,next_stage,get_team_projects,approve_task_sales_manager,reject_task_sales_manager,next_stage_sales_manager,approve_all_and_send

urlpatterns = [
    path('corps/', list_corps, name='list_corps'),  # List all corps
    path('corp/<str:corp_code>/', list_corps, name='list_corps'),  # Show selected corp's status
    path('select_version/<str:corp_code>/', select_version, name='select_version'),
    path('invoicetasks/<int:invoice_id>/', invoice_tasks, name='invoice_tasks'),  # InvoiceTask forms
    path('approve_task/<int:task_id>/', approve_task, name='approve_task'),  # Approve task
    path('reject_task/<int:task_id>/', reject_task, name='reject_task'),  # Reject task
    path('rejection_details/<int:task_id>/', rejection_details, name='rejection_details'),  # Fetch rejection details
    path('sub_tasks/<int:task_id>/', sub_tasks, name='sub_tasks'),
    path('get_team_projects/', get_team_projects, name='get_team_projects'),
    path('approve_all_tasks/<int:invoice_id>/', approve_all_tasks, name='approve_all_tasks'),  # Approve all tasks
    path('sales_manager/<int:invoice_id>/', sales_manager_view, name='sales_manager_view'),
    path('sales_manager/<int:invoice_id>/next_stage/', next_stage, name='next_stage'),
    path('approve_task_sales_manager/<int:task_id>/', approve_task_sales_manager, name='approve_task_sales_manager'),
    path('reject_task_sales_manager/<int:task_id>/', reject_task_sales_manager, name='reject_task_sales_manager'),
    path('next_stage_sales_manager/<int:invoice_id>/', next_stage_sales_manager, name='next_stage_sales_manager'),
    path('approve_all_and_send/<int:invoice_id>/', approve_all_and_send, name='approve_all_and_send'),
]
