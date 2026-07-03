"use client";

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { KeyRound, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <div className="glass-panel p-8 w-full" style={{ maxWidth: '400px', padding: '2rem' }}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 mb-4">
            <KeyRound size={24} />
          </div>
          <h1 className="page-title" style={{ fontSize: '1.8rem' }}>Reset Password</h1>
          <p className="text-secondary">Enter your email to receive a reset link</p>
        </div>

        {error && <div className="p-3 mb-4 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">{error}</div>}
        {message && <div className="p-3 mb-4 rounded bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading} style={{ background: 'var(--accent-warning)' }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-secondary hover:text-white font-medium flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
