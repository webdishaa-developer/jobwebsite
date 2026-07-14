import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';
import { sendEmail, applicationConfirmationEmail, newApplicationAdminEmail } from '../utils/email';
import { ApplicationStatus, Prisma } from '@prisma/client';

export const createApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const file = req.file as Express.Multer.File & { path: string; filename: string };

    if (!file) return next(new AppError('Resume is required', 400));

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return next(new AppError('Job not found', 404));
    if (job.status !== 'ACTIVE') return next(new AppError('This job is no longer accepting applications', 400));

    const {
      firstName, lastName, email, phone, currentLocation,
      currentCompany, currentRole, totalExperience, noticePeriod,
      expectedSalary, currentSalary, coverLetter, linkedinUrl, portfolioUrl,
    } = req.body;

    // Check for duplicate application
    const existing = await prisma.application.findFirst({
      where: { jobId, email },
    });
    if (existing) return next(new AppError('You have already applied for this position', 400));

    const application = await prisma.application.create({
      data: {
        jobId,
        firstName, lastName, email, phone, currentLocation,
        currentCompany, currentRole,
        totalExperience: parseFloat(totalExperience),
        noticePeriod,
        expectedSalary: expectedSalary ? parseInt(expectedSalary) : null,
        currentSalary: currentSalary ? parseInt(currentSalary) : null,
        resumeUrl: (file as any).path || file.filename,
        resumePublicId: (file as any).filename,
        coverLetter, linkedinUrl, portfolioUrl,
      },
      include: { job: { select: { title: true, company: true } } },
    });

    // Send confirmation emails (non-blocking)
    Promise.all([
      sendEmail({
        to: email,
        subject: `Application Received - ${job.title}`,
        html: applicationConfirmationEmail({
          applicantName: `${firstName} ${lastName}`,
          jobTitle: job.title,
          company: job.company,
        }),
      }),
      sendEmail({
        to: [process.env.ADMIN_EMAIL || 'info@reclutasolutions.in', 'hemanand.saha@gmail.com'],
        subject: `New Application: ${job.title} - ${firstName} ${lastName}`,
        html: newApplicationAdminEmail({
          applicantName: `${firstName} ${lastName}`,
          email,
          phone,
          jobTitle: job.title,
          experience: parseFloat(totalExperience),
        }),
      }),
    ]).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { id: application.id },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '20',
      status,
      jobId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.ApplicationWhereInput = {};
    if (status) where.status = status as ApplicationStatus;
    if (jobId) where.jobId = jobId;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where, skip, take: limitNum,
        orderBy: { [sortBy]: sortOrder },
        include: {
          job: { select: { title: true, location: true, department: true } },
        },
      }),
      prisma.application.count({ where }),
    ]);

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: pageNum, limit: limitNum, total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });
    if (!application) return next(new AppError('Application not found', 404));
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes, interviewDate, rejectionReason } = req.body;

    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) return next(new AppError('Application not found', 404));

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status,
        notes,
        interviewDate: interviewDate ? new Date(interviewDate) : undefined,
        rejectionReason,
      },
      include: { job: { select: { title: true } } },
    });

    // Notify applicant on status change
    const notifyStatuses = ['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFERED', 'REJECTED'];
    if (notifyStatuses.includes(status)) {
      let emailSubject = '';
      let emailContent = '';
      
      if (status === 'SHORTLISTED') {
        emailSubject = `Congratulations! You've been shortlisted for ${updated.job.title}`;
        emailContent = `<p>Dear ${application.firstName},</p><p>Great news! You have been <strong>shortlisted</strong> for the position of <strong>${updated.job.title}</strong>. Our team will be in touch to schedule the next steps.</p>`;
      } else if (status === 'INTERVIEW_SCHEDULED') {
        emailSubject = `Interview Scheduled - ${updated.job.title}`;
        emailContent = `<p>Dear ${application.firstName},</p><p>Your interview has been scheduled for <strong>${interviewDate ? new Date(interviewDate).toLocaleDateString() : 'a date to be confirmed'}</strong> for the position of <strong>${updated.job.title}</strong>.</p>`;
      } else if (status === 'OFFERED') {
        emailSubject = `Offer Extended - ${updated.job.title}`;
        emailContent = `<p>Dear ${application.firstName},</p><p>Congratulations! We are pleased to extend an offer for the position of <strong>${updated.job.title}</strong>. Please contact us to discuss the details.</p>`;
      } else if (status === 'REJECTED') {
        emailSubject = `Application Update - ${updated.job.title}`;
        emailContent = `<p>Dear ${application.firstName},</p><p>Thank you for applying for <strong>${updated.job.title}</strong>. After careful consideration, we will not be moving forward with your application at this time. We wish you the best in your job search.</p>`;
      }

      sendEmail({
        to: application.email,
        subject: emailSubject,
        html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;padding:20px;">${emailContent}<p>Regards,<br>Recluta Talent Management Team</p></body></html>`,
      }).catch(console.error);
    }

    res.json({ success: true, data: updated, message: 'Application status updated' });
  } catch (error) {
    next(error);
  }
};

export const getApplicationStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await prisma.application.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const total = await prisma.application.count();
    const thisMonth = await prisma.application.count({
      where: {
        createdAt: { gte: new Date(new Date().setDate(1)) },
      },
    });

    res.json({
      success: true,
      data: { stats, total, thisMonth },
    });
  } catch (error) {
    next(error);
  }
};
