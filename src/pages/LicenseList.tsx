import { Link } from 'react-router-dom';
import { LICENSES } from '../data/mockData';
import { BookOpen, Search, ArrowRight } from 'lucide-react';

export default function LicenseList() {
  return (
    <div className="w-full bg-brand-bg min-h-screen text-slate-300 font-sans">
      <div className="bg-brand-surface border-b border-white/5 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="mb-10 max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
            Compliance Module Index
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl">
            Browse our centralized database of commercial, sectoral, and institutional compliance triggers required for operations in Bangladesh.
          </p>
          
          {/* Fake Search Bar for UI realism */}
          <div className="mt-10 relative max-w-2xl group">
            <div className="absolute inset-x-0 -bottom-2 h-full bg-brand-neon/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-neon focus:bg-white/10 relative z-10 transition-all font-mono"
              placeholder="Search over 215+ regulatory modules..."
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LICENSES.map((license) => (
            <Link 
              key={license.id} 
              to={`/licenses/${license.id}`}
              className="glass-panel group p-6 rounded-2xl hover:border-brand-neon/40 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] transition-all flex flex-col relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent pointer-events-none"></div>
              <div className="mb-6 relative z-10">
                <span className="inline-flex items-center px-3 py-1 rounded bg-brand-accent/10 border border-brand-accent/20 text-[10px] font-bold text-brand-accent uppercase tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                  {license.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-neon transition-colors relative z-10">{license.name}</h3>
              <p className="text-sm text-slate-400 mb-8 line-clamp-3 w-full flex-1 relative z-10">{license.description}</p>
              
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-brand-neon transition-colors relative z-10">
                Access Schematic
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 glass-panel p-10 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/10 to-brand-purple/10"></div>
          <BookOpen className="h-12 w-12 text-brand-purple mx-auto mb-6 relative z-10" />
          <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Sector-Specific Datasets</h3>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto relative z-10">Our detailed data architectures cover A-Z compliance for major specialized industries.</p>
          <button className="relative z-10 inline-flex items-center px-8 py-3.5 rounded-xl text-sm font-bold text-brand-bg bg-white hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Explore Documentation Center
          </button>
        </div>
      </div>
    </div>
  );
}
