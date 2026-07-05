"use client";

import Link from 'next/link';
import { 
  PlaySquare, 
  Folder, 
  BarChart3, 
  Layout, 
  Zap, 
  Sparkles, 
  Link2, 
  Check, 
  RotateCcw,
  Video,
  Clock,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [watched, setWatched] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveVideo = () => {
    setIsSaving(true);
  };

  useEffect(() => {
    if (!isSaving) return;
    const timer = setTimeout(() => {
      setIsSaving(false);
      setDemoStep(2);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isSaving]);

  const handleResetDemo = () => {
    setWatched(false);
    setDemoStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-zinc-50 dark:bg-black font-sans selection:bg-purple-500/30 selection:text-purple-900 dark:selection:text-purple-200 transition-colors duration-300">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-20%] w-[800px] h-[600px] bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-colors duration-300"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-colors duration-300"></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none transition-colors duration-300"></div>

      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/80 dark:bg-black/60 backdrop-blur-xl border-zinc-200 dark:border-white/10 py-3' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center shadow-md dark:shadow-lg border border-black/5 dark:border-white/10 group-hover:border-black/10 dark:group-hover:border-white/20 transition-colors">
              <PlaySquare size={14} className="text-zinc-800 dark:text-white" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">FocusTube</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-5">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="hidden sm:flex h-9 px-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium items-center justify-center hover:scale-105 transition-transform">
                  Dashboard
                </Link>
                <UserMenu />
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium text-sm transition-colors">
                  Log In
                </Link>
                <Link href="/register" className="h-9 px-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium flex items-center justify-center hover:scale-105 transition-transform">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col relative z-10 w-full max-w-6xl mx-auto mt-32 mb-10">
        <section className="px-6 flex flex-col items-center justify-center text-center w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-zinc-600 dark:text-zinc-300 text-xs font-medium mb-8 backdrop-blur-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-default">
            <Zap size={12} className="text-purple-600 dark:text-purple-400" />
            <span>Master Your YouTube Learning</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold tracking-tighter leading-[1.05] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-white/40 max-w-4xl">
            Turn YouTube Chaos into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">Structured Knowledge</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed font-light">
            Curate, organize, and track your progress through educational videos. Stop getting distracted by algorithms and start achieving your learning goals.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-24 justify-center items-center w-full sm:w-auto">
            <Link href={isAuthenticated ? "/dashboard" : "/register"} className="h-12 px-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold flex items-center justify-center transition-transform hover:scale-105 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-xl dark:shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] w-full sm:w-auto">
              {isAuthenticated ? "Go to Dashboard" : "Start Organizing Free"}
            </Link>
            <a href="#demo" className="h-12 px-8 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white font-medium flex items-center justify-center backdrop-blur-md transition-colors hover:bg-black/10 dark:hover:bg-white/10 w-full sm:w-auto gap-2 group">
              View Live Demo
              <ChevronRight size={16} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </a>
          </div>
        </section>

        {/* Interactive Product Demo / Mockup Graphic Section */}
        <section id="demo" className="py-12 px-6 w-full scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
              Interactive Dashboard Demo
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm">
              Experience the 3-step FocusTube workflow inside our simulated sandbox.
            </p>
          </div>
          
          {/* Demo Step Navigation */}
          <div role="tablist" className="flex justify-center gap-2 mb-8 w-full max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                role="tab"
                aria-selected={demoStep === step}
                aria-controls={`demo-step-${step}`}
                id={`demo-tab-${step}`}
                onClick={() => {
                  setDemoStep(step);
                  if (step < 3) setWatched(false);
                }}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold border transition-all text-center ${
                  demoStep === step
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white shadow-md dark:shadow-[0_0_15px_-5px_rgba(255,255,255,0.5)]'
                    : 'bg-black/5 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border-black/10 dark:border-white/10 hover:text-zinc-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                {step === 1 ? '1. Add' : step === 2 ? '2. Categorize' : '3. Track'}
              </button>
            ))}
          </div>

          {/* Simulated Browser Frame */}
          <div className="w-full max-w-5xl mx-auto bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl relative glass-panel transition-colors duration-300">
            {/* Browser Header / Controls */}
            <div className="bg-zinc-100/80 dark:bg-zinc-900/50 px-4 py-3 border-b border-black/5 dark:border-white/10 flex items-center gap-4 backdrop-blur-md transition-colors duration-300">
              {/* OS Window Control Dots */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
              </div>
              {/* Address Bar */}
              <div className="flex-1 max-w-lg mx-auto bg-white dark:bg-black/50 rounded-lg py-1.5 px-4 border border-black/5 dark:border-white/10 text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center font-mono shadow-sm dark:shadow-inner transition-colors duration-300">
                <span className="text-zinc-400 dark:text-zinc-600 mr-1">https://</span>focustube.app/dashboard
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="flex min-h-[450px] text-zinc-700 dark:text-zinc-300 relative transition-colors duration-300">
              {/* Sidebar (desktop only) */}
              <aside className="w-56 bg-zinc-50/80 dark:bg-zinc-950/80 p-5 border-r border-black/5 dark:border-white/10 hidden md:flex flex-col gap-6 transition-colors duration-300">
                <div className="flex items-center gap-2.5 px-1">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-900 flex items-center justify-center border border-black/10 dark:border-white/20">
                    <PlaySquare size={12} className="text-zinc-900 dark:text-white" />
                  </div>
                  <span className="font-semibold text-sm text-zinc-900 dark:text-white tracking-tight">FocusTube</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold px-1 mb-2">Library</span>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/10 text-zinc-900 dark:text-white text-xs font-medium cursor-default transition-colors duration-300">
                    <Layout size={14} className="text-zinc-700 dark:text-zinc-300" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-200 text-xs font-medium cursor-pointer transition-colors">
                    <Folder size={14} className="text-zinc-400 dark:text-zinc-500" />
                    <span>Collections</span>
                  </div>
                </div>

                <div className="mt-auto p-4 bg-gradient-to-b from-purple-500/5 dark:from-purple-500/10 to-transparent border border-purple-200 dark:border-purple-500/20 rounded-xl text-[10px] text-purple-700 dark:text-purple-200/70 leading-relaxed relative overflow-hidden transition-colors duration-300">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 dark:bg-purple-500/20 blur-xl rounded-full"></div>
                  <span className="text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-1.5 mb-1.5 relative z-10">
                    <Sparkles size={12} className="text-purple-600 dark:text-purple-400" />
                    Focus Mode
                  </span>
                  <span className="relative z-10">No algorithms. No sidebars. Pure learning.</span>
                </div>
              </aside>

              {/* Main Workspace content */}
              <div className="flex-1 p-8 flex flex-col justify-center items-center bg-zinc-100/50 dark:bg-zinc-950/40 relative transition-colors duration-300">
                
                {/* Step 1: Input URL */}
                {demoStep === 1 && (
                  <div id="demo-step-1" role="tabpanel" aria-labelledby="demo-tab-1" className="w-full max-w-md mx-auto text-center space-y-6 animate-fade-in">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 flex items-center justify-center mx-auto text-zinc-500 dark:text-zinc-400 shadow-md dark:shadow-xl relative overflow-hidden transition-colors duration-300">
                      <div className="absolute inset-0 bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent"></div>
                      <Link2 size={24} className="relative z-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white transition-colors duration-300">Save a Learning Video</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-300">Paste any YouTube URL to organize and strip distractions.</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        readOnly
                        value="https://www.youtube.com/watch?v=Ke90Tje7VS0"
                        className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-sm rounded-xl px-4 py-3 outline-none font-mono text-center shadow-sm dark:shadow-inner transition-colors duration-300"
                      />
                      <button
                        onClick={handleSaveVideo}
                        disabled={isSaving}
                        className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl px-4 py-3 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 border border-transparent dark:border-white disabled:opacity-80 disabled:cursor-wait shadow-md dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                            <span>Analyzing content...</span>
                          </>
                        ) : (
                          <>
                            <span>Save Video</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Categorization */}
                {demoStep === 2 && (
                  <div id="demo-step-2" role="tabpanel" aria-labelledby="demo-tab-2" className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 transition-colors duration-300">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white transition-colors duration-300">Smart Auto-Categorization</h3>
                        <p className="text-xs text-zinc-500 mt-1">Video scanned and categorized automatically.</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-[10px] font-bold border border-purple-200 dark:border-purple-500/20 tracking-wide uppercase transition-colors duration-300">
                        Next.js Dev
                      </span>
                    </div>

                    <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl p-4 flex gap-4 items-center shadow-md dark:shadow-lg group hover:border-black/20 dark:hover:border-white/20 transition-colors duration-300">
                      <div className="w-24 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-black/5 dark:border-white/5 transition-colors duration-300">
                        <Video size={20} className="text-zinc-400 dark:text-zinc-600" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white truncate transition-colors duration-300">Next.js 15 App Router Crash Course</h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate transition-colors duration-300">React Server Components, Server Actions & caching</p>
                        <div className="flex gap-3 items-center mt-1">
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-md transition-colors duration-300">
                            <Clock size={10} /> 45 mins
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-4">
                      <button
                        onClick={() => setDemoStep(3)}
                        className="bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white text-sm font-semibold rounded-full px-6 py-2.5 hover:bg-black/10 dark:hover:bg-white/10 transition-all border border-black/10 dark:border-white/10 shadow-sm dark:shadow-lg flex items-center gap-2 mx-auto group"
                      >
                        Next Step: Track Progress
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Track Completion Progress */}
                {demoStep === 3 && (
                  <div id="demo-step-3" role="tabpanel" aria-labelledby="demo-tab-3" className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 transition-colors duration-300">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white transition-colors duration-300">Interactive Progress</h3>
                        <p className="text-xs text-zinc-500 mt-1">Track playlists and visualize your learning.</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold tracking-wide uppercase transition-colors duration-300">
                        Path: Next.js
                      </span>
                    </div>

                    <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl p-5 space-y-5 shadow-md dark:shadow-lg transition-colors duration-300">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium transition-colors duration-300">
                          {watched ? '3 of 3 videos completed' : '2 of 3 videos completed'}
                        </span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white transition-colors duration-300">
                          {watched ? '100%' : '66%'}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div 
                        role="progressbar"
                        aria-valuenow={watched ? 100 : 66}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5 shadow-inner transition-colors duration-300"
                      >
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out relative"
                          style={{ width: watched ? '100%' : '66%' }}
                        >
                          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>

                      {/* Sub-items list */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-600 dark:text-zinc-400 transition-colors duration-300">
                          <span className="truncate">1. React 19 Fundamentals</span>
                          <span className="text-[10px] flex items-center gap-1 text-zinc-500 font-medium"><Check size={12} className="text-emerald-500" /> Done</span>
                        </div>
                        <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-600 dark:text-zinc-400 transition-colors duration-300">
                          <span className="truncate">2. Tailwind CSS v4 Guide</span>
                          <span className="text-[10px] flex items-center gap-1 text-zinc-500 font-medium"><Check size={12} className="text-emerald-500" /> Done</span>
                        </div>
                        
                        {/* Interactive watching task */}
                        <div className={`flex items-center justify-between text-xs p-3 rounded-xl border transition-all duration-300 ${
                          watched 
                            ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 text-zinc-600 dark:text-zinc-400' 
                            : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/20 text-zinc-900 dark:text-white shadow-sm dark:shadow-[0_0_15px_-5px_rgba(255,255,255,0.1)]'
                        }`}>
                          <span className="font-medium truncate flex-1 pr-3">3. Next.js 15 App Router Crash Course</span>
                          
                          <label className="flex items-center gap-2 cursor-pointer select-none flex-shrink-0 group">
                            <input 
                              type="checkbox"
                              checked={watched}
                              onChange={(e) => setWatched(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-900 dark:peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-offset-black ${
                              watched 
                                ? 'bg-emerald-500 border-emerald-500 text-white dark:text-black' 
                                : 'border-zinc-300 dark:border-zinc-500 bg-zinc-50 dark:bg-black group-hover:border-zinc-500 dark:group-hover:border-white'
                            }`}>
                              {watched && <Check size={10} strokeWidth={3} />}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${watched ? 'text-emerald-600 dark:text-emerald-500' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>
                              {watched ? 'Watched' : 'Mark'}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Celebration Banner */}
                    {watched && (
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-center animate-fade-in space-y-1.5 shadow-sm dark:shadow-lg transition-colors duration-300">
                        <p className="font-bold text-sm flex items-center justify-center gap-2">
                          <span>🎉</span> Collection Completed!
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-500/80">You&apos;ve mastered Next.js Development distraction-free.</p>
                        <button
                          onClick={handleResetDemo}
                          className="mt-3 text-[10px] font-bold text-emerald-700 dark:text-white bg-emerald-100 dark:bg-white/10 hover:bg-emerald-200 dark:hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 mx-auto"
                        >
                          <RotateCcw size={10} /> Start Demo Again
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Refined Feature Cards Section */}
        <section className="py-24 px-6 relative z-10 w-full mt-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white transition-colors duration-300">
              Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-400 dark:from-zinc-300 dark:to-zinc-500">learn better</span>.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-sm md:text-base font-light transition-colors duration-300">
              FocusTube replaces addictive recommendation feeds with a dedicated environment engineered for deep work.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="glass-card p-8 flex flex-col min-h-[260px] group">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border border-black/5 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm dark:shadow-inner group-hover:border-purple-300 dark:group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)] dark:group-hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)] transition-all">
                <Folder className="text-zinc-500 dark:text-zinc-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white transition-colors duration-300">Smart Collections</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light transition-colors duration-300">
                Group your saved videos into clean folders. Our automated keyword analyzer automatically flags topics like React, TypeScript, or system design.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 flex flex-col min-h-[260px] group">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border border-black/5 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm dark:shadow-inner group-hover:border-blue-300 dark:group-hover:border-blue-500/30 group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)] dark:group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] transition-all">
                <Layout className="text-zinc-500 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white transition-colors duration-300">Distraction-Free UI</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light transition-colors duration-300">
                Say goodbye to sidebars, comments, and autoplays. View your saved videos in a minimized, beautiful UI optimized for absolute concentration.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 flex flex-col min-h-[260px] group">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border border-black/5 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm dark:shadow-inner group-hover:border-emerald-300 dark:group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)] dark:group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] transition-all">
                <BarChart3 className="text-zinc-500 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white transition-colors duration-300">Progress Tracking</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light transition-colors duration-300">
                Mark videos as completed and visualize your collection completion rates. Build momentum as you turn playlists into badges of honor.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-black/5 dark:border-white/5 relative z-10 w-full mt-auto bg-zinc-50 dark:bg-black transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-zinc-500 dark:text-zinc-600 text-sm">
          <p>© 2026 FocusTube. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
