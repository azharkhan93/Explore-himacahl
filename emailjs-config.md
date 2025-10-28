# EmailJS Configuration Guide

This guide will help you set up EmailJS to make the contact form functional.

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the setup instructions
5. **Copy the Service ID** - you'll need this later

## Step 3: Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: New Trip Inquiry from {{from_name}}

Hello {{to_name}},

You have received a new trip inquiry:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Trip Details:
{{message}}

Best regards,
Website Contact Form
```

4. **Copy the Template ID** - you'll need this later

## Step 4: Get Public Key

1. Go to "Account" → "General"
2. Find your **Public Key** (User ID)
3. Copy this key

## Step 5: Update Configuration

Open `/js/main.js` and update these lines at the top:

```javascript
// EmailJS Configuration
const EMAILJS_SERVICE_ID = "your_service_id_here"; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = "your_template_id_here"; // Replace with your Template ID  
const EMAILJS_PUBLIC_KEY = "your_public_key_here"; // Replace with your Public Key
```

## Step 6: Test the Form

1. Open your website in a browser
2. Fill out the contact form
3. Submit it
4. Check your email to see if you received the message
5. Check the browser console for any errors

## Troubleshooting

### Common Issues:

1. **Emails not sending:**
   - Check if all IDs are correctly copied
   - Verify email service is properly connected
   - Check browser console for error messages

2. **Form validation errors:**
   - Ensure all required fields are filled
   - Check email format is valid
   - Verify phone number format

3. **EmailJS quota exceeded:**
   - Free accounts have limits (200 emails/month)
   - Consider upgrading for higher limits

### Form Features:

✅ **Real-time validation** - Fields are validated as you type
✅ **Loading states** - Shows "Sending..." while processing
✅ **Success/error messages** - Clear feedback to users
✅ **Auto-redirect** - Successful submissions go to thank you page
✅ **Form reset** - Form clears after successful submission
✅ **Mobile responsive** - Works on all device sizes

### Security:

- EmailJS handles email sending securely
- No server-side code required
- Form data is validated before sending
- Public key can be safely exposed (it's meant to be public)

## Support

If you need help:
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: Available in their dashboard

Your form is now fully functional and will send emails directly to your inbox!
