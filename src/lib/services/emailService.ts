// This is a placeholder for an email service client.
// In a real application, this would be a server-side function (e.g., Cloud Function)
// that uses a library like 'nodemailer' to send emails.

export class EmailService {
  static async sendTransactionalEmail(
    to: string,
    subject: string,
    htmlBody: string,
    textBody: string
  ) {
    console.log(`[EmailService] Simulating sending email to: ${to}`);
    console.log(`[EmailService] Subject: ${subject}`);
    // In a real app, you would use nodemailer or a transactional email API
    // like Resend, SendGrid, etc.

    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ from, to, subject, html, text });

    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`[EmailService] Email successfully simulated for ${to}`);
    return { success: true };
  }
}
