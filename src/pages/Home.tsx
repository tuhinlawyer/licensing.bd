import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Landmark, Building2, Smartphone, Ship, Coffee, Presentation, Sparkles, Box, FileCheck, BrainCircuit } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export default function Home() {
  const [aiQuery, setAiQuery] = useState('');

  const quickLinks = [
    { name: 'Restaurant', icon: Coffee, link: '/start/restaurant' },
    { name: 'Garments', icon: Presentation, link: '/start/garments' },
    { name: 'IT Company', icon: Smartphone, link: '/start/software' },
    { name: 'Foreign Company', icon: Building2, link: '/start/import-export' },
    { name: 'Import/Export', icon: Ship, link: '/start/import-export' },
    { name: 'Factory', icon: Landmark, link: '/start/garments' },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-brand-bg text-slate-300 overflow-x-hidden">
      
      {/* Sleek AI Startup Hero Design */}
      <section className="w-full pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative overflow-visible perspective-1000">
        
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none overflow-hidden flex justify-center">
          <div className="absolute -top-[200px] w-[800px] h-[800px] rounded-full bg-brand-accent/20 blur-[120px] opacity-50 mix-blend-screen"></div>
          <div className="absolute -top-[200px] right-20 w-[600px] h-[600px] rounded-full bg-brand-purple/20 blur-[120px] opacity-50 mix-blend-screen"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-brand-accent/30 text-brand-neon text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>SaaS Version 2.0 Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tight leading-[1.1] mb-6">
            The Intelligent OS for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-brand-accent to-brand-purple">Business Compliance</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-slate-400 mb-12 max-w-2xl font-bengali">
            বাংলাদেশে ব্যবসার লাইসেন্সের সম্পূর্ণ এআই ড্যাশবোর্ড
          </h2>

          {/* AI Advisor Input Box - Sleek Glass */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-3xl glass-panel p-2 rounded-2xl flex flex-col sm:flex-row gap-2 relative group focus-within:border-brand-neon/50 focus-within:shadow-[0_0_30px_rgba(45,212,191,0.2)] transition-all"
          >
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-brand-neon" aria-hidden="true">
                <BrainCircuit className="w-6 h-6" />
              </span>
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Describe your business (e.g. Exporting frozen fish)..."
                className="w-full pl-14 pr-4 py-4 rounded-xl border-none focus:ring-0 text-white bg-transparent placeholder:text-slate-500 text-lg outline-none"
              />
            </div>
            <Link 
              to={`/calculator?q=${encodeURIComponent(aiQuery)}`}
              className="flex items-center justify-center bg-white text-brand-bg hover:bg-slate-200 font-bold px-8 py-4 rounded-xl transition-all whitespace-nowrap"
            >
              Simulate Cost
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          <div className="mt-16 w-full">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Explore Regulatory Workspaces</p>
            <div className="flex flex-wrap justify-center gap-3">
              {quickLinks.map((link, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  key={link.name}
                >
                  <Link
                    to={link.link}
                    className="flex items-center gap-2 glass-panel hover:bg-white/10 hover:border-white/20 text-white px-5 py-2.5 rounded-full transition-all text-sm font-medium"
                  >
                    <link.icon className="w-4 h-4 text-brand-neon" />
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3D SaaS Feature Showcase */}
      <section className="w-full max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 relative z-10 preserve-3d">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <motion.div 
            whileHover={{ y: -5, rotateX: 5, rotateY: -5 }}
            className="glass-panel p-8 rounded-3xl flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/10 rounded-full blur-2xl group-hover:bg-brand-neon/20 transition-all"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-brand-neon/20 to-brand-accent/20 rounded-2xl flex items-center justify-center mb-6 border border-brand-neon/30">
              <BrainCircuit className="h-7 w-7 text-brand-neon" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">AI Engine</h3>
            <p className="text-slate-400 text-sm mb-8 flex-grow leading-relaxed">Map your entire corporate structure instantly. The AI calculates exact VAT, IRC/ERC, and Trade License dependencies based on your capital.</p>
            <Link to="/calculator" className="inline-flex items-center text-brand-neon font-bold text-sm tracking-wide group-hover:gap-2 transition-all">
              Try the Simulator <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10, scale: 1.02 }}
            className="glass-panel p-8 rounded-3xl flex flex-col relative overflow-hidden group border-brand-accent/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl group-hover:bg-brand-accent/20 transition-all"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-brand-accent/20 to-brand-purple/20 rounded-2xl flex items-center justify-center mb-6 border border-brand-accent/30">
              <Box className="h-7 w-7 text-brand-accent" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Compliance Vault</h3>
            <p className="text-slate-400 text-sm mb-8 flex-grow leading-relaxed">Your SaaS command center. Store company documents securely, track expiration dates, and get automated alerts before fines kick in.</p>
            <Link to="/dashboard" className="w-full py-3 bg-white text-brand-bg rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors text-center inline-block">
              Open Workspace
            </Link>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5, rotateX: 5, rotateY: 5 }}
            className="glass-panel p-8 rounded-3xl flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-2xl group-hover:bg-brand-purple/20 transition-all"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-brand-purple/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6 border border-brand-purple/30">
              <FileCheck className="h-7 w-7 text-brand-purple" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">1-Click Fulfillment</h3>
            <p className="text-slate-400 text-sm mb-8 flex-grow leading-relaxed">Don't just track requirements—execute them. Connect directly with Tuhin & Partners to auto-file renewals and new applications.</p>
            <a href="#" className="inline-flex items-center text-brand-purple font-bold text-sm tracking-wide group-hover:gap-2 transition-all">
              View Legal SLA <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </motion.div>

        </div>
      </section>
      
    </div>
  );
}
