from django.core.exceptions import ValidationError
import re

def national_code_validator(value):
    """Validate Iranian national code."""
    if not re.match(r'^\d{10}$', value):
        raise ValidationError('کد ملی باید ۱۰ رقم باشد.')
    check = int(value[9])
    s = sum(int(value[x]) * (10 - x) for x in range(9)) % 11
    if not ((s < 2 and check == s) or (s >= 2 and check + s == 11)):
        raise ValidationError('کد ملی وارد شده معتبر نیست.')

def phone_number_validator(value):
    """Validate Iranian phone number."""
    if not re.match(r'^09\d{9}$', value):
        raise ValidationError('شماره تلفن باید با ۰۹ شروع شده و ۱۱ رقم باشد.')

def postal_code_validator(value):
    """Validate Iranian postal code."""
    if not re.match(r'^\d{10}$', value):
        raise ValidationError('کد پستی باید ۱۰ رقم باشد.')

def positive_number_validator(value):
    """Ensure the value is a positive number."""
    if value <= 0:
        raise ValidationError('مقدار باید بزرگتر از صفر باشد.')

def validate_change_location_other(value):
    """Ensure description is provided if 'change_location_other' is True."""
    if not value:
        raise ValidationError('توضیحات محل تغییر الزامی است.')