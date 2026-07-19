'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Eye, Award, Users, MapPin, Calendar, Building, CheckCircle2 } from 'lucide-react';

const timeline = [
  { year: '2016', title: 'Founded', desc: 'Recluta Talent Management Pvt Ltd incorporated on December 24, 2020 in Bilaspur, Chhattisgarh.' },
  { year: '2018', title: 'First 500 Placements', desc: 'Successfully placed 500+ professionals across IT, BFSI and Manufacturing sectors.' },
  { year: '2020', title: 'Pan India Expansion', desc: 'Extended operations to 1000+ cities including Bangalore, Mumbai, Delhi, Hyderabad and Pune.' },
  { year: '2023', title: '200+ Clients', desc: 'Crossed 200 client companies and 300 successful placements. Expanded to bulk hiring solutions.' },
  { year: '2026', title: 'New Milestones', desc: 'Launched executive search division and IT staffing vertical. 500+ placements and counting.' },
];

const team = [
  {
    name: 'Our Vision',
    role: 'Building Careers, Empowering Businesses',
    desc: 'We connect talented professionals with the right opportunities while helping organizations build high-performing teams through trust, innovation, and excellence.',
    initial: 'V'
  },
  {
    name: 'Our Mission',
    role: 'Committed to Excellence',
    desc: 'We deliver reliable recruitment solutions that create meaningful careers, support business growth, and foster long-term partnerships with clients and candidates.',
    initial: 'M'
  },
];

const achievements = [
  { icon: Users, value: '50000+', label: 'Successful Placements' },
  { icon: Building, value: '200+', label: 'Partner Companies' },
  { icon: MapPin, value: '1000+', label: 'Cities Covered' },
  { icon: Award, value: '98%', label: 'Client Satisfaction' },
];

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className={className}>
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      {/* Hero */}
      <div className="hero-bg pt-32 pb-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-cyan-400 mb-4">About Us</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
              Connecting <span className="gradient-text-light">India's Talent</span><br />Since 2016
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Recluta Talent Management Pvt Ltd is a fast-growing HR consultancy providing comprehensive
              manpower recruitment and HR solutions across India.
            </p>
           
          </motion.div>
        </div>
      </div>

      {/* Company overview */}
      <section className="section-padding bg-gray-50 dark:bg-navy-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Section>
              <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-3">Who We Are</span>
              <h2 className="font-display text-4xl font-bold text-navy-950 dark:text-white mb-6">
                Your Trusted <span className="gradient-text">HR Partner</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Founded in December 2020, Recluta Talent Management Pvt Ltd has rapidly grown to become one of
                India's trusted HR consultancies. We specialize in connecting exceptional talent with leading
                organizations across diverse industries.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Based in Bilaspur, Chhattisgarh with pan-India reach, we serve organizations from startups to
                Fortune 500 companies, providing end-to-end talent management solutions tailored to their unique needs.
              </p>
              <div className="flex items-start gap-3 p-4 bg-royal-50 dark:bg-royal-900/20 rounded-xl border border-royal-100 dark:border-royal-900/50">
                <MapPin className="w-5 h-5 text-royal-600 dark:text-royal-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Registered Office:</strong><br />
                   <span>1st Floor, Kuldeep Bhavan, Above S K Sales , Near Raman Mandir Marg 
                   <br /> Fafadih Raipur (C.G.) 492001</span>
                </div>
              </div>
            </Section>
            {/* Stats */}
            <Section>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((item, i) => (
                  <div key={i} className="glass-card rounded-2xl p-6 text-center card-hover">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-royal-100 to-cyan-100 dark:from-royal-900/40 dark:to-cyan-900/40 mb-3">
                      <item.icon className="w-6 h-6 text-royal-600 dark:text-cyan-400" />
                    </div>
                    <div className="font-display text-3xl font-bold gradient-text mb-1">{item.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <Section>
              <div className="glass-card rounded-2xl p-8 h-full border-l-4 border-l-royal-600">
                <div className="w-14 h-14 rounded-xl bg-royal-100 dark:bg-royal-900/30 flex items-center justify-center mb-5">
                  <Target className="w-7 h-7 text-royal-600 dark:text-royal-400" />
                </div>
                <h3 className="font-display text-2xl font-bold text-navy-950 dark:text-white mb-4">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To bridge the gap between exceptional talent and outstanding organizations by delivering
                  precision-driven, ethical, and personalized recruitment solutions that create lasting
                  impact for both employers and candidates across India.
                </p>
              </div>
            </Section>
            <Section>
              <div className="glass-card rounded-2xl p-8 h-full border-l-4 border-l-cyan-500">
                <div className="w-14 h-14 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-5">
                  <Eye className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="font-display text-2xl font-bold text-navy-950 dark:text-white mb-4">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To be India's most trusted and innovative talent management company — recognized for
                  our integrity, speed, and the transformative impact we create for organizations and
                  professionals we serve, from every corner of the nation.
                </p>
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="section-padding bg-gray-50 dark:bg-navy-900">
        <div className="container-custom">
          <Section className="text-center mb-12">
            <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-3">Our Journey</span>
            <h2 className="font-display text-4xl font-bold text-navy-950 dark:text-white">
              Built on <span className="gradient-text">Milestones</span>
            </h2>
          </Section>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-royal-600 via-cyan-500 to-royal-400" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <Section key={item.year}>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-600 to-cyan-500 flex items-center justify-center z-10 relative">
                        <span className="font-display font-bold text-white text-sm">{item.year}</span>
                      </div>
                    </div>
                    <div className="glass-card rounded-2xl p-5 flex-1">
                      <h3 className="font-display font-bold text-lg text-navy-950 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section-padding bg-white dark:bg-navy-950">
        <div className="container-custom">
          <Section className="text-center mb-12">
            <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-3">Leadership</span>
            <h2 className="font-display text-4xl font-bold text-navy-950 dark:text-white">
              Our Leadership<span className="gradient-text">Philosophy</span>
            </h2>
          </Section>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <Section key={member.name}>
                <div className="glass-card rounded-2xl p-8 text-center card-hover">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-royal-600 to-cyan-500 flex items-center justify-center text-white font-display font-bold text-3xl mx-auto mb-5 shadow-glow">
                    {member.initial}
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy-950 dark:text-white mb-1">{member.name}</h3>
                  <div className="text-cyan-600 dark:text-cyan-400 font-medium text-sm mb-4">{member.role}</div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{member.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
