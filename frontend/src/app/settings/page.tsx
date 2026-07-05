"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';
import { ArrowLeft, PlaySquare, Camera, Loader2, Save, KeyRound, CheckCircle2, User } from 'lucide-react';
import api from '@/lib/axios';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setName(res.data.name || '');
        setEmail(res.data.email || '');
        setProfilePicture(res.data.profilePicture || '');
      } catch (err) {
        console.error('Error fetching user', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    
    if (localStorage.getItem('token')) {
      fetchUser();
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setProfilePicture(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ text: '', type: '' });
    
    try {
      await api.put('/auth/profile', { name, profilePicture });
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
      // Trigger a re-render or custom event if needed so UserMenu updates, 
      // but easiest way for now is just show success message. UserMenu will update on next load.
      // We could also dispatch an event, but let's keep it simple.
    } catch (err) {
      interface ApiError {
        response?: { data?: { message?: string } };
      }
      const apiError = err as ApiError;
      setProfileMsg({ text: apiError.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMsg({ text: '', type: '' });
    
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match', type: 'error' });
      setSavingPassword(false);
      return;
    }
    
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setPasswordMsg({ text: 'Password updated successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      interface ApiError {
        response?: { data?: { message?: string } };
      }
      const apiError = err as ApiError;
      setPasswordMsg({ text: apiError.response?.data?.message || 'Failed to update password', type: 'error' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black transition-colors duration-300">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  const defaultInitial = name ? name.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans transition-colors duration-300 relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-20%] w-[800px] h-[600px] bg-emerald-600/10 dark:bg-emerald-600/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-colors duration-300"></div>
      </div>
      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none transition-colors duration-300"></div>

      {/* Header */}
      <header className="relative z-40 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors shadow-sm group">
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/" className="hidden sm:flex items-center gap-3 group outline-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <PlaySquare size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">FocusTube</h1>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider group-hover:text-emerald-500/70 transition-colors">Learning Hub</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <User className="text-emerald-500" size={32} />
            Account Settings
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your profile information and security preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Section */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl transition-colors duration-300 relative overflow-hidden mb-8">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-50"></div>
              
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Profile Information</h3>
              
              <form onSubmit={handleProfileSubmit}>
                <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {profilePicture ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-lg" />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-5xl shadow-lg border-4 border-white dark:border-zinc-800">
                          {defaultInitial}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={32} />
                      </div>
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                      Change Picture
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>
                  
                  <div className="flex-1 w-full space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        disabled
                        className="w-full bg-zinc-100 dark:bg-zinc-900 border border-transparent text-zinc-500 dark:text-zinc-500 text-sm rounded-xl px-4 py-3 cursor-not-allowed" 
                      />
                      <p className="text-xs text-zinc-500 ml-1">Email cannot be changed.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Display Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 shadow-sm" 
                      />
                    </div>
                  </div>
                </div>

                {profileMsg.text && (
                  <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium ${profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                    {profileMsg.type === 'success' && <CheckCircle2 size={18} />}
                    {profileMsg.text}
                  </div>
                )}

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={savingProfile}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
            
            {/* Security Section */}
            <div className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl transition-colors duration-300 relative overflow-hidden">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <KeyRound className="text-zinc-400" size={20} />
                Security
              </h3>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 shadow-sm" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 shadow-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 shadow-sm" 
                    />
                  </div>
                </div>

                {passwordMsg.text && (
                  <div className={`p-4 rounded-xl mt-4 flex items-center gap-3 text-sm font-medium ${passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                    {passwordMsg.type === 'success' && <CheckCircle2 size={18} />}
                    {passwordMsg.text}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    disabled={savingPassword}
                    className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-70 disabled:cursor-not-allowed text-sm font-semibold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {savingPassword && <Loader2 size={16} className="animate-spin" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Info Sidebar */}
          <div className="hidden md:block">
            <div className="bg-white/50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 rounded-3xl p-6 text-sm text-zinc-600 dark:text-zinc-400">
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 text-base">Why customize?</h4>
              <p className="mb-4">Adding a profile picture and your name makes FocusTube feel more like home. It helps personalize your learning experience.</p>
              
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 text-base">Security Tips</h4>
              <ul className="list-disc pl-4 space-y-2">
                <li>Use a strong password with a mix of letters, numbers, and symbols.</li>
                <li>Never share your password with anyone.</li>
                <li>Update your password regularly to keep your account secure.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
