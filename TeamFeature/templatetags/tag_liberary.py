from django import template
from django import template
# from django.conf import settings

register = template.Library()

@register.filter(name="concat_str")
def concat_str(val1,val2):
    return val1 + ',' + val2

@register.filter(name="chek_feature_corp")
def chek_feature_corp(_dict,keys):
    arr = keys.split(',')
    feature_name = arr[0]
    corp_name = arr[1]
    ret = False
    if feature_name in _dict:
        if corp_name == _dict.get('feature_name').get('c'):
            ret = True

    return ret



