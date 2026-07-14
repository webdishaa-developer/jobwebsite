'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Eye, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { updatesApi } from '@/lib/api';
import { cn, timeAgo } from '@/lib/utils';

const EMPTY = { title: '', excerpt: '', content: '', category: 'NEWS', imageUrl: '', author: 'Recluta Team', isPublished: false, tags: '' };
const CATEGORIES = ['NEWS', 'BLOG', 'ANNOUNCEMENT', 'PRESS_RELEASE'];

export default function AdminUpdatesPage() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await updatesApi.getAll({});
      setUpdates(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUpdates(); }, [fetchUpdates]);

  const openCreate = () => { setEditing(null); setFormData(EMPTY); setShowModal(true); };
  const openEdit = (u: any) => { setEditing(u); setFormData({ ...u }); setShowModal(true); };

  const handleSave = async () => {
    if (!formData.title || !formData.content) { toast.error('Title and content required'); return; }
    setSaving(true);
    try {
      if (editing) { await updatesApi.update(editing.id, formData); toast.success('Update saved'); }
      else { await updatesApi.create(formData); toast.success('Update created'); }
      setShowModal(false);
      fetchUpdates();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await updatesApi.delete(id); toast.success('Deleted'); setDeleteConfirm(null); fetchUpdates(); }
    catch { toast.error('Failed to delete'); }
  };

  const setField = (k: string, v: any) => setFormData((f: any) => ({ ...f, [k]: v }));

  const categoryColors: Record<string, string> = {
    NEWS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    BLOG: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    ANNOUNCEMENT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    PRESS_RELEASE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950 dark:text-white">Company Updates</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{updates.length} articles</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4" /> New Update</button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-navy-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Title</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Author</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Views</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Created</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-navy-800">
                    {[...Array(7)].map((_, j) => <td key={j} className="px-5 py-4"><div className="skeleton h-4 rounded" style={{ width: `${50 + j * 8}%` }} /></td>)}
                  </tr>
                ))
              ) : updates.map(u => (
                <tr key={u.id} className="border-b border-gray-50 dark:border-navy-800/50 hover:bg-gray-50/50 dark:hover:bg-navy-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-sm text-navy-950 dark:text-white line-clamp-1">{u.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{u.excerpt}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className={cn('badge text-xs', categoryColors[u.category])}>{u.category}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{u.author}</td>
                  <td className="px-5 py-4">
                    <span className={cn('badge text-xs', u.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400')}>
                      {u.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{u.views}</td>
                  <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{timeAgo(u.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-gray-400 hover:text-royal-600 hover:bg-royal-50 dark:hover:bg-royal-900/20 transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(u.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && updates.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <p className="font-semibold mb-2">No updates yet</p>
            <button onClick={openCreate} className="btn-primary text-sm mt-2">Create First Update</button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-navy-700 mb-10">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-navy-800">
                <h2 className="font-display text-xl font-bold text-navy-950 dark:text-white">{editing ? 'Edit' : 'New'} Update</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="form-label">Title *</label>
                  <input value={formData.title} onChange={e => setField('title', e.target.value)} className="form-input" placeholder="Article title..." />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Category</label>
                    <select value={formData.category} onChange={e => setField('category', e.target.value)} className="form-input">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Author</label>
                    <input value={formData.author} onChange={e => setField('author', e.target.value)} className="form-input" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Excerpt</label>
                  <textarea value={formData.excerpt} onChange={e => setField('excerpt', e.target.value)} rows={2} className="form-input resize-none" placeholder="Short description..." />
                </div>
                <div>
                  <label className="form-label">Content *</label>
                  <textarea value={formData.content} onChange={e => setField('content', e.target.value)} rows={8} className="form-input resize-none font-mono text-sm" placeholder="Full article content..." />
                </div>
                <div>
                  <label className="form-label">Tags (comma-separated)</label>
                  <input value={formData.tags} onChange={e => setField('tags', e.target.value)} className="form-input" placeholder="recruitment, india, jobs" />
                </div>
                <div>
                  <label className="form-label">Cover Image URL</label>
                  <input value={formData.imageUrl} onChange={e => setField('imageUrl', e.target.value)} className="form-input" placeholder="https://..." />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.isPublished} onChange={e => setField('isPublished', e.target.checked)} className="w-4 h-4 text-royal-600 rounded" />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish immediately</span>
                    <div className="text-xs text-gray-400">If unchecked, saved as draft</div>
                  </div>
                </label>
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
              <h3 className="font-display text-lg font-bold mb-2 text-navy-950 dark:text-white">Delete Update?</h3>
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
