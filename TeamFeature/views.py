from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.shortcuts import render, redirect
from TeamFeature.models import TeamFeature, TeamCorpFeature, TeamFeatureLog
import requests
from django.http import HttpResponse
from django.http.response import JsonResponse
import json
#import HR
#from HR.decorators import hr_login_required

from Utility.FormDataManager import get_numeric_value
from Utility.Authentication.Utils import (V1_PermissionControl as permission_control,
                                          V1_find_token_from_request as find_token,
                                          V1_get_data_from_token as get_token_data, )
from Utility.Authentication.Utils import (
    V1_PermissionControl,
    V1_get_host,
    V1_get_port,
    V1_find_token_from_request,
    V1_get_data_from_token,
    V1_call_api,
    V1_get_all_user_team_roles,
    V1_get_all_teams,
    V1_get_or_create_auth_user,
)


@V1_PermissionControl
def TeamFeatureView(request, username=''):
    context = {}
    token = V1_find_token_from_request(request)
    username = str(V1_get_data_from_token(token,'username')).lower()
    user_team_roles = V1_get_data_from_token(token,'team_role_info')
    obj_corp = V1_call_api(f"http://192.168.20.81:17000/EIT/api/get-corp/")
    team = ''
    obj_teams = []
    has_more_than_one_team = False
    # when current user has more than one team,
    # we show them into combo, and when (s)he changes combo, page would be post back
    # in postback time, we send team code in POST method
    if request.method == "POST":
        if 'team_selected' in request.POST:
            team = request.POST.get('team_selected')
    user = V1_get_or_create_auth_user(username)
    if user.groups.filter(name='AllTeam').exists():
        obj_team = V1_call_api(f"http://192.168.20.81:14000/HR/api/all-team-service/")
    else:
        obj_team = [{'TeamCode':item.get('TeamCode'),'TeamName':item.get('TeamName')} for item in user_team_roles if item.get('ActiveInService') is True]


    # we just need team code
    for item in obj_team:
        obj_teams.append({"TeamCode": item.get('TeamCode'), "TeamName": item.get('TeamName')})

    if len(obj_team) > 1:
        has_more_than_one_team = True

    if not obj_teams:
        return render(request,'TeamFeature/not_in_service.html')
            # at first time, first user team, is the team that we want to filter feature base on it
    if team == '':
        team = obj_teams[0]["TeamCode"]

    obj_feature = TeamFeature.objects.filter(TeamCode=team)

    # obj_team_feature = TeamCorpFeature.objects.all()
    obj_team_feature_dict = {}
    team_corp_feature_list = []
    team_corp_feature_all = TeamCorpFeature.objects.all()
    team_corp_feature_all_list = {}
    for item in team_corp_feature_all:
        data = f"{item.CorpCode}-{item.FeatureCode_id}"
        team_corp_feature_all_list.update({data: str(item.YearNumber)})
    for feature in obj_feature:
        team_corp_feature = []
        for corp in obj_corp:
            alt = 'برای فعال کردن این قابلیت در شرکت بیمه ' + corp['CorpName'] + ' کلیک کنید'
            TF = {'feature_code': feature.FeatureCode, 'year_no': feature.YearNumber, 'corp': corp,
                  'active': False, 'image_name': 'inactive', 'alt': alt}
            # TCF = TeamCorpFeature.objects.filter(CorpCode=corp['CorpCode'], FeatureCode_id=feature.FeatureCode).first()
            key = f"{corp['CorpCode']}-{feature.FeatureCode}"

            if key in team_corp_feature_all_list.keys():
                alt = 'برای غیرفعال کردن این قابلیت در شرکت بیمه ' + corp['CorpName'] + ' کلیک کنید'
                TF['active'] = True
                TF['year_no'] = team_corp_feature_all_list.get(key)
                TF['image_name'] = 'active'
                TF['alt'] = alt

            team_corp_feature.append(TF)
        TCF = {'feature': feature, 'list': team_corp_feature}
        team_corp_feature_list.append(TCF)

    context.update(
        {
            "obj_team": obj_teams,
            'username': username,
            'has_more_than_one_team': has_more_than_one_team,
            'obj_corp': obj_corp,
            'team': team,
            'obj_feature': obj_feature,
            'team_corp_feature_list': team_corp_feature_list,
            'obj_team_feature_dict': obj_team_feature_dict,
        })

    return render(request, 'TeamFeature/team_feature.html', context)


@csrf_exempt
def TeamCorpFeatureDeactivate(request, feature, corp):
    data = {"success": False}

    if feature and corp:
        obj = TeamCorpFeature.objects.filter(FeatureCode=feature, CorpCode=corp).first()
        if obj:
            obj.delete()
        data["success"] = True

    return HttpResponse(
        json.dumps(data),
        content_type="application/json")


@csrf_exempt
def FeatureImportance(request, feature, importance_number):
    data = {"success": False}

    if feature and importance_number and 1 <= importance_number <= 3:
        # check if feature code is valid
        objFeature = TeamFeature.objects.filter(FeatureCode=feature).first()
        if objFeature:
            objFeature.Importance = importance_number
            objFeature.save()
            data["success"] = True

    return HttpResponse(
        json.dumps(data),
        content_type="application/json")




