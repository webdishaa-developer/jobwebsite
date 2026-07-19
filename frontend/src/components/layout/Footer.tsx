'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Linkedin, Twitter, Facebook, Instagram, Briefcase, ArrowRight, ExternalLink } from 'lucide-react';

const footerLinks = {
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/about#team', label: 'Our Team' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact Us' },
  ],
  services: [
    { href: '/services#recruitment', label: 'Recruitment' },
    { href: '/services#staffing', label: 'Staffing' },
    { href: '/services#executive-search', label: 'Executive Search' },
    { href: '/services#hr-consulting', label: 'HR Consulting' },
    { href: '/services#payroll', label: 'Payroll' },
    { href: '/services#bulk-hiring', label: 'Bulk Hiring' },
  ],
  industries: [
    { label: 'Information Technology' },
    { label: 'Banking & Finance' },
    { label: 'Manufacturing' },
    { label: 'Healthcare' },
    { label: 'FMCG & Retail' },
    { label: 'Infrastructure' },
    { label: 'Paint Industry' },
    { label: 'Retail' },
    { label: 'Engineering' },
    { label: 'Automobile' },
    { label: 'Consumer Products' },
    { label: 'E-Commerce' },


  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* CTA Banner */}
      <div className="relative border-b border-white/10">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold mb-2">Ready to Transform Your Career?</h3>
              <p className="text-gray-400 text-sm">Connect with India's leading talent management experts</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/jobs" className="btn-primary">
                Browse Jobs <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-outline-white">
                Hire Talent
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-royal-600 to-cyan-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-xl leading-none">RECLUTA</div>
                <div className="text-[9px] text-cyan-400 tracking-widest uppercase font-mono leading-none mt-0.5">
                  Talent Management
                </div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Fast-growing HR consultancy providing expert manpower recruitment and comprehensive HR solutions across India since 2020.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>1st Floor, Kuldeep Bhavan, Above S K Sales , Near Raman Mandir Marg Fafadih Raipur (C.G.) 492001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a href="tel:+919522299615" className="hover:text-cyan-400 transition-colors">+91 95222 99615 , 07714906561</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a href="mailto:info@reclutasolutions.in" className="hover:text-cyan-400 transition-colors">info@reclutasolutions.in</a>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Linkedin, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Facebook, href: '#' },
                { Icon: Instagram, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-cyan-400 mb-5">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5 group transition-colors">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-cyan-400 mb-5">Services</h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5 group transition-colors">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-cyan-400 mb-5">Industries</h4>
            <ul className="space-y-2.5">
              {footerLinks.industries.map((item) => (
                <li key={item.label} className="flex items-center gap-1.5 text-sm text-gray-400">
                  <span className="w-1 h-1 rounded-full bg-cyan-500/50" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="container-custom py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Recluta Talent Management Pvt Ltd. All rights reserved.</p>
            <div className="flex items-center gap-1">
  <span className="font-mono text-gray-600">
    Developed By{" "}
    <a
      href="https://namanjainottportfolio.netlify.app"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      NAMAN JAIN
    </a>
  </span>
</div>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
