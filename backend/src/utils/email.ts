import nodemailer from 'nodemailer';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string[];
  bcc?: string[];
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Recluta Talent Management'}" <${process.env.EMAIL_FROM}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
    });
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw error;
  }
}

export function applicationConfirmationEmail(data: {
  applicantName: string;
  jobTitle: string;
  company: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7ff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #0a1628 0%, #1a3a6b 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .header p { color: #06b6d4; margin: 5px 0 0; font-size: 14px; }
        .body { padding: 40px 30px; }
        .body h2 { color: #0a1628; }
        .highlight { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px 20px; margin: 20px 0; border-radius: 4px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #1a3a6b, #0ea5e9); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f4f7ff; padding: 20px 30px; text-align: center; color: #64748b; font-size: 12px; }
        .contact-info { margin-top: 15px; color: #374151; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>RECLUTA</h1>
          <p>TALENT MANAGEMENT PRIVATE LIMITED</p>
        </div>
        <div class="body">
          <h2>Application Received Successfully! 🎉</h2>
          <p>Dear ${data.applicantName},</p>
          <p>Thank you for applying to <strong>${data.jobTitle}</strong> at ${data.company} through Recluta Talent Management.</p>
          <div class="highlight">
            <strong>Your application has been received</strong><br>
            Our team will review your profile and get back to you within 3-5 business days.
          </div>
          <p>What happens next:</p>
          <ul>
            <li>Our recruitment team will review your application</li>
            <li>If shortlisted, we'll contact you for an initial screening call</li>
            <li>Subsequent interview rounds will be coordinated with the hiring company</li>
            <li>We'll keep you updated at every stage</li>
          </ul>
          <p>In the meantime, feel free to explore more opportunities on our portal.</p>
          <div class="contact-info">
            <strong>For queries, contact us:</strong><br>
            📧 info@reclutasolutions.in<br>
            📞 +91 95222 99615
          </div>
        </div>
        <div class="footer">
          <p>© 2024 Recluta Talent Management Private Limited</p>
          <p>CIN: U93090CT2020PTC010332</p>
          <p>C/o Manohar Prasad Saha, Gali No.03 Bengali Para, Near Vedic Convent Sarkanda, Bilaspur, CG - 495001</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function newApplicationAdminEmail(data: {
  applicantName: string;
  email: string;
  phone: string;
  jobTitle: string;
  experience: number;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f7ff; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        .header { background: #0a1628; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        td:first-child { font-weight: bold; color: #374151; width: 40%; }
        .btn { background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 New Job Application Received</h2>
        </div>
        <p>A new application has been submitted through the Recluta portal.</p>
        <table>
          <tr><td>Applicant Name</td><td>${data.applicantName}</td></tr>
          <tr><td>Email</td><td>${data.email}</td></tr>
          <tr><td>Phone</td><td>${data.phone}</td></tr>
          <tr><td>Applied For</td><td>${data.jobTitle}</td></tr>
          <tr><td>Experience</td><td>${data.experience} years</td></tr>
        </table>
        <p><a href="${process.env.FRONTEND_URL}/admin/applicants" class="btn">View in Admin Panel</a></p>
      </div>
    </body>
    </html>
  `;
}

export function contactConfirmationEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f7ff; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #0a1628, #1a3a6b); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .body { padding: 30px; }
        .footer { background: #f4f7ff; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>RECLUTA</h1></div>
        <div class="body">
          <h2>Thank you for reaching out, ${name}!</h2>
          <p>We have received your message and our team will get back to you within 24 hours.</p>
          <p><strong>Contact Details:</strong><br>
          📧 info@reclutasolutions.in<br>
          📞 +91 95222 99615</p>
        </div>
        <div class="footer">© 2024 Recluta Talent Management Private Limited</div>
      </div>
    </body>
    </html>
  `;
}
