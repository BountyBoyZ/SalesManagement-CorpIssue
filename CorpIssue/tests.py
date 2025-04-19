from django.test import TestCase, Client
from django.urls import reverse
from CorpIssue.models import Corp, Invoice, Version, ConstValue

class CorpIssueViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.corp = Corp.objects.create(corp_code='001', corp_name='Test Corp')
        self.version = Version.objects.create(version_number='001')
        self.status_open = ConstValue.objects.create(code='open', value='Open')
        self.status_closed = ConstValue.objects.create(code='closed', value='Closed')
        self.invoice_open = Invoice.objects.create(corp_code=self.corp, version_number=self.version, status=self.status_open)
        self.invoice_closed = Invoice.objects.create(corp_code=self.corp, version_number=self.version, status=self.status_closed)

    def test_corp_issue_view_with_open_invoice(self):
        response = self.client.get(reverse('corp_issue_view', args=[self.corp.corp_code]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Corp')
        self.assertContains(response, 'Open')

    def test_corp_issue_view_with_closed_invoice(self):
        self.invoice_open.delete()  # Ensure only the closed invoice is considered
        response = self.client.get(reverse('corp_issue_view', args=[self.corp.corp_code]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Corp')
        self.assertContains(response, 'Closed')

    def test_create_new_version(self):
        response = self.client.post(reverse('create_new_version', args=[self.corp.corp_code]))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Invoice.objects.filter(corp_code=self.corp, status=self.status_open).exists())


from django.test import TestCase
from CorpIssue.models import Corp, Invoice, Version, ConstValue

class CorpModelTests(TestCase):
    def test_corp_creation(self):
        corp = Corp.objects.create(corp_code='001', corp_name='Test Corp')
        self.assertEqual(corp.corp_name, 'Test Corp')

class InvoiceModelTests(TestCase):
    def setUp(self):
        self.corp = Corp.objects.create(corp_code='001', corp_name='Test Corp')
        self.version = Version.objects.create(version_number='001')
        self.status = ConstValue.objects.create(code='open', value='Open')

    def test_invoice_creation(self):
        invoice = Invoice.objects.create(corp_code=self.corp, version_number=self.version, status=self.status)
        self.assertEqual(invoice.corp_code.corp_name, 'Test Corp')
        self.assertEqual(invoice.status.value, 'Open')