import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';
import slugify from '../utils/slugify';
import { JobStatus, Prisma } from '@prisma/client';

export const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '10',
      search,
      industry,
      jobType,
      workMode,
      location,
      status = 'ACTIVE',
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.JobWhereInput = {};

    if (status) where.status = status as JobStatus;
    if (industry) where.industry = industry;
    if (jobType) where.jobType = jobType as any;
    if (workMode) where.workMode = workMode as any;
    if (featured === 'true') where.isFeatured = true;

    if (location) {
      where.location = { contains: location };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
        { skills: { contains: search } },
        { industry: { contains: search } },
        { department: { contains: search } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          title: true,
          slug: true,
          company: true,
          location: true,
          jobType: true,
          workMode: true,
          industry: true,
          department: true,
          experienceMin: true,
          experienceMax: true,
          salaryMin: true,
          salaryMax: true,
          skills: true,
          openings: true,
          status: true,
          isFeatured: true,
          deadline: true,
          views: true,
          createdAt: true,
          _count: { select: { applications: true } },
        },
      }),
      prisma.job.count({ where }),
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const job = await prisma.job.findUnique({
      where: { slug },
    });

    if (!job) return next(new AppError('Job not found', 404));

    // Increment views
    await prisma.job.update({
      where: { id: job.id },
      data: { views: { increment: 1 } },
    });

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: { _count: { select: { applications: true } } },
    });

    if (!job) return next(new AppError('Job not found', 404));
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title, location, jobType, workMode, industry, department,
      experienceMin, experienceMax, salaryMin, salaryMax, description,
      requirements, responsibilities, benefits, skills, openings,
      status, isFeatured, deadline,
    } = req.body;

    const slug = await generateUniqueSlug(title + '-' + location);

    const job = await prisma.job.create({
      data: {
        title, slug, location, jobType, workMode, industry, department,
        experienceMin: parseInt(experienceMin), experienceMax: parseInt(experienceMax),
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        description, requirements, responsibilities, benefits,
        skills: Array.isArray(skills) ? skills.join(',') : skills,
        openings: parseInt(openings) || 1,
        status: status || 'ACTIVE',
        isFeatured: isFeatured === true || isFeatured === 'true',
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    res.status(201).json({ success: true, data: job, message: 'Job created successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existingJob = await prisma.job.findUnique({ where: { id } });
    if (!existingJob) return next(new AppError('Job not found', 404));

    const updateData: any = { ...req.body };
    if (req.body.skills && Array.isArray(req.body.skills)) {
      updateData.skills = req.body.skills.join(',');
    }
    if (req.body.experienceMin) updateData.experienceMin = parseInt(req.body.experienceMin);
    if (req.body.experienceMax) updateData.experienceMax = parseInt(req.body.experienceMax);
    if (req.body.salaryMin) updateData.salaryMin = parseInt(req.body.salaryMin);
    if (req.body.salaryMax) updateData.salaryMax = parseInt(req.body.salaryMax);
    if (req.body.openings) updateData.openings = parseInt(req.body.openings);
    if (req.body.deadline) updateData.deadline = new Date(req.body.deadline);

    const job = await prisma.job.update({ where: { id }, data: updateData });
    res.json({ success: true, data: job, message: 'Job updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return next(new AppError('Job not found', 404));

    await prisma.job.delete({ where: { id } });
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getJobStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalJobs, activeJobs, totalApplications, featuredJobs] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: 'ACTIVE' } }),
      prisma.application.count(),
      prisma.job.count({ where: { isFeatured: true } }),
    ]);

    const industryStats = await prisma.job.groupBy({
      by: ['industry'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    res.json({
      success: true,
      data: { totalJobs, activeJobs, totalApplications, featuredJobs, industryStats },
    });
  } catch (error) {
    next(error);
  }
};

async function generateUniqueSlug(text: string): Promise<string> {
  let slug = slugify(text);
  let count = 0;
  
  while (true) {
    const existing = await prisma.job.findUnique({ where: { slug: count === 0 ? slug : `${slug}-${count}` } });
    if (!existing) return count === 0 ? slug : `${slug}-${count}`;
    count++;
  }
}
