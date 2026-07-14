'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, Download, ChevronDown, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { applicationsApi } from '@/lib/api';
import { Application, ApplicationStatus } from '@/types';
import { cn, formatDate, formatApplicationStatus, getApplicationStatusColor, timeAgo } from '@/lib/utils';

const ALL_STATUSES: ApplicationStatus[] = ['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFERED', 'HIRED', 'REJECTED', 'WITHDRAWN'];

export default function AdminApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await applicationsApi.getAll({
        page, limit: 15,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setApplications(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const openDetail = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setNotes(app.notes || '');
    setInterviewDate(app.interviewDate ? new Date(app.interviewDate).toISOString().split('T')[0] : '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setUpdatingStatus(true);
    try {
      await applicationsApi.updateStatus(selectedApp.id, { status: newStatus, notes, interviewDate: interviewDate || undefined });
      toast.success('Status updated successfully');
      setSelectedApp(prev => prev ? { ...prev, status: newStatus as ApplicationStatus, notes, interviewDate } : null);
      fetchApplications();
    } catch { toast.error('Failed to update status'); }
    finally { setUpdatingStatus(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950 dark:text-white">Applicants</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{pagination?.total ?? 0} total applications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search applicants..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="form-input pl-10 w-full" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="form-input w-44">
          <option value="">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{formatApplicationStatus(s)}</option>)}
        </select>
      </div>

      {/* Status quick filters */}
      <div className="flex flex-wrap gap-2">
        {['', ...ALL_STATUSES].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={cn('text-xs px-3 py-1.5 rounded-full border transition-colors',
              statusFilter === s ? 'bg-royal-600 text-white border-royal-600' : 'border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-400 hover:border-royal-400 bg-white dark:bg-navy-900'
            )}>
            {s ? formatApplicationStatus(s) : 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-navy-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Applicant</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Job Applied</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Experience</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Applied</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-navy-800">
                    {[...Array(6)].map((_, j) => <td key={j} className="px-5 py-4"><div className="skeleton h-4 rounded" style={{ width: `${40 + j * 10}%` }} /></td>)}
                  </tr>
                ))
              ) : applications.map((app) => (
                <tr key={app.id} className="border-b border-gray-50 dark:border-navy-800/50 hover:bg-gray-50/50 dark:hover:bg-navy-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-royal-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {app.firstName?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-navy-950 dark:text-white">{app.firstName} {app.lastName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{app.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="text-sm text-navy-950 dark:text-white">{app.job?.title ?? '-'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{app.job?.location}</div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-sm text-gray-600 dark:text-gray-400">{app.totalExperience} yrs</td>
                  <td className="px-5 py-4">
                    <span className={cn('badge text-xs', getApplicationStatusColor(app.status))}>{formatApplicationStatus(app.status)}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{timeAgo(app.createdAt)}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => openDetail(app)} className="p-1.5 rounded-lg text-gray-400 hover:text-royal-600 hover:bg-royal-50 dark:hover:bg-royal-900/20 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && applications.length === 0 && (
          <div className="py-16 text-center text-gray-400">No applications found</div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-navy-700 mb-10">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-navy-800">
                <h2 className="font-display text-xl font-bold text-navy-950 dark:text-white">Application Details</h2>
                <button onClick={() => setSelectedApp(null)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                    {selectedApp.firstName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-950 dark:text-white">{selectedApp.firstName} {selectedApp.lastName}</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{selectedApp.currentRole} {selectedApp.currentCompany ? `at ${selectedApp.currentCompany}` : ''}</div>
                  </div>
                  <span className={cn('ml-auto badge', getApplicationStatusColor(selectedApp.status))}>{formatApplicationStatus(selectedApp.status)}</span>
                </div>

                {/* Info grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Email', value: selectedApp.email },
                    { label: 'Phone', value: selectedApp.phone },
                    { label: 'Location', value: selectedApp.currentLocation },
                    { label: 'Experience', value: `${selectedApp.totalExperience} years` },
                    { label: 'Notice Period', value: selectedApp.noticePeriod },
                    { label: 'Current CTC', value: selectedApp.currentSalary ? `₹${(selectedApp.currentSalary / 100000).toFixed(1)}L` : 'N/A' },
                    { label: 'Expected CTC', value: selectedApp.expectedSalary ? `₹${(selectedApp.expectedSalary / 100000).toFixed(1)}L` : 'N/A' },
                    { label: 'Applied', value: formatDate(selectedApp.createdAt) },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 dark:bg-navy-800 rounded-xl px-4 py-3">
                      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                      <div className="text-sm font-medium text-navy-950 dark:text-white">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Resume link */}
                {selectedApp.resumeUrl && (
                  <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-royal-50 dark:bg-royal-900/20 rounded-xl text-sm text-royal-600 dark:text-royal-400 hover:bg-royal-100 dark:hover:bg-royal-900/40 transition-colors">
                    <Download className="w-4 h-4" /> View / Download Resume
                  </a>
                )}

                {/* Cover letter */}
                {selectedApp.coverLetter && (
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cover Letter</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-navy-800 rounded-xl p-4 leading-relaxed">{selectedApp.coverLetter}</div>
                  </div>
                )}

                {/* Update status */}
                <div className="border-t border-gray-100 dark:border-navy-800 pt-4 space-y-3">
                  <h4 className="font-semibold text-navy-950 dark:text-white text-sm">Update Status</h4>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="form-input">
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{formatApplicationStatus(s)}</option>)}
                  </select>
                  {newStatus === 'INTERVIEW_SCHEDULED' && (
                    <div>
                      <label className="form-label">Interview Date & Time</label>
                      <input type="datetime-local" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} className="form-input" />
                    </div>
                  )}
                  <div>
                    <label className="form-label">Internal Notes</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="form-input resize-none" placeholder="Add notes about this candidate..." />
                  </div>
                  <button onClick={handleUpdateStatus} disabled={updatingStatus} className="btn-primary disabled:opacity-60 w-full justify-center">
                    {updatingStatus ? 'Updating...' : 'Update Status & Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
