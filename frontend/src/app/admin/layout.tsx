'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, Users, Star, FileText,
  LogOut, Menu, X, ChevronRight, Bell, Sun, Moon, Briefcase as BriefcaseIcon
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { authApi } from '@/lib/api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
  { href: '/admin/applicants', icon: Users, label: 'Applicants' },
  { href: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { href: '/admin/updates', icon: FileText, label: 'Updates' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const token = Cookies.get('recluta_token') || localStorage.getItem('recluta_token');
    if (!token && pathname !== '/admin') {
      router.push('/admin');
      return;
    }
    authApi.getMe()
      .then(res => setAdminName(res.data.data.name))
      .catch(() => {
        if (pathname !== '/admin') router.push('/admin');
      });
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      Cookies.remove('recluta_token');
      localStorage.removeItem('recluta_token');
      toast.success('Logged out successfully');
      router.push('/admin');
    } catch {
      Cookies.remove('recluta_token');
      localStorage.removeItem('recluta_token');
      router.push('/admin');
    }
  };

  // If on login page, don't show admin layout
  if (pathname === '/admin') return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-navy-900 border-r border-gray-200 dark:border-navy-800 shadow-lg transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 dark:border-navy-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-royal-600 to-cyan-500 flex items-center justify-center">
            <BriefcaseIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-navy-950 dark:text-white">RECLUTA</div>
            <div className="text-[9px] text-gray-400 font-mono tracking-widest uppercase">Admin Panel</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden p-1 rounded text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-royal-600 to-royal-700 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800 hover:text-navy-950 dark:hover:text-white'
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-100 dark:border-navy-800 space-y-2">
          <Link href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-royal-600 dark:hover:text-cyan-400 transition-colors">
            View Website ↗
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-800 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-navy-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-royal-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {adminName.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-navy-950 dark:text-white">{adminName}</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
