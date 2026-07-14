'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Star, MoreVertical, X, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobsApi } from '@/lib/api';
import { Job } from '@/types';
import { cn, formatJobType, formatWorkMode, timeAgo, getJobTypeBadgeColor } from '@/lib/utils';

const EMPTY_JOB = {
  title: '', location: '', jobType: 'FULL_TIME', workMode: 'HYBRID',
  industry: '', department: '', experienceMin: 0, experienceMax: 5,
  salaryMin: '', salaryMax: '', description: '', requirements: '',
  responsibilities: '', skills: '', openings: 1, status: 'ACTIVE',
  isFeatured: false, deadline: '',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  PAUSED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  CLOSED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<any>(EMPTY_JOB);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getAll({ page, limit: 15, search: search || undefined });
      setJobs(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const openCreate = () => { setEditingJob(null); setFormData(EMPTY_JOB); setShowModal(true); };
  const openEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({ ...job, skills: job.skills, salaryMin: job.salaryMin ?? '', salaryMax: job.salaryMax ?? '', deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.location || !formData.industry || !formData.description) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      if (editingJob) {
        await jobsApi.update(editingJob.id, formData);
        toast.success('Job updated successfully');
      } else {
        await jobsApi.create(formData);
        toast.success('Job created successfully');
      }
      setShowModal(false);
      fetchJobs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await jobsApi.delete(id);
      toast.success('Job deleted');
      setDeleteConfirm(null);
      fetchJobs();
    } catch { toast.error('Failed to delete job'); }
  };

  const setField = (field: string, value: any) => setFormData((f: any) => ({ ...f, [field]: value }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950 dark:text-white">Jobs Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{pagination?.total ?? 0} total jobs</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Job
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="form-input pl-10 max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-navy-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Job Title</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Location</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Views</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Posted</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-navy-800">
                    {[...Array(7)].map((_, j) => <td key={j} className="px-5 py-4"><div className="skeleton h-4 rounded" style={{ width: `${40 + j * 10}%` }} /></td>)}
                  </tr>
                ))
              ) : jobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-50 dark:border-navy-800/50 hover:bg-gray-50/50 dark:hover:bg-navy-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {job.isFeatured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                      <div>
                        <div className="font-semibold text-sm text-navy-950 dark:text-white">{job.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{job.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{job.location}</td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={cn('badge text-xs', getJobTypeBadgeColor(job.jobType))}>{formatJobType(job.jobType)}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{job.views}</td>
                  <td className="px-5 py-4">
                    <span className={cn('badge text-xs', statusColors[job.status])}>{job.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{timeAgo(job.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(job)} className="p-1.5 rounded-lg text-gray-400 hover:text-royal-600 hover:bg-royal-50 dark:hover:bg-royal-900/20 transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(job.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && jobs.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <p className="font-semibold mb-2">No jobs found</p>
            <button onClick={openCreate} className="btn-primary text-sm mt-2">Create First Job</button>
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200 dark:border-navy-700 mb-10">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-navy-800">
                <h2 className="font-display text-xl font-bold text-navy-950 dark:text-white">
                  {editingJob ? 'Edit Job' : 'Create New Job'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="form-label">Job Title *</label>
                    <input value={formData.title} onChange={e => setField('title', e.target.value)} className="form-input" placeholder="e.g. Senior Software Engineer" />
                  </div>
                  <div>
                    <label className="form-label">Location *</label>
                    <input value={formData.location} onChange={e => setField('location', e.target.value)} className="form-input" placeholder="Bangalore, Karnataka" />
                  </div>
                  <div>
                    <label className="form-label">Industry *</label>
                    <input value={formData.industry} onChange={e => setField('industry', e.target.value)} className="form-input" placeholder="Information Technology" />
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <input value={formData.department} onChange={e => setField('department', e.target.value)} className="form-input" placeholder="Engineering" />
                  </div>
                  <div>
                    <label className="form-label">Skills (comma-separated)</label>
                    <input value={formData.skills} onChange={e => setField('skills', e.target.value)} className="form-input" placeholder="React,Node.js,TypeScript" />
                  </div>
                  <div>
                    <label className="form-label">Job Type</label>
                    <select value={formData.jobType} onChange={e => setField('jobType', e.target.value)} className="form-input">
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                      <option value="FREELANCE">Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Work Mode</label>
                    <select value={formData.workMode} onChange={e => setField('workMode', e.target.value)} className="form-input">
                      <option value="ON_SITE">On-site</option>
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Min Experience (years)</label>
                    <input type="number" value={formData.experienceMin} onChange={e => setField('experienceMin', e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Max Experience (years)</label>
                    <input type="number" value={formData.experienceMax} onChange={e => setField('experienceMax', e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Min Salary (₹/year)</label>
                    <input type="number" value={formData.salaryMin} onChange={e => setField('salaryMin', e.target.value)} className="form-input" placeholder="600000" />
                  </div>
                  <div>
                    <label className="form-label">Max Salary (₹/year)</label>
                    <input type="number" value={formData.salaryMax} onChange={e => setField('salaryMax', e.target.value)} className="form-input" placeholder="1200000" />
                  </div>
                  <div>
                    <label className="form-label">Openings</label>
                    <input type="number" value={formData.openings} onChange={e => setField('openings', e.target.value)} className="form-input" min="1" />
                  </div>
                  <div>
                    <label className="form-label">Application Deadline</label>
                    <input type="date" value={formData.deadline} onChange={e => setField('deadline', e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <select value={formData.status} onChange={e => setField('status', e.target.value)} className="form-input">
                      <option value="ACTIVE">Active</option>
                      <option value="PAUSED">Paused</option>
                      <option value="DRAFT">Draft</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setField('isFeatured', e.target.checked)} className="w-4 h-4 text-royal-600 rounded" />
                    <label htmlFor="isFeatured" className="text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer">Featured Job</label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Description *</label>
                    <textarea value={formData.description} onChange={e => setField('description', e.target.value)} rows={4} className="form-input resize-none" placeholder="Job description..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Requirements</label>
                    <textarea value={formData.requirements} onChange={e => setField('requirements', e.target.value)} rows={3} className="form-input resize-none" placeholder="Requirements..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Responsibilities</label>
                    <textarea value={formData.responsibilities} onChange={e => setField('responsibilities', e.target.value)} rows={3} className="form-input resize-none" placeholder="Responsibilities..." />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-navy-800">
                <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
                  {saving ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
                </button>
                <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-navy-900 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-navy-700 shadow-2xl">
              <h3 className="font-display text-lg font-bold text-navy-950 dark:text-white mb-2">Delete Job?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">This will permanently delete the job and all its applications. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors">Delete</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
