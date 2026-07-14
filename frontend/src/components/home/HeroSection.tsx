'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, Users, Building2, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

const floatingBadges = [
  { icon: '🚀', text: '500+ Placements', delay: 0 },
  { icon: '⭐', text: '98% Success Rate', delay: 0.3 },
  { icon: '🏆', text: 'Pan India Network', delay: 0.6 },
];

export default function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgRef.current) return;
    const particles = bgRef.current.querySelectorAll('.particle');
    particles.forEach((p, i) => {
      gsap.to(p, {
        y: -30 - i * 10,
        x: Math.sin(i) * 20,
        duration: 3 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3,
      });
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-bg pt-20">
      {/* Animated background */}
      <div ref={bgRef} className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-royal-600/20 rounded-full filter blur-3xl animate-pulse_slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full filter blur-3xl animate-pulse_slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-royal-800/10 rounded-full filter blur-3xl animate-pulse_slow" style={{ animationDelay: '3s' }} />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1.5 h-1.5 rounded-full bg-cyan-400/40"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container-custom w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-medium">Now Hiring Across India</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-400">500+ Open Positions</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 text-shadow-lg"
            >
              Connecting{' '}
              <span className="relative">
                <span className="gradient-text-light">Top Talent</span>
                <motion.span
                  className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-royal-400"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
              </span>
              {' '}with{' '}
              <span className="gradient-text-light">Top Companies</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl"
            >
              Recluta Talent Management — India's trusted HR consultancy providing expert recruitment, 
              staffing, and HR solutions across IT, BFSI, Manufacturing and 20+ industries since 2020.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link href="/jobs" className="btn-primary text-base px-8 py-4 group">
                Explore Jobs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-outline-white text-base px-8 py-4">
                Hire Talent
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              {[
                'Pan India Presence',
                'ISO Certified Process',
                'Dedicated Account Manager',
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — visual card stack */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="glass-dark rounded-2xl p-6 border border-white/10 shadow-navy"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-cyan-400">Latest Opportunity</div>
                  <span className="badge bg-green-500/20 text-green-400 text-xs">● Live</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-white mb-2">Senior Software Engineer</h3>
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="badge bg-royal-900/50 text-royal-300 text-xs">Full Time</span>
                  <span className="badge bg-cyan-900/50 text-cyan-300 text-xs">Hybrid</span>
                  <span className="badge bg-navy-800/50 text-gray-300 text-xs">Bangalore</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">₹12L - ₹20L per annum</span>
                  <Link href="/jobs" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-xs">
                    Apply <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>

              {/* Floating stat cards */}
              {floatingBadges.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + badge.delay, type: 'spring' }}
                  className={`absolute glass-dark rounded-xl px-4 py-2.5 flex items-center gap-2 border border-white/10 text-sm font-medium text-white ${
                    i === 0 ? '-top-6 -left-8' :
                    i === 1 ? '-bottom-6 right-0' :
                    'top-1/2 -right-10'
                  }`}
                  style={{ animation: `float 3s ease-in-out ${badge.delay}s infinite` }}
                >
                  <span>{badge.icon}</span>
                  {badge.text}
                </motion.div>
              ))}

              {/* Background cards (stacked effect) */}
              <div className="absolute -z-10 top-4 left-4 right-4 bottom-0 glass-dark rounded-2xl opacity-60 border border-white/5" />
              <div className="absolute -z-20 top-8 left-8 right-8 bottom-0 glass-dark rounded-2xl opacity-30 border border-white/5" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-500">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-gray-600 flex items-center justify-center">
          <motion.div
            className="w-1 h-2 bg-cyan-400 rounded-full"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
