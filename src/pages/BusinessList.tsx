import { Link } from 'react-router-dom';
import { BUSINESS_TYPES } from '../data/mockData';
import { Utensils, Shirt, Laptop, Ship, Building2, Briefcase, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

// Helper to render lucide icons dynamically using the string from mockData
const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'Utensils': return <Utensils className={className} />;
    case 'Shirt': return <Shirt className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'Ship': return <Ship className={className} />;
    case 'Building2': return <Building2 className={className} />;
    default: return <Briefcase className={className} />;
  }
};

export default function BusinessList() {
  return (
    <div className="w-full bg-brand-bg min-h-screen text-slate-300 font-sans">
      <div className="bg-brand-surface border-b border-white/5 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-neon/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="text-center max-w-3xl mx-auto mb-4 relative z-10">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl mb-6">
            Industry Architectures
          </h1>
          <p className="mt-4 text-xl text-slate-400">
            Select your target industry to view the complete algorithmic compliance mapped out.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BUSINESS_TYPES.map((biz) => (
            <Link 
              key={biz.id} 
              to={`/start/${biz.id}`}
              className="glass-panel group p-6 rounded-2xl hover:border-brand-neon/50 transition-all flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent pointer-events-none"></div>
              <div className="w-12 h-12 bg-white/5 group-hover:bg-brand-neon/10 border border-white/10 group-hover:border-brand-neon/30 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors mb-6 relative z-10">
                <IconRenderer name={biz.icon} className="h-6 w-6 text-slate-400 group-hover:text-brand-neon transition-colors" />
              </div>
              <div className="flex-1 relative z-10 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between group-hover:text-brand-neon transition-colors">
                  {biz.name}
                  <ChevronRight className="h-5 w-5 text-slate-500 group-hover:translate-x-1 group-hover:text-brand-neon transition-all" />
                </h3>
                <p className="text-sm text-slate-400 mb-6 flex-1">{biz.description}</p>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 pt-4 border-t border-white/5">
                  <span className="bg-brand-accent/10 border border-brand-accent/20 px-2 py-1 rounded text-brand-accent">
                    {biz.licenses.length} Modules
                  </span>
                  <span>Op. Time: {biz.timeFrame}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
