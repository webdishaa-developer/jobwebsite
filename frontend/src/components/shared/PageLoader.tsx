'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase } from 'lucide-react';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a3a6b 50%, #0a1628 100%)' }}
        >
          {/* Animated background circles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-cyan-500/10"
                style={{
                  width: `${150 + i * 80}px`,
                  height: `${150 + i * 80}px`,
                  left: '50%',
                  top: '50%',
                  x: '-50%',
                  y: '-50%',
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-royal-600 to-cyan-500 flex items-center justify-center shadow-glow">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-royal-600 to-cyan-500"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="font-display font-bold text-3xl text-white tracking-wide">RECLUTA</div>
              <div className="text-xs font-mono text-cyan-400 tracking-[0.3em] uppercase mt-1">
                Talent Management
              </div>
            </motion.div>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48"
          >
            <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-royal-500 to-cyan-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
              />
            </div>
            <p className="text-center text-xs text-gray-500 mt-3">Loading excellence...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
