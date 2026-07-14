'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Briefcase, Building2, Globe, Award, Clock } from 'lucide-react';

const stats = [
  { icon: Users, value: 500, suffix: '+', label: 'Successful Placements', color: 'text-cyan-500' },
  { icon: Briefcase, value: 200, suffix: '+', label: 'Partner Companies', color: 'text-royal-500' },
  { icon: Building2, value: 20, suffix: '+', label: 'Industries Covered', color: 'text-purple-500' },
  { icon: Globe, value: 15, suffix: '+', label: 'Cities Pan India', color: 'text-green-500' },
  { icon: Award, value: 98, suffix: '%', label: 'Client Satisfaction', color: 'text-yellow-500' },
  { icon: Clock, value: 4, suffix: ' yrs', label: 'Years of Excellence', color: 'text-pink-500' },
];

function CountUp({ end, suffix, started }: { end: number; suffix: string; started: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, end]);

  return <span>{count}{suffix}</span>;
}

export default function StatsSection() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-16 bg-gradient-to-b from-navy-950 to-white dark:to-navy-950 overflow-hidden">
      {/* Wave divider top */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,0 L0,0 Z" fill="#0a1628" />
        </svg>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="stat-card text-center group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 dark:bg-navy-800 mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`font-display text-3xl font-bold ${stat.color} mb-1`}>
                <CountUp end={stat.value} suffix={stat.suffix} started={inView} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
