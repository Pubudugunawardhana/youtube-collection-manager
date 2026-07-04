"use client";

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { ArrowLeft, Plus, Trash2, Clock, Loader2, PlayCircle, CheckCircle2, PlaySquare, X, ChevronDown, Check } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';

interface Video {
  _id: string;
  title: string;
  youtubeId: string;
  thumbnail?: string;
  duration?: string;
  status: string;
}

interface Collection {
  _id: string;
  name: string;
  category?: string;
}

const StatusDropdown = ({ status, onChange }: { status: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ['To Watch', 'Watching', 'Watched'];

  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [isOpen]);

  const baseColor = status === 'Watched' 
    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
    : status === 'Watching'
    ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-black/5 dark:border-white/10';

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${baseColor} hover:brightness-95 dark:hover:brightness-110`}
      >
        {status}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-36 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5 flex flex-col gap-0.5">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  status === opt 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {opt}
                {status === opt && <Check size={14} className="text-emerald-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CollectionDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchVideos = useCallback(async () => {
    try {
      const res = await api.get(`/videos/collection/${id}`);
      setVideos(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const fetchData = useCallback(async () => {
    try {
      const colRes = await api.get('/collections');
      const currentCol = colRes.data.find((c: Collection) => c._id === id);
      if (currentCol) {
        setCollection(currentCol);
      }
      
      await fetchVideos();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, fetchVideos]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [id, router, fetchData]);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim()) return;
    
    setAdding(true);
    setError('');
    
    try {
      await api.post('/videos', { url: newVideoUrl, collectionId: id });
      setNewVideoUrl('');
      setShowAddModal(false);
      await fetchData(); 
    } catch (err) {
      interface ApiError {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to add video. Check URL.');
    } finally {
      setAdding(false);
    }
  };

  const updateStatus = async (videoId: string, newStatus: string) => {
    try {
      await api.put(`/videos/${videoId}/status`, { status: newStatus });
      fetchVideos();
    } catch {
      console.error('Failed to update status');
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to remove this video?')) return;
    try {
      await api.delete(`/videos/${videoId}`);
      fetchVideos();
    } catch {
      console.error('Failed to delete video');
    }
  };

  const deleteCollection = async () => {
    if (!confirm('Are you sure you want to delete this entire collection?')) return;
    try {
      await api.delete(`/collections/${id}`);
      router.push('/dashboard');
    } catch {
      console.error('Failed to delete collection');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black transition-colors duration-300">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  const total = videos.length;
  const watched = videos.filter(v => v.status === 'Watched').length;
  const progressPercent = total === 0 ? 0 : Math.round((watched / total) * 100);

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
            <Link href="/" className="hidden sm:block group outline-none">
              <h1 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">FocusTube</h1>
              <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider group-hover:text-emerald-500/70 transition-colors">Learning Hub</p>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Collection Header Panel */}
        <div className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-3xl p-8 mb-10 shadow-xl backdrop-blur-xl transition-colors duration-300 relative overflow-hidden">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{collection?.name || 'Collection'}</h2>
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {collection?.category || 'General'}
                </span>
              </div>
              
              <div className="flex items-center gap-5 text-sm font-medium">
                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                  <PlayCircle size={16} /> {total} Videos
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} /> {watched} Completed
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0">
              <button 
                onClick={() => setShowAddModal(true)} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl px-5 py-3 transition-all flex items-center justify-center gap-2 shadow-md flex-1 sm:flex-none"
              >
                <Plus size={16} /> Add Video
              </button>
              <button 
                onClick={deleteCollection} 
                className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 text-sm font-semibold rounded-xl px-5 py-3 transition-all flex items-center justify-center gap-2 shadow-sm flex-1 sm:flex-none"
                title="Delete Collection"
              >
                <Trash2 size={16} /> <span className="sm:hidden">Delete</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
            <div className="flex justify-between items-end mb-2 text-sm font-medium">
              <span className="text-zinc-500 dark:text-zinc-400">Collection Progress</span>
              <span className="text-zinc-900 dark:text-white text-lg">{progressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full h-3 overflow-hidden shadow-inner border border-black/5 dark:border-white/5">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-3xl p-12 shadow-xl flex flex-col items-center justify-center backdrop-blur-xl transition-colors duration-300 min-h-[300px]">
            <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center mb-6 shadow-inner">
              <PlaySquare size={32} className="text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">This collection is empty</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm text-center">Paste a YouTube URL to add your first video and start learning.</p>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 text-sm font-semibold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Plus size={16} /> Add First Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {videos.map(video => (
              <div key={video._id} className="group bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-xl flex flex-col">
                <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-b border-black/5 dark:border-white/5 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={video.thumbnail || `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`} 
                    alt={video.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {video.duration && video.duration !== '00:00' && (
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 shadow-lg border border-white/10">
                      <Clock size={12} /> {video.duration}
                    </div>
                  )}
                  
                  <a 
                    href={`https://youtube.com/watch?v=${video.youtubeId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <div className="bg-emerald-600/90 backdrop-blur-md rounded-full p-4 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-emerald-500 hover:scale-110">
                      <PlayCircle size={28} className="text-white fill-white/20" />
                    </div>
                  </a>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-[15px] mb-4 line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" title={video.title}>
                    {video.title}
                  </h3>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                    <StatusDropdown status={video.status} onChange={(val) => updateStatus(video._id, val)} />
                    
                    <button 
                      onClick={() => deleteVideo(video._id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/30 border border-transparent transition-all"
                      title="Remove video"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAddModal(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 border border-emerald-200 dark:border-emerald-500/20">
              <PlaySquare size={24} />
            </div>
            
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Add YouTube Video</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Paste a YouTube link to add it to your collection.</p>
            
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-500/20 flex items-start gap-3">
                <div className="mt-0.5"><X size={16} className="text-red-500" /></div>
                <div>{error}</div>
              </div>
            )}
            
            <form onSubmit={handleAddVideo}>
              <div className="space-y-1.5 mb-8">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">YouTube URL</label>
                <input 
                  type="url" 
                  className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 shadow-sm dark:shadow-inner" 
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  autoFocus
                  required
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-xl px-4 py-3 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
                  disabled={adding}
                >
                  {adding ? (
                    <><Loader2 className="animate-spin" size={18} /> Adding...</>
                  ) : (
                    'Add Video'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
