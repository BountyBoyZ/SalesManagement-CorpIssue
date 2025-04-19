from django.db import models
from .validator import national_code_validator, positive_number_validator
class Corp(models.Model):
    """sync with database job"""
    corp_code = models.CharField(
        max_length=3,
        primary_key=True,
        verbose_name='کد شرکت',
        help_text='کد منحصر به فرد شرکت را وارد کنید.'
    )
    corp_name = models.CharField(
        max_length=50,
        verbose_name='نام شرکت',
        help_text='نام شرکت را وارد کنید.'
    )

    def __str__(self):
        return self.corp_name

    class Meta:
        verbose_name = 'شرکت'
        verbose_name_plural = 'شرکت‌ها'


class Team(models.Model):
    """sync with database job"""
    team_code = models.CharField(
        max_length=3,
        primary_key=True,
        verbose_name='کد تیم',
        help_text='کد منحصر به فرد تیم را وارد کنید.'
    )
    team_name = models.CharField(
        max_length=50,
        verbose_name='نام تیم',
        help_text='نام تیم را وارد کنید.'
    )
    manager = models.CharField(
        max_length=50,
        verbose_name='کد ملی مدیر',
        help_text='کد ملی مدیر تیم را وارد کنید.',
        validators=[national_code_validator]
    )

    def __str__(self):
        return self.team_name

    class Meta:
        verbose_name = 'تیم'
        verbose_name_plural = 'تیم‌ها'


class Version(models.Model):
    """sync with database job
        we have no idea where is the source

        PM datawarehouse has it (maybe):
        ReleaseVersionSHBTasks table in PM (ReleaseVersionNumber field)
    """
    version_number = models.CharField(
        max_length=50,
        primary_key=True,
        verbose_name='شماره نسخه',
        help_text='شماره نسخه را وارد کنید.'
    )

    def __str__(self):
        return self.version_number

    class Meta:
        verbose_name = 'نسخه'
        verbose_name_plural = 'نسخه‌ها'



class ConstValue(models.Model):
    code = models.CharField(
        max_length=50,
        verbose_name='کد مقدار ثابت',
        help_text='کد مقدار ثابت را وارد کنید.'
    )
    value = models.CharField(
        max_length=50,
        verbose_name='مقدار ثابت',
        help_text='مقدار ثابت را وارد کنید.'
    )
    parent_code = models.ForeignKey(
        "ConstValue",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='کد والد',
        help_text='کد والد را وارد کنید.'
    )

    def __str__(self):
        return self.value

    class Meta:
        verbose_name = 'مقدار ثابت'
        verbose_name_plural = 'مقادیر ثابت'

    def get_const_value_by_code(self, code: str) -> "ConstValue":
        return ConstValue.objects.get(code=code)

class Invoice(models.Model):
    corp_code = models.ForeignKey(
        Corp,
        null=True,
        on_delete=models.CASCADE,
        db_column='corp_code',
        verbose_name='کد شرکت',
        help_text='کد شرکت مربوط به این صورت حساب را وارد کنید.'
    )
    version_number = models.ForeignKey(
        Version,
        null=True,
        on_delete=models.CASCADE,
        db_column='version_number',
        verbose_name='شماره نسخه',
        help_text='شماره نسخه مربوط به این صورت حساب را وارد کنید.'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='آخرین به‌روزرسانی'
    )
    
    # using const value (open, closed, sent)
    status = models.ForeignKey(
        ConstValue,
        on_delete=models.CASCADE,
        verbose_name='وضعیت',
        help_text='وضعیت صورت حساب را انتخاب کنید.'
    )  #using const value 

    # all dates can be changed by sales manager
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='تاریخ ایجاد'
    )
    send_at = models.DateField(
        null=True,
        verbose_name='تاریخ ارسال'
    )
    closed_at = models.DateField(
        null=True,
        verbose_name='تاریخ بسته شدن'
    )
    doc_id = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        verbose_name='شناسه سند',
        help_text='شناسه سند مربوط به این صورت حساب را وارد کنید.'
    )

    def __str__(self):
        return f"{self.corp_code} {self.version_number} {self.doc_id}"

    class Meta:
        verbose_name = 'صورت حساب'
        verbose_name_plural = 'صورت حساب‌ها'

