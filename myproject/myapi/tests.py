from django.test import TestCase
from django.test import TestCase
from django.urls import reverse
from django.core import mail
from django.contrib.auth.models import User

# Create your tests here.

class PasswordResetTests(TestCase):

    def setUp(self):
        # Create a user to test the password reset
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpassword')

    def test_password_reset_page_loads(self):
        # password reset page loads successfully
        url = reverse('password_reset')  # use the name of the URL defined in urls.py
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)  # load page
        self.assertTemplateUsed(response, 'registration/password_reset_form.html')  

    def test_password_reset_email_sent(self):
        # password reset email is sent for a valid email
        url = reverse('password_reset')
        response = self.client.post(url, {'email': 'testuser@example.com'})
        self.assertEqual(response.status_code, 302) # good redirect
        self.assertEqual(len(mail.outbox), 1) # if an email was sent
        self.assertIn('testuser@example.com', mail.outbox[0].to) # email recipient verify
        self.assertIn('Reset your password for Palyoplot', mail.outbox[0].subject) # email subject verify

    def test_password_reset_invalid_email(self):
        # no email is sent for an invalid email address
        url = reverse('password_reset')
        response = self.client.post(url, {'email': 'invalid@example.com'})
        self.assertEqual(response.status_code, 302) # should still redirect
        self.assertEqual(len(mail.outbox), 0) # no email sent