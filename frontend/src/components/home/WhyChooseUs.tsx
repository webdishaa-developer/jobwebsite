'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Zap, Shield, HeartHandshake, Globe2, Award, Clock, TrendingUp } from 'lucide-react';

const reasons = [
  {
    icon: Target,
    title: 'Precision Matching',
    desc: 'Our AI-assisted screening ensures candidates are perfectly aligned with job requirements, saving 70% hiring time.',
    color: 'from-royal-500 to-royal-700',
    bgColor: 'bg-royal-50 dark:bg-royal-900/20',
  },
  {
    icon: Globe2,
    title: 'Pan India Network',
    desc: 'Active presence in 1,000+ cities with a database of 2,00,000+ pre-screened candidates across all major industries.',
    color: 'from-cyan-500 to-cyan-700',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    desc: 'Multi-stage verification, background checks, and skill assessments for every candidate we recommend.',
    color: 'from-green-500 to-green-700',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    desc: 'Average position closure in 15 days. For urgent requirements, we mobilize within 48 hours.',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated Support',
    desc: 'Assigned account manager for every client. We are your long-term talent partner, not just a vendor.',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    icon: TrendingUp,
    title: '98% Success Rate',
    desc: 'Connecting Oragnizations with top talent through efficient , reliable and result-driven recruitment solutions',
    color: 'from-purple-500 to-purple-700',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
];

export default function WhyChooseUs() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="section-padding bg-gray-50 dark:bg-navy-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-radial from-royal-100/50 dark:from-royal-900/20 to-transparent" />

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-3 font-mono">
            Why Recluta
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy-950 dark:text-white mb-4">
            Your Strategic{' '}
            <span className="gradient-text">Talent Partner</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            We don't just fill positions — we build teams. Our consultative approach ensures every placement
            drives real business impact.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-card rounded-2xl p-6 card-hover"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${reason.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${reason.color} flex items-center justify-center`}>
                  <reason.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 dark:text-white mb-2">{reason.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{reason.desc}</p>

              {/* Hover line */}
              <div className={`mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full bg-gradient-to-r ${reason.color}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
