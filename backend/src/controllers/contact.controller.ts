import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, subject and message are required' });
    }

    // Save to DB
    const contact = await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    });

    // Send emails (non-blocking)
    Promise.all([
      // Email to YOU
      transporter.sendMail({
        from: `"Recluta Website" <${process.env.GMAIL_USER}>`,
        to: 'contact.rtmpl@gmail.com',
        replyTo: email,
        subject: `New Contact: ${subject} — ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:linear-gradient(135deg,#0a1628,#1a3a6b);padding:24px 28px;border-radius:10px 10px 0 0">
              <h2 style="color:white;margin:0;font-size:20px">RECLUTA — New Contact Message</h2>
            </div>
            <div style="background:#f8faff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:28px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;width:120px">Name</td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#1e293b">${name}</td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b">Email</td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#1e293b"><a href="mailto:${email}" style="color:#2563eb">${email}</a></td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b">Phone</td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#1e293b">${phone || 'Not provided'}</td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b">Subject</td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#1e293b">${subject}</td></tr>
                <tr><td style="padding:16px 0 0;font-size:13px;color:#64748b;vertical-align:top">Message</td><td style="padding:16px 0 0;font-size:14px;color:#374151;line-height:1.7">${message.replace(/\n/g, '<br>')}</td></tr>
              </table>
              <div style="margin-top:24px">
                <a href="mailto:${email}?subject=Re: ${subject}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#3b82f6);color:white;padding:10px 22px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700">Reply to ${name} →</a>
              </div>
            </div>
          </div>`,
      }),

      // Confirmation to sender
      transporter.sendMail({
        from: `"Recluta Talent Management" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `We received your message — Recluta Talent Management`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:linear-gradient(135deg,#0a1628,#1a3a6b);padding:36px 28px;border-radius:10px 10px 0 0;text-align:center">
              <div style="font-size:44px;margin-bottom:12px">✅</div>
              <h1 style="color:white;margin:0;font-size:24px;font-weight:800">RECLUTA</h1>
              <p style="color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:4px 0 0">Talent Management</p>
            </div>
            <div style="background:white;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:36px 28px;text-align:center">
              <h2 style="color:#0a1628;font-size:22px;margin:0 0 12px">Thank you, ${name}!</h2>
              <p style="color:#64748b;font-size:15px;line-height:1.7;max-width:400px;margin:0 auto 24px">We've received your message about <strong>${subject}</strong> and will get back to you within 24 hours.</p>
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 20px;max-width:380px;margin:0 auto 28px;font-size:14px;color:#1e40af;font-weight:500">
                📬 Your message is in our inbox and being reviewed.
              </div>
              <div style="font-size:13px;color:#64748b">
                📞 <a href="tel:+919522299615" style="color:#2563eb;text-decoration:none">+91 95222 99615</a> &nbsp;·&nbsp;
                📞 <a href="tel:+917714906561" style="color:#2563eb;text-decoration:none">+91 77149 06561</a><br>
                📧 <a href="mailto:info@reclutasolutions.in" style="color:#2563eb;text-decoration:none">info@reclutasolutions.in</a><br>
                <span style="color:#94a3b8;font-size:12px;margin-top:6px;display:block">Mon–Sat · 9:00 AM – 7:00 PM IST</span>
              </div>
            </div>
            <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:16px">
              © ${new Date().getFullYear()} Recluta Talent Management Pvt Ltd · CIN: U93090CT2020PTC010332<br>
              1st Floor, Kuldeep Bhavan, Fafadih, Raipur (C.G.) 492001
            </p>
          </div>`,
      }),
    ]).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent. We will get back to you shortly.',
      data: { id: contact.id },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status } = req.query as Record<string, string>;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const where: any = {};
    if (status) where.status = status;

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where, skip: (pageNum - 1) * limitNum, take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count({ where }),
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMessageStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const message = await prisma.contactMessage.update({ where: { id }, data: { status } });
    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};