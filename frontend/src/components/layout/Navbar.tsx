'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  {
    href: '/services',
    label: 'Services',
    children: [
      { href: '/services#recruitment',      label: '🎯 Recruitment' },
      { href: '/services#staffing',         label: '👥 Staffing' },
      { href: '/services#executive-search', label: '👑 Executive Search' },
      { href: '/services#hr-consulting',    label: '⚙️ HR Consulting' },
      { href: '/services#payroll',          label: '💰 Payroll' },
      { href: '/services#bulk-hiring',      label: '⚡ Bulk Hiring' },
    ],
  },
  { href: '/jobs',    label: 'Jobs' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname    = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown,   setDropdown]   = useState<string | null>(null);
  const [logoError,  setLogoError]  = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'bg-[#04080f]/95 backdrop-blur-xl border-b border-white/5',
        scrolled ? 'shadow-2xl' : 'shadow-none'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[72px] flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative flex-shrink-0" style={{ width: 52, height: 52 }}>
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt="Recluta Logo"
                  fill
                  priority
                  sizes="52px"
                  className="object-contain"
                  onError={() => setLogoError(true)}
                />  
              ) : (
                <div className="w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
                  <span className="text-white font-bold text-2xl">R</span>
                </div>
              )}
            </div>
            <div className="leading-none">
              <span className="block font-extrabold text-[19px] tracking-tight text-white leading-none">
                RECLUTA
              </span>
              <span className="block text-[9px] tracking-[0.24em] uppercase text-cyan-400 mt-[5px] leading-none font-medium">
                Talent Management
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div ref={dropdownRef} className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(item =>
              item.children ? (
                <div key={item.href} className="relative">
                  <button
                    onClick={() => setDropdown(dropdown === item.href ? null : item.href)}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive(item.href) ? 'text-cyan-400' : 'text-gray-300 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', dropdown === item.href && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {dropdown === item.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-[#0c1525] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-blue-600/10 hover:text-cyan-400 transition-colors duration-150"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(item.href) ? 'text-cyan-400' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                  )}
                </Link>
              )
            )}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/contact"
              className="hidden md:block text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all whitespace-nowrap"
            >
              Hire Talent
            </Link>

            <Link
              href="/jobs"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              Find Jobs
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-[#04080f]/98 backdrop-blur-xl border-t border-white/8"
          >
            <div className="px-5 py-4 space-y-1">
              {navLinks.map(item => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.href) ? 'text-cyan-400 bg-cyan-400/5' : 'text-gray-200 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 mt-1 space-y-1">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-2 px-3 text-xs text-gray-400 hover:text-cyan-400 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-white/10 mt-3 flex flex-col gap-2">
                <Link href="/contact" className="block w-full text-center border border-white/15 text-gray-200 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/5 transition-all">
                  Hire Talent
                </Link>
                <Link href="/jobs" className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm transition-all">
                  Find Jobs →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}