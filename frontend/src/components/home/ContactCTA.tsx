'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Phone, Mail } from 'lucide-react';

export default function ContactCTA() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-bg" />
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal-500/30 to-transparent" />

      <div className="relative container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan-400 mb-4 font-mono">
            Get Started Today
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Build Your{' '}
            <span className="gradient-text-light">Dream Team?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Whether you're looking for top talent or your next career opportunity, Recluta is your
            trusted partner every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              Start Hiring <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/jobs" className="btn-outline-white text-base px-8 py-4">
              Find a Job
            </Link>
          </div>

          {/* Contact quick access */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="tel:+919522299615" className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors group">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500">Call Us</div>
                <div className="text-sm font-semibold">+91 95222 99615 , 07714906561</div>
              </div>
            </a>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <a href="mailto:info@reclutasolutions.in" className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors group">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500">Email Us</div>
                <div className="text-sm font-semibold">info@reclutasolutions.in</div>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
