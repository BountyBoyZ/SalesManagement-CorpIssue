from django.db import models

# Create your models here.
from django_middleware_global_request.middleware import get_request


class AbstractDateTime(models.Model):
    class Meta:
        abstract = True

    CreatorUserName = models.CharField(max_length=150, verbose_name="ایجاد شده توسط",
                                       null=True)
    LastModifierUserName = models.CharField(max_length=150, verbose_name="ویرایش شده توسط"
                                            , null=True)
    CreateDate = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد", null=True)
    ModifyDate = models.DateTimeField(auto_now=True, verbose_name="تاریخ ویرایش", null=True)

    def save(self, *args, **kwargs):
        request = get_request()
        if request.user and request.user.is_authenticated:
            username = request.user.username
        else:
            username = None

        if self._state.adding:
            # insert new data
            self.CreatorUserName_id = username
        else:
            # update data
            self.ModifierUserName_id = username

        super().save(*args, **kwargs)


class TeamFeatureLog(AbstractDateTime):
    Feature_Old = models.CharField(max_length=1000, verbose_name="مقدار قدیمی قابلیت", null=True, blank=True)
    Feature_New = models.CharField(max_length=1000, verbose_name="مقدار جدید قابلیت", null=True, blank=True)
    FeatureCode = models.CharField(max_length=10, blank=True, verbose_name="کد ویژگی")
    Delete = 'D'
    Edit = 'E'
    Add = 'A'
    ActionType_Choices = ((Delete, 'حذف'), (Edit, 'ویرایش'), (Add, 'افزودن'))
    ActionType = models.CharField(max_length=1, choices=ActionType_Choices, verbose_name='نوع عملیات')


class TeamFeature(AbstractDateTime):
    Feature = models.CharField(max_length=1000, verbose_name="قابلیت")
    FeatureCode = models.CharField(max_length=10, blank=True, verbose_name="کد ویژگی", primary_key=True)
    TeamCode = models.CharField(max_length=3, verbose_name="نام تیم")
    YearNumber = models.PositiveSmallIntegerField(verbose_name="سال")
    FeaturePriority = models.PositiveSmallIntegerField(verbose_name="اولویت ویژگی")
    Importance_Normal = 1
    Importance_High = 2
    Importance_VeryHigh = 3
    Importance_Choices = (('متوسط', Importance_Normal), ('بالا', Importance_High), ('خیلی بالا', Importance_VeryHigh))
    Importance = models.PositiveSmallIntegerField(choices=Importance_Choices, default=Importance_Normal,
                                                  verbose_name="میزان اهمیت",null=True)

    class Meta:
        verbose_name = "قابلیت مهم سیستم"
        verbose_name_plural = "قابلیت های مهم سیستم"
        ordering = ['-CreateDate']

    def __str__(self):
        return self.Feature

    def get_pk(self):
        return self.pk

    def get_cls_name(self):
        return self.__class__.__name__

    @property
    def TeamName(self):
        return self.TeamCode.TeamName


class TeamCorpFeature(AbstractDateTime):
    class Meta:
        verbose_name = "قابلیت تیم شرکت"
        verbose_name_plural = "قابلیت های تیم ها و شرکت ها "

    CorpCode = models.CharField(max_length=3, verbose_name="نام شرکت")
    YearNumber = models.PositiveSmallIntegerField(verbose_name="سال")
    FeatureCode = models.ForeignKey('TeamFeature', verbose_name='قابلیت', on_delete=models.CASCADE,
                                    related_name='TeamCorpFeatureFeatureCode')

