import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LICENSES } from '../data/mockData';
import { Download, CheckCircle2, Building, Clock, CreditCard, ChevronRight } from 'lucide-react';

export default function LicenseDetail() {
  const { id } = useParams<{ id: string }>();
  const license = LICENSES.find(l => l.id === id);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!license) {
    return <div className="p-12 text-center text-xl text-neutral-500">License information not found.</div>;
  }

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="w-full bg-brand-bg min-h-screen text-slate-300 font-sans">
      {/* Breadcrumbs */}
      <div className="bg-brand-surface border-b border-white/5 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center text-sm text-slate-500">
          <Link to="/" className="hover:text-brand-neon transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/licenses" className="hover:text-brand-neon transition-colors">Compliance Modules</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-white font-medium truncate">{license.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
        {/* Main Content */}
        <div className="flex-1 lg:max-w-3xl relative z-10">
          
          <div className="mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded border border-brand-accent/30 text-[10px] font-bold bg-brand-accent/10 text-brand-accent tracking-[0.2em] uppercase mb-6 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              {license.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
              {license.name}
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
              {license.description}
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 mb-12 border-brand-neon/20 shadow-[0_0_30px_rgba(45,212,191,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-neon/5 rounded-full blur-[50px] pointer-events-none"></div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-brand-neon mb-6 flex items-center gap-2 relative z-10">
              <CheckCircle2 className="w-5 h-5 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" /> Quick Properties
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-wider">Required For</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium border border-white/15 text-slate-200">All Entities</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-wider">Govt Fee Range</p>
                <p className="text-sm font-bold text-white">{license.fees}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-wider">Time / Renewal</p>
                <p className="text-sm font-bold text-white">{license.timeRequired}</p>
                {license.renewable && <p className="text-[10px] text-brand-neon mt-1 uppercase tracking-wider font-bold">Renews: {license.renewable}</p>}
              </div>
            </div>
            {license.legalBasis && (
              <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-wider">Legal Basis</p>
                <p className="text-sm text-slate-400 font-mono bg-black/20 p-3 rounded-lg border border-black/50">{license.legalBasis}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <div className="glass-panel p-5 rounded-xl flex items-start gap-4">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <Building className="h-5 w-5 text-brand-accent flex-shrink-0" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Issuing Authority</p>
                <p className="font-bold text-white mt-1">{license.authority}</p>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-xl flex items-start gap-4">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <Clock className="h-5 w-5 text-brand-accent flex-shrink-0" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Est. Processing Time</p>
                <p className="font-bold text-white mt-1">{license.timeRequired}</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Required Input Variables</h2>
          <ul className="space-y-3 mb-12">
            {license.documents.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-4 bg-white/5 border border-white/5 p-4 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-brand-neon flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm font-medium">{doc}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold text-white mb-6">Execution Sequence</h2>
          <div className="space-y-0 mb-12">
            {license.processSteps.map((step, idx) => (
              <div key={idx} className="flex gap-6 relative">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/20 border border-brand-accent/30 text-brand-accent font-bold flex items-center justify-center flex-shrink-0 z-10">
                    {idx + 1}
                  </div>
                  {idx !== license.processSteps.length - 1 && (
                    <div className="w-px h-full bg-white/10 absolute top-10 bottom-0 left-5"></div>
                  )}
                </div>
                <div className="pt-2 pb-10">
                  <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Sidebar Lead Capture */}
        <div className="w-full lg:w-[400px] flex-shrink-0 relative z-10">
          <div className="glass-panel border-brand-purple/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(139,92,246,0.1)] sticky top-28">
            {!isSubmitted ? (
              <>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand-accent/20 to-brand-purple/20 text-brand-purple rounded-xl mb-6 shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-brand-purple/30">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Export Data Package</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Download the definitive schematic for the <strong>{license.name}</strong> including official forms and compliance triggers.
                </p>
                
                <form onSubmit={handleDownload} className="space-y-4">
                  <div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-brand-neon focus:ring-brand-neon outline-none transition-all px-4 py-3"
                      placeholder="name@startup.com"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.2)] text-sm font-bold text-brand-bg bg-brand-neon hover:bg-white transition-all"
                  >
                    Deploy Schematic to Inbox
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="h-16 w-16 text-brand-neon mx-auto mb-4 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                <h3 className="text-xl font-bold text-white mb-2">Deployment Successful</h3>
                <p className="text-sm text-slate-400">The schematic has been delivered to your secure inbox.</p>
              </div>
            )}
            
            <hr className="my-8 border-white/10" />
            
            <div>
              <p className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-[0.2em]">Enterprise Setup</p>
              <a 
                href="https://outlook.office.com/book/TuhinAndPartners@tnp.legal/?ismsaljsauthenabled" 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-between py-4 px-5 border border-brand-accent/50 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.15)] text-sm font-bold text-white bg-brand-accent/10 hover:bg-brand-accent transition-all group"
               >
                <span>Implemented by Tuhin & Partners</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
