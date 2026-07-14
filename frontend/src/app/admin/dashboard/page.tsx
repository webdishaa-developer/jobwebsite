'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, Users, TrendingUp, Mail, Clock, CheckCircle, ArrowUp, ArrowDown, Star } from 'lucide-react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { DashboardStats } from '@/types';
import { cn, formatDate, formatApplicationStatus, getApplicationStatusColor } from '@/lib/utils';

const PIE_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#64748b'];

function StatCard({ icon: Icon, label, value, sub, trend, color }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-navy-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-semibold', trend >= 0 ? 'text-green-500' : 'text-red-500')}>
            {trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="font-display text-3xl font-bold text-navy-950 dark:text-white mb-0.5">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </motion.div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon={Briefcase} label="Active Jobs" value={stats?.activeJobs ?? 0} sub={`${stats?.totalJobs ?? 0} total`} color="bg-royal-600" />
        <StatCard icon={Users} label="Applications" value={stats?.totalApplications ?? 0} sub={`${stats?.thisMonthApplications ?? 0} this month`} trend={stats?.applicationGrowth} color="bg-cyan-600" />
        <StatCard icon={Clock} label="Pending Review" value={stats?.pendingApplications ?? 0} color="bg-yellow-500" />
        <StatCard icon={CheckCircle} label="Shortlisted" value={stats?.shortlistedApplications ?? 0} color="bg-green-600" />
        <StatCard icon={Mail} label="Unread Messages" value={stats?.unreadMessages ?? 0} color="bg-purple-600" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Applications trend */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-navy-800 shadow-sm">
          <h3 className="font-display font-bold text-navy-950 dark:text-white mb-4">Application Trend (6 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.applicationTrend ?? []} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Applications by status */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-navy-800 shadow-sm">
          <h3 className="font-display font-bold text-navy-950 dark:text-white mb-4">Applications by Status</h3>
          {data?.applicationsByStatus?.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={data.applicationsByStatus} dataKey="_count.id" nameKey="status" cx="50%" cy="50%" outerRadius={70} paddingAngle={3}>
                    {data.applicationsByStatus.map((_: any, index: number) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, formatApplicationStatus(name as string)]}
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {data.applicationsByStatus.map((item: any, i: number) => (
                  <div key={item.status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-gray-600 dark:text-gray-400">{formatApplicationStatus(item.status)}</span>
                    </div>
                    <span className="font-semibold text-navy-950 dark:text-white">{item._count.id}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Recent activity + top jobs */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent applications */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-navy-950 dark:text-white">Recent Applications</h3>
            <Link href="/admin/applicants" className="text-xs text-royal-600 dark:text-cyan-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {data?.recentApplications?.slice(0, 6).map((app: any) => (
              <div key={app.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-royal-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {app.firstName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-navy-950 dark:text-white truncate">{app.firstName} {app.lastName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.job?.title}</div>
                </div>
                <span className={cn('badge text-xs flex-shrink-0', getApplicationStatusColor(app.status))}>{formatApplicationStatus(app.status)}</span>
              </div>
            ))}
            {(!data?.recentApplications || data.recentApplications.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">No applications yet</p>
            )}
          </div>
        </div>

        {/* Top jobs */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-navy-950 dark:text-white">Top Jobs by Views</h3>
            <Link href="/admin/jobs" className="text-xs text-royal-600 dark:text-cyan-400 hover:underline">Manage</Link>
          </div>
          <div className="space-y-3">
            {data?.topJobs?.map((job: any, i: number) => (
              <div key={job.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-royal-100 to-cyan-100 dark:from-royal-900/40 dark:to-cyan-900/40 flex items-center justify-center text-xs font-bold text-royal-700 dark:text-cyan-400">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-navy-950 dark:text-white truncate">{job.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{job.views} views · {job._count.applications} applications</div>
                </div>
              </div>
            ))}
            {(!data?.topJobs || data.topJobs.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">No jobs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
