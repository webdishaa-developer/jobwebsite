'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { jobsApi } from '@/lib/api';
import { Job, JobFilters, PaginationMeta } from '@/types';
import { cn, formatSalaryRange, formatExperience, formatJobType, formatWorkMode, timeAgo, getJobTypeBadgeColor, getWorkModeBadgeColor } from '@/lib/utils';

const industries = ['Information Technology', 'Banking & Finance', 'Manufacturing', 'Healthcare', 'FMCG & Retail', 'Logistics', 'Oil & Energy', 'Education'];
const jobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'];
const workModes = ['ON_SITE', 'REMOTE', 'HYBRID'];

function JobCard({ job }: { job: Job }) {
  const skills = job.skills.split(',').slice(0, 4);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card rounded-2xl p-5 card-hover border border-transparent hover:border-royal-200 dark:hover:border-navy-600"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <Link href={`/jobs/${job.slug}`} className="font-display font-bold text-lg text-navy-950 dark:text-white hover:text-royal-600 dark:hover:text-cyan-400 transition-colors">
          {job.title}
        </Link>
        {job.isFeatured && <span className="badge bg-gradient-to-r from-royal-600 to-cyan-600 text-white text-xs flex-shrink-0">Featured</span>}
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-500" />{job.location}</span>
        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-royal-500" />{job.department}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={cn('badge text-xs', getJobTypeBadgeColor(job.jobType))}>{formatJobType(job.jobType)}</span>
        <span className={cn('badge text-xs', getWorkModeBadgeColor(job.workMode))}>{formatWorkMode(job.workMode)}</span>
        <span className="badge bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-400 text-xs">{formatExperience(job.experienceMin, job.experienceMax)}</span>
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {skills.map(s => <span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-gray-300 border border-navy-100 dark:border-navy-700">{s.trim()}</span>)}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-navy-700">
        <div className="text-sm font-semibold text-navy-950 dark:text-white">{formatSalaryRange(job.salaryMin, job.salaryMax)}</div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{timeAgo(job.createdAt)}</span>
          <Link href={`/jobs/${job.slug}`} className="btn-primary text-xs py-1.5 px-4">Apply Now</Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function JobsPageClient() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 12 });
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getAll({ ...filters, status: 'ACTIVE' });
      setJobs(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(f => ({ ...f, search: searchInput, page: 1 }));
  };

  const setFilter = (key: keyof JobFilters, value: any) => {
    setFilters(f => ({ ...f, [key]: value === f[key] ? undefined : value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12 });
    setSearchInput('');
  };

  const activeFilterCount = [filters.industry, filters.jobType, filters.workMode, filters.search].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-24 pb-16">
      {/* Header */}
      <div className="hero-bg py-14">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-cyan-400 mb-3">Open Positions</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Find Your <span className="gradient-text-light">Dream Job</span></h1>
            <p className="text-gray-300 max-w-xl mx-auto mb-8">Explore hundreds of opportunities across India's top companies.</p>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, skills, companies..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur text-white placeholder:text-gray-400 border border-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
              <button type="submit" className="btn-primary px-6">Search</button>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-navy-950 dark:text-white">{pagination?.total ?? 0}</span> jobs found
          </div>
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700">
                <X className="w-3.5 h-3.5" /> Clear ({activeFilterCount})
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn('flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
                showFilters ? 'bg-royal-600 text-white border-royal-600' : 'bg-white dark:bg-navy-900 border-gray-200 dark:border-navy-700 text-gray-700 dark:text-gray-300'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 glass-card rounded-2xl p-5 overflow-hidden"
            >
              <div className="grid md:grid-cols-3 gap-6">
                {/* Industry */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Industry</div>
                  <div className="flex flex-wrap gap-2">
                    {industries.map(ind => (
                      <button key={ind} onClick={() => setFilter('industry', ind)}
                        className={cn('text-xs px-3 py-1.5 rounded-full border transition-colors',
                          filters.industry === ind
                            ? 'bg-royal-600 text-white border-royal-600'
                            : 'border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-400 hover:border-royal-400'
                        )}
                      >{ind}</button>
                    ))}
                  </div>
                </div>
                {/* Job Type */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Job Type</div>
                  <div className="flex flex-wrap gap-2">
                    {jobTypes.map(type => (
                      <button key={type} onClick={() => setFilter('jobType', type)}
                        className={cn('text-xs px-3 py-1.5 rounded-full border transition-colors',
                          filters.jobType === type ? 'bg-royal-600 text-white border-royal-600' : 'border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-400 hover:border-royal-400'
                        )}
                      >{formatJobType(type)}</button>
                    ))}
                  </div>
                </div>
                {/* Work Mode */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Work Mode</div>
                  <div className="flex flex-wrap gap-2">
                    {workModes.map(mode => (
                      <button key={mode} onClick={() => setFilter('workMode', mode)}
                        className={cn('text-xs px-3 py-1.5 rounded-full border transition-colors',
                          filters.workMode === mode ? 'bg-royal-600 text-white border-royal-600' : 'border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-400 hover:border-royal-400'
                        )}
                      >{formatWorkMode(mode)}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jobs grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
                {[...Array(5)].map((_, j) => <div key={j} className="skeleton h-4 rounded" style={{ width: `${60 + j * 8}%` }} />)}
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          </AnimatePresence>
        )}

        {!loading && jobs.length === 0 && (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-navy-700" />
            <h3 className="font-display text-xl font-semibold text-gray-500 mb-2">No jobs found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}
              disabled={!pagination.hasPrevPage}
              className="p-2 rounded-lg border border-gray-200 dark:border-navy-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(Math.min(pagination.pages, 7))].map((_, i) => {
              const page = i + 1;
              return (
                <button key={page}
                  onClick={() => setFilters(f => ({ ...f, page }))}
                  className={cn('w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                    filters.page === page ? 'bg-royal-600 text-white' : 'border border-gray-200 dark:border-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800'
                  )}
                >{page}</button>
              );
            })}
            <button
              onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
              disabled={!pagination.hasNextPage}
              className="p-2 rounded-lg border border-gray-200 dark:border-navy-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
