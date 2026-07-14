'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Monitor, Landmark, Factory, Heart, ShoppingBag, Truck, Flame, Leaf, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const industries = [
  { icon: Monitor, name: 'Information Technology', roles: '120+ Roles', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: Landmark, name: 'Banking & Finance', roles: '85+ Roles', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { icon: Factory, name: 'Manufacturing', roles: '95+ Roles', color: 'from-orange-500 to-amber-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { icon: Heart, name: 'Healthcare', roles: '60+ Roles', color: 'from-red-500 to-rose-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  { icon: ShoppingBag, name: 'FMCG & Retail', roles: '70+ Roles', color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { icon: Truck, name: 'Logistics', roles: '45+ Roles', color: 'from-slate-500 to-gray-600', bg: 'bg-slate-50 dark:bg-slate-900/20' },
  { icon: Flame, name: 'Oil & Energy', roles: '30+ Roles', color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { icon: Leaf, name: 'Agriculture', roles: '25+ Roles', color: 'from-lime-500 to-green-500', bg: 'bg-lime-50 dark:bg-lime-900/20' },
  { icon: GraduationCap, name: 'Education', roles: '35+ Roles', color: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
];

export default function IndustriesSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="section-padding bg-white dark:bg-navy-950">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-3 font-mono">
            Sectors We Serve
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy-950 dark:text-white mb-4">
            Expertise Across{' '}
            <span className="gradient-text">All Industries</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Deep domain knowledge across 20+ sectors, enabling us to understand your unique talent requirements.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`group flex items-center gap-4 p-4 rounded-xl ${industry.bg} hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-navy-700`}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <industry.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm text-navy-950 dark:text-white leading-tight">{industry.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{industry.roles}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link href="/services" className="btn-primary">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
