"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import { Folder, Plus, LogOut, Loader2, PlaySquare } from 'lucide-react';

export default function Dashboard() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCollections();
  }, [router]);

  const fetchCollections = async () => {
    try {
      const res = await api.get('/collections');
      
      // Fetch progress for each collection
      const collectionsWithProgress = await Promise.all(
        res.data.map(async (c: any) => {
          try {
            const progressRes = await api.get(`/collections/${c._id}/progress`);
            return { ...c, progress: progressRes.data };
          } catch (e) {
            return { ...c, progress: { percentage: 0, totalVideos: 0, watchedVideos: 0 } };
          }
        })
      );
      
      setCollections(collectionsWithProgress);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    
    try {
      await api.post('/collections', { name: newCollectionName });
      setShowModal(false);
      setNewCollectionName('');
      fetchCollections();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="container">
      <header className="flex justify-between items-center mb-10 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <h1 className="page-title">My Learning Hub</h1>
          <p className="page-subtitle mb-0">Organize and track your YouTube tutorials</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={20} /> New Collection
          </button>
          <button onClick={handleLogout} className="btn btn-secondary" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {collections.length === 0 ? (
        <div className="glass-panel p-10 text-center flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
          <Folder size={64} className="text-secondary mb-4 opacity-50" />
          <h2 className="text-xl font-medium mb-2">No collections yet</h2>
          <p className="text-secondary mb-6">Create your first collection to start organizing videos.</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={20} /> Create Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {collections.map(c => (
            <Link href={`/collections/${c._id}`} key={c._id}>
              <div className="glass-card p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold truncate" title={c.name}>{c.name}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                    {c.category}
                  </span>
                </div>
                
                <div className="mt-auto pt-6">
                  <div className="flex justify-between text-sm mb-2 text-secondary">
                    <span>Progress</span>
                    <span>{c.progress?.percentage || 0}%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2 mb-2 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${c.progress?.percentage || 0}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-secondary mt-3">
                    <PlaySquare size={14} />
                    <span>{c.progress?.watchedVideos || 0} / {c.progress?.totalVideos || 0} videos watched</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-semibold mb-4">Create New Collection</h2>
            <form onSubmit={handleCreateCollection}>
              <div className="form-group">
                <label className="form-label">Collection Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g. React Mastery, Finance 101"
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
