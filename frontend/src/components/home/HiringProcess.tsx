'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, FileCheck, Users, MessageSquare, CheckCircle, Handshake } from 'lucide-react';

const steps = [
  { icon: Search, step: '01', title: 'Requirement Analysis', desc: 'We understand your hiring needs, culture, and specific role requirements in depth.', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { icon: FileCheck, step: '02', title: 'Talent Sourcing', desc: 'Multi-channel sourcing from our 200K+ database, job boards, and professional networks.', color: 'text-royal-500', bg: 'bg-royal-50 dark:bg-royal-900/20' },
  { icon: Users, step: '03', title: 'Screening & Shortlisting', desc: 'Rigorous technical and cultural screening. Only top 5% make it to your desk.', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { icon: MessageSquare, step: '04', title: 'Client Interviews', desc: 'Coordinated interview scheduling with detailed candidate profiles and evaluation guides.', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { icon: CheckCircle, step: '05', title: 'Offer & Negotiation', desc: 'Expert salary benchmarking and negotiation support for smooth offer closure.', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { icon: Handshake, step: '06', title: 'Onboarding Support', desc: 'Streamlining the onboarding process to reduce delays and improve the candidate experince.', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
];

export function HiringProcess() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="section-padding bg-white dark:bg-navy-950">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-3 font-mono">
            Our Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy-950 dark:text-white mb-4">
            How We <span className="gradient-text">Deliver</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A proven 6-step process that ensures quality hiring outcomes for both employers and candidates.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[8.33%] right-[8.33%] h-0.5 bg-gradient-to-r from-cyan-200 via-royal-300 to-pink-200 dark:from-cyan-900/50 dark:via-royal-900/50 dark:to-pink-900/50" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${step.bg} mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <div className="absolute top-0 -left-2 font-display font-black text-6xl text-gray-100 dark:text-navy-800 leading-none select-none">
                  {step.step}
                </div>
                <h3 className="font-display text-lg font-bold text-navy-950 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HiringProcess;
