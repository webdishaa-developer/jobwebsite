'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Briefcase, Clock, ArrowRight, Bookmark, IndianRupee } from 'lucide-react';
import { jobsApi } from '@/lib/api';
import { Job } from '@/types';
import { formatSalaryRange, formatExperience, formatJobType, formatWorkMode, timeAgo, getJobTypeBadgeColor, getWorkModeBadgeColor, cn } from '@/lib/utils';

function JobCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton h-5 w-2/3 rounded" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-8 w-24 rounded-lg" />
    </div>
  );
}

function JobCard({ job, index }: { job: Job; index: number }) {
  const skills = job.skills.split(',').slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group glass-card rounded-2xl p-5 card-hover border border-gray-100 dark:border-navy-700 hover:border-royal-200 dark:hover:border-navy-600"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <Link href={`/jobs/${job.slug}`} className="font-display font-bold text-lg text-navy-950 dark:text-white hover:text-royal-600 dark:hover:text-cyan-400 transition-colors line-clamp-1">
            {job.title}
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{job.company}</div>
        </div>
        {job.isFeatured && (
          <span className="flex-shrink-0 badge bg-gradient-to-r from-royal-600 to-cyan-600 text-white text-xs shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Location & Department */}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-cyan-500" />
          {job.location}
        </div>
        <div className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-royal-500" />
          {job.department}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={cn('badge text-xs', getJobTypeBadgeColor(job.jobType))}>
          {formatJobType(job.jobType)}
        </span>
        <span className={cn('badge text-xs', getWorkModeBadgeColor(job.workMode))}>
          {formatWorkMode(job.workMode)}
        </span>
        <span className="badge bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-400 text-xs">
          {formatExperience(job.experienceMin, job.experienceMax)} exp
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {skills.map((skill) => (
          <span key={skill} className="text-xs px-2.5 py-0.5 rounded-full bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-gray-300 border border-navy-100 dark:border-navy-700">
            {skill.trim()}
          </span>
        ))}
        {job.skills.split(',').length > 3 && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-navy-800 text-gray-500">
            +{job.skills.split(',').length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-navy-700">
        <div className="flex items-center gap-1 text-sm font-semibold text-navy-950 dark:text-white">
          <IndianRupee className="w-3.5 h-3.5 text-green-500" />
          {formatSalaryRange(job.salaryMin, job.salaryMax)}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(job.createdAt)}
          </span>
          <Link
            href={`/jobs/${job.slug}`}
            className="text-xs font-semibold text-royal-600 dark:text-cyan-400 hover:text-royal-800 dark:hover:text-cyan-300 flex items-center gap-1 group/link"
          >
            Apply <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    jobsApi.getAll({ featured: 'true', limit: 6, status: 'ACTIVE' })
      .then((res) => setJobs(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section ref={ref} className="section-padding bg-gray-50 dark:bg-navy-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-2 font-mono">
              Latest Openings
            </span>
            <h2 className="font-display text-4xl font-bold text-navy-950 dark:text-white">
              Featured <span className="gradient-text">Jobs</span>
            </h2>
          </div>
          <Link href="/jobs" className="btn-secondary flex-shrink-0">
            View All Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
            : jobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)
          }
        </div>

        {!loading && jobs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No featured jobs available right now.</p>
          </div>
        )}
      </div>
    </section>
  );
}