class InvoiceExcel(models.Model):
    """Track Excel file versions"""
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        verbose_name='صورت حساب',
        related_name='excel_versions'
    )
    upload_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name='تاریخ آپلود'
    )
    file_path = models.CharField(
        max_length=255,
        verbose_name='مسیر فایل'
    )

    class Meta:
        verbose_name = 'نسخه اکسل'
        verbose_name_plural = 'نسخه های اکسل'

class Project(models.Model):
    project_name = models.CharField(
        max_length=50,
        verbose_name='نام پروژه',
        help_text='نام پروژه را وارد کنید.'
    )
    team_code = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        db_column='team_code',
        null=True,
        verbose_name='کد تیم',
        help_text='کد تیم مربوط به این پروژه را وارد کنید.'
    )

    def __str__(self):
        return self.project_name

    class Meta:
        verbose_name = 'پروژه'
        verbose_name_plural = 'پروژه‌ها'



class Task(models.Model):
    task_id = models.BigIntegerField(
        primary_key=True,
        verbose_name='شناسه تسک',
        help_text='شناسه تسک را وارد کنید.'
    )
    task_title = models.CharField(
        max_length=300,
        verbose_name='عنوان تسک',
        help_text='عنوان تسک را وارد کنید.'
    )
    task_kind = models.ForeignKey(
        ConstValue,
        on_delete=models.CASCADE,
        verbose_name='نوع تسک',
        help_text='نوع تسک را انتخاب کنید.'
    )
    real_work_hours = models.IntegerField(
        null=True,
        verbose_name='ساعات کار واقعی',
        help_text='ساعات کار واقعی را وارد کنید.',
        validators=[positive_number_validator]
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        verbose_name='پروژه',
        help_text='پروژه مربوط به این تسک را انتخاب کنید.'
    )
    parent_task = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sub_tasks",
        verbose_name='تسک والد',
        help_text='تسک والد را انتخاب کنید.'
    )

    @property
    def real_work_hours_display(self):
        """Convert real_work_hours to hour:minutes format."""
        if self.real_work_hours is not None:
            hours = int(self.real_work_hours)
            minutes = int((self.real_work_hours - hours) * 60)
            return f"{hours}:{minutes:02d}"
        return "0:00"

    def __str__(self):
        return self.task_title

    class Meta:
        verbose_name = 'تسک'
        verbose_name_plural = 'تسک‌ها'


class InvoiceTask(models.Model):
    """the updatest version of task data is here"""
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        verbose_name='صورت حساب',
        help_text='صورت حساب مربوط به این تسک را انتخاب کنید.'
    )
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        verbose_name='تسک',
        help_text='تسک مربوط به این صورت حساب را انتخاب کنید.'
    )
    invoice_work_hours = models.IntegerField(
        verbose_name='ساعات کار اعلامی',
        help_text='ساعات کار اعلامی را وارد کنید.',
        validators=[positive_number_validator]
    )
   


    # if true, hide it in qalati step (both of them)
    # is_approved = models.BooleanField(default=False)
    # is_rejected = models.BooleanField(default=False)
    # is_deleted = models.BooleanField(default=False)
    status = models.ForeignKey(
        ConstValue,
        on_delete=models.CASCADE,
        verbose_name='وضعیت',
        help_text='وضعیت تسک را انتخاب کنید.'
    )

    @property
    def invoice_work_hours_display(self):
        """Convert invoice_work_hours to hour:minutes format."""
        if self.invoice_work_hours is not None:
            hours = int(self.invoice_work_hours)
            minutes = int((self.invoice_work_hours - hours) * 60)
            return f"{hours}:{minutes:02d}"
        return "0:00"

    class Meta:
        verbose_name = 'تسک صورت حساب'
        verbose_name_plural = 'تسک‌های صورت حساب' #using const value 


