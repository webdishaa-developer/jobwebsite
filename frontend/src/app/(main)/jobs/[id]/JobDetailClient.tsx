'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Briefcase, Clock, IndianRupee, Users, Calendar, ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { jobsApi, applicationsApi } from '@/lib/api';
import { Job } from '@/types';
import { cn, formatSalaryRange, formatExperience, formatJobType, formatWorkMode, formatDate, getJobTypeBadgeColor, getWorkModeBadgeColor } from '@/lib/utils';

const applySchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  currentLocation: z.string().min(2, 'Location required'),
  currentCompany: z.string().optional(),
  currentRole: z.string().optional(),
  totalExperience: z.string().min(1, 'Experience required'),
  noticePeriod: z.string().min(1, 'Notice period required'),
  expectedSalary: z.string().optional(),
  currentSalary: z.string().optional(),
  coverLetter: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
});

type ApplyFormValues = z.infer<typeof applySchema>;

export default function JobDetailClient({ slug }: { slug: string }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
  });

  useEffect(() => {
    jobsApi.getBySlug(slug)
      .then(res => setJob(res.data.data))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const onSubmit = async (data: ApplyFormValues) => {
    if (!resumeFile) { toast.error('Please upload your resume'); return; }
    if (!job) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v) formData.append(k, v); });
      formData.append('resume', resumeFile);
      await applicationsApi.apply(job.id, formData);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 bg-gray-50 dark:bg-navy-950">
        <div className="container-custom max-w-4xl">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-8 rounded-xl" style={{ width: `${40 + i * 10}%` }} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!job) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Job Not Found</h2>
        <Link href="/jobs" className="btn-primary">Back to Jobs</Link>
      </div>
    </div>
  );

  const skills = job.skills.split(',');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-24 pb-16">
      {/* Header */}
      <div className="hero-bg py-12">
        <div className="container-custom max-w-5xl">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-6 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {job.isFeatured && <span className="badge bg-gradient-to-r from-royal-600 to-cyan-600 text-white text-xs">Featured</span>}
                <span className={cn('badge text-xs', getJobTypeBadgeColor(job.jobType))}>{formatJobType(job.jobType)}</span>
                <span className={cn('badge text-xs', getWorkModeBadgeColor(job.workMode))}>{formatWorkMode(job.workMode)}</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-cyan-400" />{job.location}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-royal-400" />{job.department}</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-purple-400" />{job.openings} Opening{job.openings > 1 ? 's' : ''}</span>
                {job.deadline && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-yellow-400" />Apply by {formatDate(job.deadline)}</span>}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="glass-dark rounded-2xl p-4 text-right">
                <div className="text-xs text-gray-400 mb-1">Salary Range</div>
                <div className="text-xl font-bold text-cyan-400 mb-2">{formatSalaryRange(job.salaryMin, job.salaryMax)}</div>
                <div className="text-xs text-gray-400">Experience: {formatExperience(job.experienceMin, job.experienceMax)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom max-w-5xl py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-navy-950 dark:text-white mb-4">Job Description</h2>
              <div className="rich-content text-gray-700 dark:text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>
            {/* Responsibilities */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-navy-950 dark:text-white mb-4">Responsibilities</h2>
              <div className="rich-content text-gray-700 dark:text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
            </div>
            {/* Requirements */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-navy-950 dark:text-white mb-4">Requirements</h2>
              <div className="rich-content text-gray-700 dark:text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: job.requirements }} />
            </div>

            {/* Apply Form */}
            {showApplyForm && !submitted && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-2xl font-bold text-navy-950 dark:text-white mb-6">Apply for this Position</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">First Name *</label>
                      <input {...register('firstName')} className="form-input" placeholder="John" />
                      {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                    </div>
                    <div>
                      <label className="form-label">Last Name *</label>
                      <input {...register('lastName')} className="form-input" placeholder="Doe" />
                      {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Email *</label>
                      <input {...register('email')} type="email" className="form-input" placeholder="john@email.com" />
                      {errors.email && <span className="form-error">{errors.email.message}</span>}
                    </div>
                    <div>
                      <label className="form-label">Phone *</label>
                      <input {...register('phone')} className="form-input" placeholder="+91 98765 43210" />
                      {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Current Location *</label>
                      <input {...register('currentLocation')} className="form-input" placeholder="Mumbai, Maharashtra" />
                      {errors.currentLocation && <span className="form-error">{errors.currentLocation.message}</span>}
                    </div>
                    <div>
                      <label className="form-label">Total Experience (years) *</label>
                      <input {...register('totalExperience')} type="number" step="0.5" className="form-input" placeholder="3.5" />
                      {errors.totalExperience && <span className="form-error">{errors.totalExperience.message}</span>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Current Company</label>
                      <input {...register('currentCompany')} className="form-input" placeholder="ABC Corp" />
                    </div>
                    <div>
                      <label className="form-label">Current Role</label>
                      <input {...register('currentRole')} className="form-input" placeholder="Software Engineer" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Notice Period *</label>
                      <select {...register('noticePeriod')} className="form-input">
                        <option value="">Select</option>
                        <option>Immediate</option>
                        <option>15 Days</option>
                        <option>30 Days</option>
                        <option>60 Days</option>
                        <option>90 Days</option>
                      </select>
                      {errors.noticePeriod && <span className="form-error">{errors.noticePeriod.message}</span>}
                    </div>
                    <div>
                      <label className="form-label">Current CTC (₹/year)</label>
                      <input {...register('currentSalary')} type="number" className="form-input" placeholder="600000" />
                    </div>
                    <div>
                      <label className="form-label">Expected CTC (₹/year)</label>
                      <input {...register('expectedSalary')} type="number" className="form-input" placeholder="900000" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">LinkedIn URL</label>
                      <input {...register('linkedinUrl')} type="url" className="form-input" placeholder="https://linkedin.com/in/..." />
                    </div>
                    <div>
                      <label className="form-label">Portfolio URL</label>
                      <input {...register('portfolioUrl')} type="url" className="form-input" placeholder="https://..." />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Cover Letter</label>
                    <textarea {...register('coverLetter')} rows={4} className="form-input resize-none" placeholder="Tell us why you're a great fit..." />
                  </div>
                  {/* Resume upload */}
                  <div>
                    <label className="form-label">Resume * (PDF/DOC/DOCX, max 5MB)</label>
                    <div
                      className={cn('border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer',
                        resumeFile ? 'border-green-400 bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-navy-600 hover:border-royal-400'
                      )}
                      onClick={() => document.getElementById('resume-upload')?.click()}
                    >
                      <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setResumeFile(e.target.files?.[0] || null)} />
                      {resumeFile ? (
                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{resumeFile.name}</span>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload your resume</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center disabled:opacity-60">
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button type="button" onClick={() => setShowApplyForm(false)} className="btn-secondary px-6">Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            {submitted && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-display text-2xl font-bold text-navy-950 dark:text-white mb-2">Application Submitted!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">We've received your application and will review it shortly. Check your email for confirmation.</p>
                <Link href="/jobs" className="btn-primary">Browse More Jobs</Link>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Apply card */}
            {!showApplyForm && !submitted && (
              <div className="glass-card rounded-2xl p-5">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-navy-950 dark:text-white mb-1">{formatSalaryRange(job.salaryMin, job.salaryMax)}</div>
                  <div className="text-sm text-gray-500">per annum</div>
                </div>
                <button onClick={() => setShowApplyForm(true)} className="btn-primary w-full justify-center mb-3">
                  Apply Now
                </button>
                <p className="text-xs text-center text-gray-400">Your data is safe and will never be shared</p>
              </div>
            )}

            {/* Job details */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-bold text-navy-950 dark:text-white mb-4">Job Details</h3>
              <dl className="space-y-3">
                {[
                  { label: 'Industry', value: job.industry },
                  { label: 'Department', value: job.department },
                  { label: 'Job Type', value: formatJobType(job.jobType) },
                  { label: 'Work Mode', value: formatWorkMode(job.workMode) },
                  { label: 'Experience', value: formatExperience(job.experienceMin, job.experienceMax) },
                  { label: 'Openings', value: `${job.openings} position${job.openings > 1 ? 's' : ''}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
                    <dd className="font-medium text-navy-950 dark:text-white text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Skills */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-bold text-navy-950 dark:text-white mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill} className="text-xs px-3 py-1.5 rounded-full bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-gray-300 border border-navy-100 dark:border-navy-700">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
