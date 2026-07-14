import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalJobs, activeJobs, totalApplications, thisMonthApplications,
      lastMonthApplications, pendingApplications, shortlistedApplications,
      totalCandidates, totalTestimonials, unreadMessages,
      recentApplications, topJobs,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: 'ACTIVE' } }),
      prisma.application.count(),
      prisma.application.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.application.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.application.count({ where: { status: 'SHORTLISTED' } }),
      prisma.candidate.count(),
      prisma.testimonial.count(),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.application.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { job: { select: { title: true } } },
      }),
      prisma.job.findMany({
        take: 5,
        orderBy: { views: 'desc' },
        where: { status: 'ACTIVE' },
        select: {
          id: true, title: true, location: true, views: true,
          _count: { select: { applications: true } },
        },
      }),
    ]);

    // Applications trend by month (last 6 months)
    const applicationTrend = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return prisma.application.count({
          where: { createdAt: { gte: start, lte: end } },
        }).then(count => ({
          month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
          count,
        }));
      })
    );

    const applicationsByStatus = await prisma.application.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalJobs, activeJobs, totalApplications, thisMonthApplications,
          lastMonthApplications, pendingApplications, shortlistedApplications,
          totalCandidates, totalTestimonials, unreadMessages,
          applicationGrowth: lastMonthApplications > 0
            ? Math.round(((thisMonthApplications - lastMonthApplications) / lastMonthApplications) * 100)
            : 100,
        },
        recentApplications,
        topJobs,
        applicationTrend: applicationTrend.reverse(),
        applicationsByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};