@csrf_exempt
def TeamCorpFeatureActive(request, feature, corp, year_number):
    data = {"success": False}
    token = find_token(request)
    username = get_token_data(token, "username")


    if feature and corp and year_number:
        obj = TeamCorpFeature.objects.filter(FeatureCode=feature, CorpCode=corp).first()
        if not obj:
            obj = TeamCorpFeature()
            obj.CorpCode = corp
            obj.FeatureCode_id = feature
            # obj.CreatorUserName = username

        obj.YearNumber = year_number
        obj.save()
        data["success"] = True

    return HttpResponse(
        json.dumps(data),
        content_type="application/json")


@csrf_exempt
def TeamFeatureDelete(request, feature):
    data = {"success": False}

    if feature:
        obj = TeamFeature.objects.filter(FeatureCode=feature).first()
        if obj:
            TeamFeatureLog.objects.create(Feature_Old=obj.Feature, FeatureCode=obj.FeatureCode,
                                          ActionType=TeamFeatureLog.Delete)
            obj.delete()
        data["success"] = True

    return HttpResponse(
        json.dumps(data),
        content_type="application/json")


def Redirect(request):
    return redirect(reverse('TeamFeature:teamfeature_view', kwargs={'username': request.user.UserName}))

@csrf_exempt
def TeamFeatureInsert(request):
    data = {"success": False, 'message': 'نحوه ارسال داده ها صحیح نیست'}

    if request.method == "POST":
        feature_text = request.POST.get('feature')
        team_code = request.POST.get('team-code')
        year_number = get_numeric_value.ver1(request.POST.get('year-number'))
        order = get_numeric_value.ver1(request.POST.get('order'))
        star_count = get_numeric_value.ver1(request.POST.get('star-count'))


        if feature_text and len(feature_text) > 10 and team_code and len(team_code) == 3 \
                and year_number and int(year_number) > 1380 and order and int(order) >= 1:
            feature_code = ''
            # at first, we must define new feature code
            # inorder to do this, we must find last feature_code of this team and increment this counter
            # find max feature code of this team in that year
            obj = TeamFeature.objects.filter(TeamCode=team_code, YearNumber=year_number).order_by('FeatureCode').last()
            if obj:
                feature_code = obj.FeatureCode
                counter = int(feature_code[-3:]) + 1
                str_counter = str(counter).zfill(3)
                feature_code = feature_code[:5] + str_counter
            # there is not any feature for this team in that year
            else:
                feature_code = team_code + str(year_number)[2:] + '001'

            # it must not possible!!!!
            # while TeamFeature.objects.filter(FeatureCode=feature_code).exists():
            #     counter = int(str_counter) + 1
            #     str_counter = str(counter)
            #     while len(str_counter) < 3:
            #         str_counter = '0' + str_counter
            #     feature_code = feature_code[:5] + str_counter

            # insert log record
            # TeamFeatureLog.objects.create(Feature_New=feature_text, FeatureCode=feature_code,
            #                               ActionType=TeamFeatureLog.Add)
            # create new feature
            TeamFeature.objects.create(FeatureCode=feature_code, Feature=feature_text, TeamCode=team_code,
                                       YearNumber=year_number, FeaturePriority=order, Importance=star_count)
            data['success'] = True
        else:
            data['message'] = 'مقادیر وارد شده معتبر نیستند'
    return HttpResponse(
        json.dumps(data),
        content_type="application/json")


@csrf_exempt
def TeamFeatureUpdate(request, feature):
    data = {"success": False}

    if request.method == "POST":
        feature_text = request.POST.get('feature_text')
        if feature_text:
            obj = TeamFeature.objects.filter(FeatureCode=feature).first()
            if obj:
                TeamFeatureLog.objects.create(Feature_Old=obj.Feature, Feature_New=feature_text,
                                              FeatureCode=obj.FeatureCode,
                                              ActionType=TeamFeatureLog.Edit)
                obj.Feature = feature_text
                obj.save()
                data["success"] = True

    return HttpResponse(
        json.dumps(data),
        content_type="application/json")


def show_404(request):
    context = {}
    return render(request, 'TeamFeature/404.html', context)

