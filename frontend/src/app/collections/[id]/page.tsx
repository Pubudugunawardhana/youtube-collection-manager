"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { ArrowLeft, Plus, Trash2, ExternalLink, Clock, Loader2, PlayCircle, CheckCircle2 } from 'lucide-react';

export default function CollectionDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const [videos, setVideos] = useState<any[]>([]);
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [id, router]);

  const fetchData = async () => {
    try {
      // Get all collections to find the current one (MVP approach)
      const colRes = await api.get('/collections');
      const currentCol = colRes.data.find((c: any) => c._id === id);
      if (currentCol) {
        setCollection(currentCol);
      }
      
      await fetchVideos();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await api.get(`/videos/collection/${id}`);
      setVideos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim()) return;
    
    setAdding(true);
    setError('');
    
    try {
      await api.post('/videos', { url: newVideoUrl, collectionId: id });
      setNewVideoUrl('');
      setShowAddModal(false);
      
      // Refresh the page data
      await fetchData(); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add video. Check URL.');
    } finally {
      setAdding(false);
    }
  };

  const updateStatus = async (videoId: string, newStatus: string) => {
    try {
      await api.put(`/videos/${videoId}/status`, { status: newStatus });
      fetchVideos();
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to remove this video?')) return;
    try {
      await api.delete(`/videos/${videoId}`);
      fetchVideos();
    } catch (err) {
      console.error('Failed to delete video');
    }
  };

  const deleteCollection = async () => {
    if (!confirm('Are you sure you want to delete this entire collection?')) return;
    try {
      await api.delete(`/collections/${id}`);
      router.push('/');
    } catch (err) {
      console.error('Failed to delete collection');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  // Calculate progress on the fly based on current videos
  const total = videos.length;
  const watched = videos.filter(v => v.status === 'Watched').length;
  const progressPercent = total === 0 ? 0 : Math.round((watched / total) * 100);

  return (
    <div className="container">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <header className="glass-panel p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{collection?.name || 'Collection'}</h1>
              <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                {collection?.category || 'General'}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-secondary text-sm mt-4">
              <div className="flex items-center gap-1">
                <PlayCircle size={16} /> {total} Videos
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 size={16} /> {watched} Completed
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary flex-1 md:flex-none">
              <Plus size={20} /> Add Video
            </button>
            <button onClick={deleteCollection} className="btn btn-danger" title="Delete Collection">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Progress bar background in header */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
          <div 
            className="h-full bg-blue-500 transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
          ></div>
        </div>
      </header>

      {videos.length === 0 ? (
        <div className="glass-panel p-10 text-center flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
            <Plus size={32} />
          </div>
          <h2 className="text-xl font-medium mb-2">This collection is empty</h2>
          <p className="text-secondary mb-6">Paste a YouTube URL to add your first video.</p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            Add Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(video => (
            <div key={video._id} className="glass-card overflow-hidden flex flex-col group">
              <div className="relative aspect-video bg-black">
                <img 
                  src={video.thumbnail || `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} 
                  alt={video.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                {video.duration && video.duration !== '00:00' && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                    <Clock size={12} /> {video.duration}
                  </div>
                )}
                
                <a 
                  href={`https://youtube.com/watch?v=${video.youtubeId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-all"
                >
                  <div className="bg-blue-600 rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                    <ExternalLink size={24} color="white" />
                  </div>
                </a>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-medium text-sm mb-4 line-clamp-2 leading-snug" title={video.title}>
                  {video.title}
                </h3>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                  <select 
                    className={`text-xs px-3 py-1.5 rounded-full appearance-none cursor-pointer border ${
                      video.status === 'Watched' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : video.status === 'Watching'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-white/10 text-white border-white/20'
                    }`}
                    value={video.status}
                    onChange={(e) => updateStatus(video._id, e.target.value)}
                  >
                    <option value="To Watch" className="bg-slate-800 text-white">To Watch</option>
                    <option value="Watching" className="bg-slate-800 text-white">Watching</option>
                    <option value="Watched" className="bg-slate-800 text-white">Watched</option>
                  </select>
                  
                  <button 
                    onClick={() => deleteVideo(video._id)}
                    className="p-1.5 text-secondary hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-semibold mb-4">Add YouTube Video</h2>
            
            {error && <div className="p-3 mb-4 rounded bg-red-500/10 text-red-400 text-sm border border-red-500/20">{error}</div>}
            
            <form onSubmit={handleAddVideo}>
              <div className="form-group">
                <label className="form-label">YouTube URL</label>
                <input 
                  type="url" 
                  className="form-input" 
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={adding}>
                  {adding ? (
                    <><Loader2 className="animate-spin" size={18} /> Fetching...</>
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
