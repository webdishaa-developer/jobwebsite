'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, Briefcase, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/api';
import { ThemeProvider } from '@/components/shared/ThemeProvider';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await authApi.login(data.email, data.password);
      const { token } = res.data.data;
      Cookies.set('recluta_token', token, { expires: 7, secure: true, sameSite: 'strict' });
      localStorage.setItem('recluta_token', token);
      toast.success('Welcome back!');
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-mesh opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-dark rounded-3xl p-8 border border-white/10 shadow-navy">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-600 to-cyan-500 mb-4 shadow-glow">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">Admin Portal</h1>
            <p className="text-gray-400 text-sm">Recluta Talent Management</p>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 mb-6">
            <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="text-xs text-gray-400">Secure admin access — authorized personnel only</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@reclutasolutions.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
              {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-royal-600 to-royal-800 hover:from-royal-700 hover:to-royal-900 text-white font-semibold transition-all duration-300 disabled:opacity-60 mt-2 shadow-md hover:shadow-royal-600/30"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            © {new Date().getFullYear()} Recluta Talent Management Pvt Ltd
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <LoginForm />
    </ThemeProvider>
  );
}
