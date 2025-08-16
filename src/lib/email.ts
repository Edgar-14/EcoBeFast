/**
 * -----------------------------------------------------------------------------
 * Transactional Email Service
 * -----------------------------------------------------------------------------
 * This module provides a centralized function for sending transactional emails.
 * It is designed to be a wrapper around a third-party email service like Resend or SendGrid.
 *
 * In a real application, this function would:
 * 1. Take a templateId and a data object.
 * 2. Fetch the corresponding email template (e.g., from a file or a service).
 * 3. Render the template with the provided data.
 * 4. Send the email using the configured provider's API.
 * -----------------------------------------------------------------------------
 */

// Define types for the email data for better type-safety
interface WelcomeEmailData {
  name: string;
}

interface PasswordResetData {
  resetLink: string;
}

interface ApplicationApprovedData {
  name: string;
  loginLink: string;
}

type EmailData = WelcomeEmailData | PasswordResetData | ApplicationApprovedData;

type TemplateId = 'welcome_business' | 'password_reset' | 'driver_application_approved';

/**
 * Sends a transactional email.
 * @param to The recipient's email address.
 * @param templateId The ID of the email template to use.
 * @param data The dynamic data to inject into the template.
 */
export async function sendTransactionalEmail(
  to: string,
  templateId: TemplateId,
  data: EmailData
): Promise<{ success: boolean; message: string }> {

  console.log('--- Sending Transactional Email ---');
  console.log(`Recipient: ${to}`);
  console.log(`Template ID: ${templateId}`);
  console.log(`Data: ${JSON.stringify(data, null, 2)}`);
  console.log('------------------------------------');

  // This is a placeholder. In a real app, you would have the logic
  // to connect to your email provider (e.g., Resend) and send the email.
  if (!to || !templateId) {
    console.error('[Email Service] Missing recipient or template ID.');
    return { success: false, message: 'Missing required parameters.' };
  }

  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log(`[Email Service] Email sent successfully to ${to}.`);
  return { success: true, message: 'Email sent successfully (simulated).' };
}
