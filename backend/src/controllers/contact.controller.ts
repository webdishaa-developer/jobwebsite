import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';
import { sendEmail, contactConfirmationEmail } from '../utils/email';

export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return next(new AppError('Name, email, subject and message are required', 400));
    }

    const contact = await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    });

    // Send emails (non-blocking)
    Promise.all([
      sendEmail({
        to: email,
        subject: 'Thank you for contacting Recluta',
        html: contactConfirmationEmail(name),
      }),
      sendEmail({
        to: ['info@reclutasolutions.in', 'hemanand.saha@gmail.com'],
        subject: `New Contact: ${subject} - ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;">
            <h2>New Contact Message</h2>
            <table style="border-collapse:collapse;width:100%;">
              <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd;">${email}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd;">${phone || 'N/A'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Subject</strong></td><td style="padding:8px;border:1px solid #ddd;">${subject}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd;">${message}</td></tr>
            </table>
          </div>
        `,
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

    res.json({ success: true, data: messages, pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } });
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
