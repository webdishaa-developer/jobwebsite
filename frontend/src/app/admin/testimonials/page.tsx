'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Star, X, Toggle } from 'lucide-react';
import toast from 'react-hot-toast';
import { testimonialsApi } from '@/lib/api';
import { Testimonial } from '@/types';
import { cn, timeAgo } from '@/lib/utils';

const EMPTY = { name: '', role: '', company: '', content: '', rating: 5, isActive: true, isFeatured: false };

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await testimonialsApi.getAll({});
      setTestimonials(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setFormData(EMPTY); setShowModal(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setFormData({ ...t }); setShowModal(true); };

  const handleSave = async () => {
    if (!formData.name || !formData.content) { toast.error('Name and content required'); return; }
    setSaving(true);
    try {
      if (editing) { await testimonialsApi.update(editing.id, formData); toast.success('Updated'); }
      else { await testimonialsApi.create(formData); toast.success('Created'); }
      setShowModal(false);
      fetch();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await testimonialsApi.delete(id); toast.success('Deleted'); setDeleteConfirm(null); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  const setField = (k: string, v: any) => setFormData((f: any) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950 dark:text-white">Testimonials</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{testimonials.length} testimonials</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4" /> Add Testimonial</button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-44 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-navy-800 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <div className="flex gap-1">
                  {t.isFeatured && <span className="badge bg-royal-100 dark:bg-royal-900/30 text-royal-700 dark:text-royal-400 text-xs">Featured</span>}
                  {!t.isActive && <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs">Inactive</span>}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">"{t.content}"</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-navy-800">
                <div>
                  <div className="font-semibold text-sm text-navy-950 dark:text-white">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}, {t.company}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-gray-400 hover:text-royal-600 hover:bg-royal-50 dark:hover:bg-royal-900/20 transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirm(t.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-navy-700">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-navy-800">
                <h2 className="font-display text-xl font-bold text-navy-950 dark:text-white">{editing ? 'Edit' : 'Add'} Testimonial</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Name *</label>
                    <input value={formData.name} onChange={e => setField('name', e.target.value)} className="form-input" placeholder="Rajesh Kumar" />
                  </div>
                  <div>
                    <label className="form-label">Role</label>
                    <input value={formData.role} onChange={e => setField('role', e.target.value)} className="form-input" placeholder="Software Engineer" />
                  </div>
                  <div>
                    <label className="form-label">Company</label>
                    <input value={formData.company} onChange={e => setField('company', e.target.value)} className="form-input" placeholder="TechCorp India" />
                  </div>
                  <div>
                    <label className="form-label">Rating (1-5)</label>
                    <input type="number" min="1" max="5" value={formData.rating} onChange={e => setField('rating', parseInt(e.target.value))} className="form-input" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Testimonial *</label>
                  <textarea value={formData.content} onChange={e => setField('content', e.target.value)} rows={4} className="form-input resize-none" placeholder="Write the testimonial..." />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={e => setField('isActive', e.target.checked)} className="w-4 h-4 text-royal-600 rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isFeatured} onChange={e => setField('isFeatured', e.target.checked)} className="w-4 h-4 text-royal-600 rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-navy-800">
                <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-navy-900 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-navy-700 shadow-2xl">
              <h3 className="font-display text-lg font-bold mb-2 text-navy-950 dark:text-white">Delete Testimonial?</h3>
              <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold">Delete</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
