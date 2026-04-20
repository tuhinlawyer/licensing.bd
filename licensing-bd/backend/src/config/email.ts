import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@licensing.bd';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    await sgMail.send({
      to: options.to,
      from: FROM_EMAIL,
      subject: options.subject,
      html: options.html,
      text: options.text
    });
    
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error };
  }
};

// Template-based email sending
export const sendTemplateEmail = async (
  to: string,
  templateId: string,
  dynamicData: Record<string, any>
) => {
  try {
    await sgMail.send({
      to,
      from: FROM_EMAIL,
      templateId,
      dynamicTemplateData: dynamicData
    });
    
    return { success: true };
  } catch (error) {
    console.error('SendGrid template error:', error);
    return { success: false, error };
  }
};

export default sgMail;
