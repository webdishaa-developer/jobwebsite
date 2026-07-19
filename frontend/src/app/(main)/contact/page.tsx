'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Clock, CheckCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactApi } from '@/lib/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await contactApi.submit(data);
      setSubmitted(true);
      reset();
      toast.success('Message sent! We\'ll get back to you shortly.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      {/* Hero */}
      <div className="hero-bg pt-32 pb-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-cyan-400 mb-4">Get In Touch</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
              Let's <span className="gradient-text-light">Connect</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              Whether you're looking to hire top talent or find your dream job, our team is ready to help.
            </p>
          </motion.div>
        </div>
      </div>

      <section className="section-padding bg-gray-50 dark:bg-navy-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-5">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="font-display text-2xl font-bold text-navy-950 dark:text-white mb-2">Contact Information</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Reach out to us through any of these channels.</p>
              </motion.div>

              {[
                {
                  icon: MapPin, title: 'Office Address',
                  content: '1st Floor, Kuldeep Bhavan, Above S K Sales , Near Raman Mandir MargFafadih Raipur (C.G.) 492001',
                  color: 'text-royal-500'
                },
                {
                  icon: Phone, title: 'Phone',
                  content: '+91 95222 99615 ,  07714906561',
                  href: 'tel:+919522299615',
                  color: 'text-green-500'
                },
                {
                  icon: Mail, title: 'Email',
                  content: 'info@reclutasolutions.in',
                  href: 'mailto:info@reclutasolutions.in',
                  color: 'text-cyan-500',
                  sub: 'hemanand.saha@gmail.com',
                  subHref: 'mailto:hemanand.saha@gmail.com'
                },
                {
                  icon: Clock, title: 'Business Hours',
                  content: 'Mon – Sat: 9:00 AM – 7:00 PM',
                  sub: 'Sunday: Closed',
                  color: 'text-yellow-500'
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="glass-card rounded-xl p-4 flex items-start gap-4"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{item.title}</div>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-medium text-navy-950 dark:text-white hover:text-royal-600 dark:hover:text-cyan-400 transition-colors">{item.content}</a>
                    ) : (
                      <div className="text-sm font-medium text-navy-950 dark:text-white">{item.content}</div>
                    )}
                    {item.sub && (
                      item.subHref ? (
                        <a href={item.subHref} className="text-xs text-gray-500 dark:text-gray-400 hover:text-royal-600 dark:hover:text-cyan-400 block mt-0.5 transition-colors">{item.sub}</a>
                      ) : (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.sub}</div>
                      )
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Map embed */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl overflow-hidden h-48 border border-gray-200 dark:border-navy-700">
                <iframe
                  title="Recluta Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.234!2d82.15!3d22.09!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDA1JzI0LjAiTiA4MsKwMDknMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </motion.div>
            </div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass-card rounded-2xl p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-navy-950 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="btn-secondary">Send Another Message</button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-2xl font-bold text-navy-950 dark:text-white mb-1">Send Us a Message</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Fill out the form and our team will respond within 24 hours.</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Full Name *</label>
                          <input {...register('name')} className="form-input" placeholder="John Doe" />
                          {errors.name && <span className="form-error">{errors.name.message}</span>}
                        </div>
                        <div>
                          <label className="form-label">Email *</label>
                          <input {...register('email')} type="email" className="form-input" placeholder="john@company.com" />
                          {errors.email && <span className="form-error">{errors.email.message}</span>}
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Phone</label>
                          <input {...register('phone')} className="form-input" placeholder="+91 98765 43210" />
                        </div>
                        <div>
                          <label className="form-label">Subject *</label>
                          <select {...register('subject')} className="form-input">
                            <option value="">Select subject</option>
                            <option>Recruitment Services</option>
                            <option>Executive Search</option>
                            <option>Contract Staffing</option>
                            <option>HR Consulting</option>
                            <option>Payroll Services</option>
                            <option>Job Inquiry</option>
                            <option>Partnership</option>
                            <option>Other</option>
                          </select>
                          {errors.subject && <span className="form-error">{errors.subject.message}</span>}
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Message *</label>
                        <textarea
                          {...register('message')}
                          rows={5}
                          className="form-input resize-none"
                          placeholder="Describe your requirement or inquiry in detail..."
                        />
                        {errors.message && <span className="form-error">{errors.message.message}</span>}
                      </div>
                      <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
                        {isSubmitting ? 'Sending...' : <>Send Message <Send className="w-4 h-4" /></>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
