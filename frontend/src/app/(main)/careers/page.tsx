'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, TrendingUp, Coffee, Globe, Award, Users, ArrowRight, Briefcase } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  { icon: TrendingUp, title: 'Career Growth', desc: 'Clear progression paths, mentorship programs and continuous learning opportunities to accelerate your career.' },
  { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive health insurance, mental wellness programs and flexible work arrangements.' },
  { icon: Coffee, title: 'Great Culture', desc: 'Inclusive, collaborative work environment with regular team events, celebrations and recognition programs.' },
  { icon: Globe, title: 'Remote Friendly', desc: 'Hybrid work options for most roles. Work from where you do your best work.' },
  { icon: Award, title: 'Performance Bonuses', desc: 'Competitive base salaries, quarterly performance bonuses and exciting incentive structures.' },
  { icon: Users, title: 'Team First', desc: 'Work with passionate, driven colleagues who genuinely care about their clients and each other.' },
];

const openPositions = [
  { title: 'Senior Recruitment Consultant', dept: 'Recruitment', location: 'Bilaspur / Remote', type: 'Full Time', exp: '2-5 years' },
  { title: 'IT Recruitment Specialist', dept: 'IT Hiring', location: 'Bangalore / Hybrid', type: 'Full Time', exp: '1-3 years' },
  { title: 'HR Business Partner', dept: 'HR Consulting', location: 'Mumbai', type: 'Full Time', exp: '3-6 years' },
  { title: 'Business Development Manager', dept: 'Sales', location: 'Delhi / NCR', type: 'Full Time', exp: '3-7 years' },
  { title: 'Recruitment Trainee', dept: 'Recruitment', location: 'Bilaspur', type: 'Full Time', exp: 'Fresher' },
];

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className={className}>
      {children}
    </motion.div>
  );
}

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      {/* Hero */}
      <div className="hero-bg pt-32 pb-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-cyan-400 mb-4">Join Our Team</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">
              Build Your Career at <span className="gradient-text-light">Recluta</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Join a passionate team of HR professionals shaping the future of talent management in India.
              If you love people, thrive in a fast-paced environment and want to make an impact — you belong here.
            </p>
            <a href="#open-positions" className="btn-primary text-base px-8 py-4">
              View Open Positions <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Why work with us */}
      <section className="section-padding bg-gray-50 dark:bg-navy-900">
        <div className="container-custom">
          <Section className="text-center mb-12">
            <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-3">Why Recluta</span>
            <h2 className="font-display text-4xl font-bold text-navy-950 dark:text-white mb-4">
              More Than Just a <span className="gradient-text">Job</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              We invest in our people as much as we invest in our clients. Here's what makes Recluta a great place to grow.
            </p>
          </Section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <Section key={benefit.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  className="glass-card rounded-2xl p-6 card-hover group"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-100 to-cyan-100 dark:from-royal-900/40 dark:to-cyan-900/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-6 h-6 text-royal-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy-950 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
                </motion.div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section id="open-positions" className="section-padding bg-white dark:bg-navy-950">
        <div className="container-custom">
          <Section className="text-center mb-10">
            <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-3">Openings</span>
            <h2 className="font-display text-4xl font-bold text-navy-950 dark:text-white mb-4">
              Current <span className="gradient-text">Opportunities</span>
            </h2>
          </Section>

          <div className="space-y-4 max-w-4xl mx-auto">
            {openPositions.map((position, i) => (
              <Section key={position.title}>
                <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover border border-transparent hover:border-royal-200 dark:hover:border-navy-600">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-100 to-cyan-100 dark:from-royal-900/40 dark:to-cyan-900/40 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-royal-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-navy-950 dark:text-white">{position.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>{position.dept}</span>
                        <span>·</span>
                        <span>{position.location}</span>
                        <span>·</span>
                        <span>{position.exp} experience</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">{position.type}</span>
                    <Link href="/contact" className="btn-primary text-sm py-2 px-5">Apply</Link>
                  </div>
                </div>
              </Section>
            ))}
          </div>

          <Section className="text-center mt-10">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Don't see a role that fits? We're always looking for talented people.
            </p>
            <Link href="/contact" className="btn-secondary">
              Send an Open Application
            </Link>
          </Section>
        </div>
      </section>

      {/* Culture section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 hero-bg" />
        <div className="relative container-custom text-center">
          <Section>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Ready to Join the <span className="gradient-text-light">Recluta Family?</span>
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Send your resume to <a href="mailto:info@reclutasolutions.in" className="text-cyan-400 hover:underline">info@reclutasolutions.in</a> or reach out on WhatsApp at +91 95222 99615.
            </p>
            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              Get In Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </Section>
        </div>
      </section>
    </div>
  );
}
