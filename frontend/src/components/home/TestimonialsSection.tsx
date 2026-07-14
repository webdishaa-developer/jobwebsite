'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';
import { testimonialsApi } from '@/lib/api';
import { Testimonial } from '@/types';

function TestimonialCard({ testimonial, delay }: { testimonial: Testimonial; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-2xl p-6 card-hover h-full flex flex-col"
    >
      <Quote className="w-8 h-8 text-cyan-400/30 mb-4" />
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1 mb-4">
        "{testimonial.content}"
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-navy-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-royal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-sm text-navy-950 dark:text-white">{testimonial.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}, {testimonial.company}</div>
          </div>
        </div>
        <div className="flex">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    testimonialsApi.getAll({ featured: 'true' })
      .then((res) => setTestimonials(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section ref={ref} className="section-padding bg-gray-50 dark:bg-navy-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-3 font-mono">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy-950 dark:text-white mb-4">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Don't just take our word for it — hear from the people who've experienced the Recluta difference.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 space-y-3">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-5/6 rounded" />
                <div className="skeleton h-4 w-4/5 rounded" />
                <div className="skeleton h-4 w-3/5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} delay={i * 0.1} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