@permission_control
def PerpareData(request):
    context = {}

    token = find_token(request)
    username = get_token_data(token, "username")


    # Previous authenticate
    # if request.user.is_authenticated:
    #     username = request.user.UserName
    # else:
    #
    #     return redirect('/error/404')

    if not username:
        return redirect('/error/404')

    res_corp = requests.get("http://192.168.20.81:17000/EIT/api/get-corp/")
    obj_corp = res_corp.json().get('data')

    obj_feature = ''
    team = ''
    obj_teams = []
    has_more_than_one_team = False
    # when current user has more than one team,
    # we show them into combo, and when (s)he changes combo, page would be post back
    # in postback time, we send team code in POST method
    if request.method == "POST":
        if 'team_selected' in request.POST:
            team = request.POST.get('team_selected')

    if request.user.groups.filter(name='AllTeam').exists():
        res_team = requests.get(f"http://192.168.20.81:14000/HR/api/all-team-service/")
        obj_team = res_team.json().get('data')
    else:
        res_team = requests.get(f"http://192.168.20.81:14000/HR/api/get-user-team-role/{username}/")
        obj_team = res_team.json().get('data')

    # we just need team code
    for item in obj_team:
        obj_teams.append({"TeamCode": item.get('TeamCode'), "TeamName": item.get('TeamName')})

    if len(obj_team) > 1:
        has_more_than_one_team = True

    # at first time, first user team, is the team that we want to filter feature base on it
    if team == '':
        team = obj_teams[0]["TeamCode"]

    # get all feature for this team
    obj_feature = TeamFeature.objects.filter(TeamCode=team).order_by("FeaturePriority")

    # get all feature corp of this team
    team_corp_feature_all = TeamCorpFeature.objects.filter(FeatureCode__FeatureCode__contains=team).only("CorpCode",
                                                                                                         "YearNumber",
                                                                                                         "FeatureCode")
    # create a dict like this : {"ASI-CAR0057":"1400"}
    # this is for search speed
    team_corp_feature_all_list = {}
    for item in team_corp_feature_all:
        data = f"{item.CorpCode}-{item.FeatureCode_id}"
        team_corp_feature_all_list.update({data: str(item.YearNumber)})
    context.update(
        {
            "obj_team": obj_teams,
            'username': username,
            'has_more_than_one_team': has_more_than_one_team,
            'obj_corp': obj_corp,
            'obj_feature': obj_feature,
            'team_corp_feature_all_list': team_corp_feature_all_list,
            'team': team,
            'token': token,

        })
    return context

@permission_control
def TeamFeature_CorpView(request):
    # get corp info

    context = PerpareData(request)
    obj_corp = context['obj_corp']
    obj_feature = context['obj_feature']
    team_corp_feature_all_list = context['team_corp_feature_all_list']

    # for each feature of this team we add corp to active or inactive list
    team_corp_feature_list = []

    for corp in obj_corp:
        corp_info = {"corp_name": corp["CorpName"],
                     "corp_code": corp['CorpCode'], "active_feature": [], "inactive_feature": [],
                     "inactive_feature_count": 0, "active_feature_count": 0}

        for feature in obj_feature:
            feature_info = {"title": feature.Feature, "code": feature.FeatureCode, "year_number": feature.YearNumber}
            key = corp['CorpCode'] + '-' + feature.FeatureCode
            if key in team_corp_feature_all_list.keys():
                feature_info['year_number'] = team_corp_feature_all_list.get(key)
                corp_info["active_feature"].append(feature_info)
            else:
                corp_info["inactive_feature"].append(feature_info)

        # count active corp
        corp_info["active_feature_count"] = len(corp_info["active_feature"])
        # count inactive corp
        corp_info["inactive_feature_count"] = len(corp_info["inactive_feature"])
        # add new record to list
        team_corp_feature_list.append(corp_info)

    context.update(
        {
            'team_corp_feature_list': team_corp_feature_list,
            'view': 'corp'
        })
    return render(request, 'TeamFeature/corp_view.html', context)

@permission_control
def TeamFeature_FeatureView(request):
    # res_corp = requests.get("http://192.168.20.81:17000/EIT/api/get-corp/")
    # obj_corp = res_corp.json().get('data')
    context = PerpareData(request)
    obj_corp = context['obj_corp']
    obj_feature = context['obj_feature']
    team_corp_feature_all_list = context['team_corp_feature_all_list']

    # for each feature of this team we add corp to active or inactive list
    team_corp_feature_list = []

    # for each feature of this team we add corp to active or inactive list
    for feature in obj_feature:
        feature_info = {"title": feature.Feature, "year_number": feature.YearNumber, "importance": feature.Importance,
                        "feature_code": feature.FeatureCode, "active_corp": [], "inactive_corp": [],
                        "inactive_corp_count": 0, "active_corp_count": 0}

        for corp in obj_corp:
            corp_info = {"title": corp["CorpName"], "code": corp["CorpCode"], "year_number": 0}
            key = corp["CorpCode"] + '-' + feature.FeatureCode
            if key in team_corp_feature_all_list.keys():
                corp_info['year_number'] = team_corp_feature_all_list.get(key)
                feature_info["active_corp"].append(corp_info)
            else:
                feature_info["inactive_corp"].append(corp_info)

        # count active corp
        feature_info["active_corp_count"] = len(feature_info["active_corp"])
        # count inactive corp
        feature_info["inactive_corp_count"] = len(feature_info["inactive_corp"])
        # add new record to list
        team_corp_feature_list.append(feature_info)

    context.update(
        {
            'team_corp_feature_list': team_corp_feature_list,
            'view': 'feature',
        })

    return render(request, 'TeamFeature/feature_view.html', context)



