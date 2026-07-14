'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, UserPlus, Crown, Settings, DollarSign, Monitor, Factory, Landmark, Group, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    id: 'recruitment',
    icon: UserPlus,
    title: 'Permanent Recruitment',
    tagline: 'Right Talent. Right Role. Right Time.',
    color: 'from-royal-600 to-royal-800',
    bg: 'bg-royal-50 dark:bg-royal-900/20',
    desc: 'Our end-to-end permanent recruitment solution covers everything from job profiling to offer management. We leverage our vast network and structured screening process to deliver top-quality candidates faster.',
    features: ['Multi-channel talent sourcing', 'Technical & cultural screening', '3-stage interview process', '90-day replacement guarantee', 'Salary benchmarking support'],
  },
  {
    id: 'staffing',
    icon: Users,
    title: 'Contract Staffing',
    tagline: 'Flexible workforce for dynamic needs.',
    color: 'from-cyan-600 to-cyan-800',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    desc: 'Scale your workforce up or down with our contract staffing solutions. We handle all employment formalities including PF, ESI, gratuity and compliance, so you can focus on your business.',
    features: ['Project-based deployments', 'Payroll & compliance management', 'Quick mobilization (48-72 hrs)', 'Multi-state compliance expertise', 'Flexible engagement models'],
  },
  {
    id: 'executive-search',
    icon: Crown,
    title: 'Executive Search',
    tagline: 'Leadership talent for transformative roles.',
    color: 'from-purple-600 to-purple-800',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    desc: 'Specialized C-Suite and senior leadership search services. Our executive search team uses a research-led approach to identify, assess and engage passive candidates who deliver strategic impact.',
    features: ['C-Suite & VP level search', 'Confidential handling', 'Market intelligence reports', 'Psychometric assessments', 'Global candidate access'],
  },
  {
    id: 'hr-consulting',
    icon: Settings,
    title: 'HR Consulting',
    tagline: 'Strategic HR solutions for business growth.',
    color: 'from-green-600 to-green-800',
    bg: 'bg-green-50 dark:bg-green-900/20',
    desc: 'From HR policy design to performance management systems, our consulting services help organizations build robust HR frameworks that drive culture, productivity and compliance.',
    features: ['HR policy & handbook design', 'Performance management systems', 'HR process audits', 'Employee engagement programs', 'Organizational restructuring'],
  },
  {
    id: 'payroll',
    icon: DollarSign,
    title: 'Payroll Management',
    tagline: 'Accurate, compliant and timely payroll.',
    color: 'from-yellow-600 to-orange-600',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    desc: 'Comprehensive payroll outsourcing with full statutory compliance. We manage PF, ESI, TDS, PT and all statutory filings, ensuring error-free payroll delivery every month.',
    features: ['End-to-end payroll processing', 'PF, ESI, TDS, PT management', 'Full & final settlement', 'Payslip & Form 16 generation', 'Compliance audit support'],
  },
  {
    id: 'bulk-hiring',
    icon: Group,
    title: 'Bulk Hiring',
    tagline: 'Rapid large-scale talent acquisition.',
    color: 'from-pink-600 to-rose-700',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    desc: 'When you need to hire 50 to 5,000 employees fast, we deploy dedicated recruiting teams with customized assessment centres and walk-in drives for high-volume requirements.',
    features: ['Dedicated bulk hiring teams', 'Walk-in drive management', 'Assessment centre setup', 'Campus hiring programs', '500+ positions closed in 90 days'],
  },
  {
    id: 'it-hiring',
    icon: Monitor,
    title: 'IT Hiring',
    tagline: 'Specialized tech talent acquisition.',
    color: 'from-blue-600 to-indigo-700',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    desc: 'Dedicated IT recruitment vertical with deep technical expertise. Our IT recruiters speak the language of technology — from full-stack developers to data scientists, cloud architects to DevOps engineers.',
    features: ['Full-stack, mobile & cloud roles', 'Technical pre-screening', 'Niche skills sourcing', 'Contract-to-hire models', 'Product & startup hiring'],
  },
  {
    id: 'manufacturing-hiring',
    icon: Factory,
    title: 'Manufacturing Hiring',
    tagline: 'Shop floor to boardroom talent.',
    color: 'from-orange-600 to-amber-700',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    desc: 'Extensive experience in manufacturing recruitment across automotive, FMCG, pharma and industrial sectors. We understand shop floor requirements, quality standards and production dynamics.',
    features: ['Production & quality roles', 'Plant manager & GM level', 'Safety & EHS profiles', 'Apprentice & ITI hiring', 'Multi-plant campaigns'],
  },
  {
    id: 'bfsi-hiring',
    icon: Landmark,
    title: 'BFSI Hiring',
    tagline: 'Specialized banking & finance talent.',
    color: 'from-emerald-600 to-teal-700',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    desc: 'Dedicated banking, financial services and insurance recruitment with strong networks across NBFCs, private banks, insurance companies, and fintech firms.',
    features: ['Relationship manager profiles', 'Risk & compliance roles', 'Branch manager level', 'Fintech & insurtech hiring', 'Regulatory compliance awareness'],
  },
];

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className={className}>
      {children}
    </motion.div>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      {/* Hero */}
      <div className="hero-bg pt-32 pb-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-cyan-400 mb-4">What We Offer</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">
              Comprehensive <span className="gradient-text-light">HR Solutions</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              From permanent hiring to payroll management — we provide end-to-end talent and HR services
              tailored to your organization's unique needs.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services grid */}
      <section className="section-padding bg-gray-50 dark:bg-navy-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <Section key={service.id}>
                <div id={service.id} className="glass-card rounded-2xl p-6 card-hover group h-full flex flex-col">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${service.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                      <service.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy-950 dark:text-white mb-1">{service.title}</h3>
                  <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-3">{service.tagline}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">{service.desc}</p>
                  <ul className="space-y-1.5 mt-auto">
                    {service.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="container-custom">
          <Section className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-4xl font-bold text-navy-950 dark:text-white mb-4">
              Ready to get <span className="gradient-text">started?</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Let's discuss your hiring challenges. Our team will craft a customized solution that delivers results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">Get a Free Consultation <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/jobs" className="btn-secondary">View Open Jobs</Link>
            </div>
          </Section>
        </div>
      </section>
    </div>
  );
}
