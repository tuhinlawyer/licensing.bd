import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BUSINESS_TYPES, LICENSES } from '../data/mockData';
import { Download, Calculator, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const business = BUSINESS_TYPES.find(b => b.id === id);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!business) {
    return <div className="p-12 text-center text-xl text-slate-500 bg-brand-bg min-h-screen">Business setup guide not found.</div>;
  }

  const requiredLicenses = LICENSES.filter(l => business.licenses.includes(l.id));
  const missingLicenses = business.licenses.filter(lId => !LICENSES.find(l => l.id === lId));

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="w-full bg-brand-bg min-h-screen font-sans text-slate-300">
      {/* Header */}
      <div className="bg-brand-surface border-b border-white/5 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/start" className="text-brand-neon hover:text-white text-sm font-bold tracking-wide mb-6 inline-flex items-center transition-colors">
            ← Back to all workspaces
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 text-white"
          >
            {business.name}
          </motion.h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            {business.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content */}
        <div className="flex-1 lg:max-w-3xl">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel flex items-center gap-6 p-6 rounded-2xl mb-10 divide-x divide-white/10"
          >
            <div className="flex-1 text-center">
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-bold">Total Modules</p>
              <p className="text-3xl font-bold text-white">{business.licenses.length}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-bold">Estimated Cost</p>
              <p className="text-xl font-bold text-brand-neon">{business.costEstimate}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-bold">Timeline</p>
              <p className="text-xl font-bold text-white">{business.timeFrame}</p>
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-6">Required Compliance Modules</h2>
          
          <div className="space-y-4 mb-12">
            {requiredLicenses.map((license, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                key={license.id} 
                className="glass-panel rounded-xl p-5 flex items-start gap-4 hover:border-brand-neon/50 transition-all hover:bg-white/5"
              >
                <CheckCircle2 className="h-6 w-6 text-brand-neon flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                    <Link to={`/licenses/${license.id}`} className="hover:text-brand-neon transition-colors">
                      {license.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">{license.description}</p>
                </div>
              </motion.div>
            ))}
            
            {missingLicenses.map((id, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (requiredLicenses.length + i) }}
                key={id} 
                className="bg-white/5 border border-white/5 rounded-xl p-5 flex items-start gap-4"
              >
                <CheckCircle2 className="h-6 w-6 text-slate-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-400 capitalize">{id.replace('-', ' ')}</h3>
                  <p className="text-sm text-slate-500 mt-1">Pending documentation update.</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="glass-panel rounded-2xl p-8 mb-12 relative overflow-hidden border-brand-purple/20">
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-brand-bg to-transparent z-10 flex items-end justify-center pb-8 backdrop-blur-[1px]"></div>
            
            <h2 className="text-xl font-bold text-white mb-6">Execution Workflow</h2>
            <ul className="space-y-4 relative z-0">
              <li className="flex gap-4 text-slate-400"><span className="font-bold text-brand-neon">Step 1:</span> Secure corporate jurisdiction & deed.</li>
              <li className="flex gap-4 text-slate-400"><span className="font-bold text-brand-neon">Step 2:</span> Execute RJSC Incorporation.</li>
              <li className="flex gap-4 text-slate-400"><span className="font-bold text-brand-neon">Step 3:</span> Deploy Municipal Trade License.</li>
              <li className="flex gap-4 text-slate-500 opacity-50"><span className="font-bold text-slate-400">Step 4:</span> ... [Encrypted Sandbox]</li>
              <li className="flex gap-4 text-slate-500 opacity-30"><span className="font-bold text-slate-400">Step 5:</span> ... [Encrypted Sandbox]</li>
            </ul>
          </div>
          
        </div>

        {/* Sidebar Lead Capture Funnel */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="glass-panel border-brand-accent/40 rounded-2xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)] sticky top-28">
            {!isSubmitted ? (
              <>
                <div className="flex items-center justify-center w-12 h-12 bg-brand-accent/20 text-brand-accent rounded-xl mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-brand-accent/30">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Export Setup Architecture</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Download the complete algorithmic roadmap for {business.name.toLowerCase()} straight to your secure inbox.
                </p>
                
                <form onSubmit={handleDownload} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-brand-neon focus:ring-brand-neon focus:bg-brand-surface transition-all px-4 py-3 border outline-none"
                      placeholder="name@startup.com"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-brand-bg bg-brand-neon hover:bg-white transition-colors shadow-[0_0_20px_rgba(45,212,191,0.3)]"
                  >
                    Unlock Architecture PDF
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="h-16 w-16 text-brand-neon mx-auto mb-4 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                <h3 className="text-xl font-bold text-white mb-2">Package Successfully Deployed</h3>
                <p className="text-sm text-slate-400">
                  The complete regulatory roadmap has been delivered to your inbox.
                </p>
              </div>
            )}
            
            <hr className="my-8 border-white/10" />
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Platform Interfaces</h4>
              <a 
                href="https://outlook.office.com/book/TuhinAndPartners@tnp.legal/?ismsaljsauthenabled" 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-white group"
              >
                <span className="font-bold text-sm text-slate-300">Consult Architect (T&P)</span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
              </a>
              <Link 
                to="/calculator" 
                className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-brand-accent/30 transition-all group"
              >
                <span className="font-bold text-sm text-brand-accent group-hover:text-blue-400">Launch Cost Engine</span>
                <Calculator className="h-4 w-4 text-brand-accent" />
              </Link>
              
              <Link 
                to="/dashboard"
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-brand-accent/10 to-brand-purple/10 border border-brand-purple/30 rounded-xl hover:border-brand-neon/50 group relative transition-all"
              >
                <span className="font-bold text-sm text-white">Open SaaS Workspace</span>
                <span className="text-[9px] font-bold uppercase tracking-widest bg-brand-neon text-brand-bg px-2 py-1 rounded shadow-[0_0_10px_rgba(45,212,191,0.5)]">Beta</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
