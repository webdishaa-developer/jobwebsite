'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sun, Moon, Briefcase } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  {
    href: '/services',
    label: 'Services',
    children: [
      { href: '/services#recruitment', label: 'Recruitment' },
      { href: '/services#staffing', label: 'Staffing' },
      { href: '/services#executive-search', label: 'Executive Search' },
      { href: '/services#hr-consulting', label: 'HR Consulting' },
      { href: '/services#payroll', label: 'Payroll' },
      { href: '/services#bulk-hiring', label: 'Bulk Hiring' },
    ],
  },
  { href: '/jobs', label: 'Jobs' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-navy-950/95 backdrop-blur-md shadow-lg shadow-navy-900/10'
          : 'bg-transparent'
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-royal-600 to-cyan-500 flex items-center justify-center shadow-glow group-hover:shadow-cyan transition-shadow duration-300">
              <Briefcase className="w-5 h-5 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-white dark:border-navy-950" />
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-none text-navy-950 dark:text-white">
                RECLUTA
              </div>
              <div className="text-[9px] font-mono text-gray-500 dark:text-gray-400 tracking-widest uppercase leading-none mt-0.5">
                Talent Management
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div ref={dropdownRef} className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.href} className="relative">
                  <button
                    className={cn(
                      'nav-link flex items-center gap-1 px-3 py-2 rounded-md',
                      isActive(link.href) && 'text-royal-600 dark:text-cyan-400'
                    )}
                    onClick={() => setActiveDropdown(activeDropdown === link.href ? null : link.href)}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn('w-3.5 h-3.5 transition-transform duration-200',
                        activeDropdown === link.href && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === link.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-52 glass-card rounded-xl overflow-hidden shadow-glass-lg"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-royal-50 dark:hover:bg-navy-800 hover:text-royal-600 dark:hover:text-cyan-400 transition-colors duration-150"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'nav-link px-3 py-2 rounded-md',
                    isActive(link.href) && 'text-royal-600 dark:text-cyan-400'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* CTA */}
            <Link href="/jobs" className="hidden md:block btn-primary text-sm py-2 px-5">
              Find Jobs
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-white dark:bg-navy-950 border-t border-gray-100 dark:border-navy-800"
          >
            <div className="container-custom py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive(link.href)
                        ? 'bg-royal-50 dark:bg-navy-800 text-royal-600 dark:text-cyan-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800'
                    )}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-royal-600 dark:hover:text-cyan-400 transition-colors"
                        >
                          <span className="w-1 h-1 rounded-full bg-cyan-500" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2 pb-1">
                <Link href="/jobs" className="btn-primary w-full justify-center text-sm">
                  Find Jobs
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