class InvoiceTaskHistory(models.Model):
    invoice_task = models.ForeignKey(
        InvoiceTask,
        on_delete=models.CASCADE,
        verbose_name='تسک صورت حساب',
        help_text='تسک صورت حساب مربوط به این تاریخچه را انتخاب کنید.'
    )
    
    # theses might be changed to status
    # is_approved = models.BooleanField(default=False)
    # is_rejected = models.BooleanField(default=False)
    # is_deleted = models.BooleanField(default=False)
    # is_resend = models.BooleanField(default=False)
    # is_modified = models.BooleanField(default=False)
    # is_created = models.BooleanField(default=False)
    status = models.ForeignKey(
        ConstValue,
        on_delete=models.CASCADE,
        verbose_name='وضعیت',
        help_text='وضعیت تاریخچه را انتخاب کنید.'
    )  #using const value 

    doc_id = models.CharField(
        max_length=50,
        null=True,
        verbose_name='شناسه سند',
        help_text='شناسه سند مربوط به این تاریخچه را وارد کنید.'
    ) # no need to doc flow id!?  #changed null true
    


    work_hours = models.IntegerField(
        verbose_name='ساعات کار',
        help_text='ساعات کار را وارد کنید.',
        validators=[positive_number_validator]
    )
    comment = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        verbose_name='توضیحات',
        help_text='توضیحات مربوط به این تاریخچه را وارد کنید.'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='تاریخ ایجاد'
    )
    created_by = models.CharField(
        max_length=50,
        verbose_name='ایجاد شده توسط',
        help_text='کد ملی ایجادکننده را وارد کنید.'
    )

    @property
    def work_hours_display(self):
        """Convert work_hours to hour:minutes format."""
        if self.work_hours is not None:
            hours = int(self.work_hours)
            minutes = int((self.work_hours - hours) * 60)
            return f"{hours}:{minutes:02d}"
        return "0:00"

    class Meta:
        verbose_name = 'تاریخچه تسک صورت حساب'
        verbose_name_plural = 'تاریخچه‌های تسک صورت حساب' # National Code or DB JOB

class Setting(models.Model):

    # both must be national code
    invoice_approver = models.CharField(
        max_length=50,
        verbose_name='تاییدکننده صورت حساب',
        help_text='کد ملی تاییدکننده صورت حساب را وارد کنید.',
        validators=[national_code_validator]
    )
    sales_manager = models.CharField(
        max_length=50,
        verbose_name='مدیر فروش',
        help_text='کد ملی مدیر فروش را وارد کنید.',
        validators=[national_code_validator]
    )
    
    # setting dates is valid for all these dates
    from_date = models.DateField(
        auto_now_add=True,
        verbose_name='تاریخ شروع'
    )
    to_date = models.DateField(
        null=True,
        verbose_name='تاریخ پایان'
    )
    
    # if true, you dint have ti look for others record based on validation dates 
    is_active = models.BooleanField(
        default=False,
        verbose_name='فعال است؟'
    )

    class Meta:
        verbose_name = 'تنظیمات'
        verbose_name_plural = 'تنظیمات'



class PMSHBTask(models.Model):
    """must be created for mock"""
    class Meta:
        managed = False


class RejectionDetails(models.Model):
    """Stores the rejection explanations for ConstValue records"""
    const_value = models.ForeignKey(
        ConstValue,null=True,
        on_delete=models.CASCADE,
        related_name='rejection_explanations',
        verbose_name='مقدار ثابت',
        help_text='مقدار ثابت مربوط به این توضیحات رد را انتخاب کنید.'
    )
    invoice_task = models.ForeignKey(
        InvoiceTask,
        on_delete=models.CASCADE,
        related_name='rejection_explanations',
        verbose_name='تسک صورت حساب',
        help_text='تسک صورت حساب مربوط به این توضیحات رد را انتخاب کنید.'
    )
    explanation = models.TextField(
        verbose_name='توضیحات',
        help_text='توضیحات ارائه شده توسط دستیار محصول برای رد.'
    )
    rejected_by = models.CharField(
        max_length=50,
        default='product_assistant',
        verbose_name='رد شده توسط',
        help_text='کد ملی فردی که توضیحات رد را ارائه کرده است.',
        validators=[national_code_validator]
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='تاریخ ایجاد',
        help_text='تاریخ ایجاد این توضیحات رد.'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='تاریخ به‌روزرسانی',
        help_text='تاریخ آخرین به‌روزرسانی این توضیحات رد.'
    )
    created_by = models.CharField(
        max_length=50,
        verbose_name='ایجاد شده توسط',
        help_text='کد ملی فردی که این توضیحات رد را ایجاد کرده است.',
        validators=[national_code_validator]
    )

    def __str__(self):
        return f"توضیحات رد برای {self.const_value.value} (تسک: {self.invoice_task.task.task_title})"

    class Meta:
        verbose_name = 'توضیحات رد'
        verbose_name_plural = 'توضیحات رد'




