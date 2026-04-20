import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calculator, AlertCircle, Building, Users, Calendar, Banknote, ShieldAlert, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

type FormData = {
  businessType: string;
  location: string;
  ownership: string;
  size: string;
  email: string;
};

type AIResponse = {
  licenses: { name: string; reason: string }[];
  totalEstimatedFee: string;
  timeline: string;
  riskFlags: string[];
};

export default function AICalculator() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/calculate-licensing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate calculation. Please try again.');
      }

      const rawResult = await response.json();
      setResult(rawResult);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-brand-bg min-h-screen text-slate-300 font-sans">
      <div className="bg-brand-surface border-b border-white/5 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-brand-neon/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="mb-10 text-center max-w-3xl mx-auto relative z-10">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl mb-4 flex items-center justify-center gap-3">
            <Cpu className="text-brand-neon h-10 w-10" />
            AI Cost Simulator
          </h1>
          <p className="text-lg text-slate-400">
            Powered by Google Gemini AI. Describe your intended business, and our regulatory intelligence model will estimate your compliance requirements, costs, and timelines.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row gap-10">
        
        {/* Form Column */}
        <div className={cn("w-full transition-all duration-500", result ? "lg:w-1/3" : "lg:w-1/2 lg:mx-auto")}>
          <div className="glass-panel p-8 rounded-2xl shadow-lg border-brand-accent/20">
            <h2 className="text-xl font-bold text-white mb-6">Describe Your Business</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">What type of business?</label>
                <input
                  {...register('businessType', { required: true })}
                  placeholder="e.g. Export-oriented Textile Factory"
                  className="block w-full rounded-xl bg-white/5 border border-white/10 shadow-sm focus:border-brand-neon focus:ring-brand-neon sm:text-sm px-4 py-3 text-white placeholder-slate-500 outline-none transition-all"
                />
                {errors.businessType && <p className="text-rose-500 text-xs mt-1">This field is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Company Location</label>
                <select
                  {...register('location', { required: true })}
                  className="block w-full rounded-xl bg-white/5 border border-white/10 shadow-sm focus:border-brand-neon focus:ring-brand-neon sm:text-sm px-4 py-3 text-gray-300 outline-none transition-all"
                >
                  <option value="" className="text-brand-bg">Select location...</option>
                  <option value="Dhaka North City Corporation" className="text-brand-bg">Dhaka North City Corporation</option>
                  <option value="Dhaka South City Corporation" className="text-brand-bg">Dhaka South City Corporation</option>
                  <option value="Chattogram City Corporation" className="text-brand-bg">Chattogram City Corporation</option>
                  <option value="Export Processing Zone (EPZ)" className="text-brand-bg">Export Processing Zone (EPZ)</option>
                  <option value="Other / Outside Metro" className="text-brand-bg">Other / Outside Metro</option>
                </select>
                {errors.location && <p className="text-rose-500 text-xs mt-1">Please select a location</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Ownership Structure</label>
                <select
                  {...register('ownership', { required: true })}
                  className="block w-full rounded-xl bg-white/5 border border-white/10 shadow-sm focus:border-brand-neon focus:ring-brand-neon sm:text-sm px-4 py-3 text-gray-300 outline-none transition-all"
                >
                  <option value="" className="text-brand-bg">Select ownership...</option>
                  <option value="100% Local (Bangladeshi)" className="text-brand-bg">100% Local (Bangladeshi)</option>
                  <option value="100% Foreign Owned" className="text-brand-bg">100% Foreign Owned</option>
                  <option value="Joint Venture (Local + Foreign)" className="text-brand-bg">Joint Venture (Local + Foreign)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Business Size Estimation</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Micro / Small', 'Medium', 'Large', 'Mega / Enterprise'].map((size) => (
                    <label key={size} className="flex items-center p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 has-[:checked]:border-brand-neon has-[:checked]:bg-brand-neon/10 transition-all">
                      <input type="radio" value={size} {...register('size', { required: true })} className="sr-only" />
                      <span className="text-sm font-medium text-slate-300">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="block text-sm font-bold text-white mb-1">Email <span className="text-slate-500 font-normal">(to receive full report)</span></label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  placeholder="you@company.com"
                  className="block w-full rounded-xl bg-white/5 border border-white/10 shadow-sm focus:border-brand-neon focus:ring-brand-neon sm:text-sm px-4 py-3 text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(45,212,191,0.2)] text-sm font-bold text-brand-bg bg-brand-neon hover:bg-white disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin"></div>
                    Querying LLM Engine...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" /> Execute Simulation
                  </span>
                )}
              </button>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-sm mt-4 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Results Column */}
        {result && (
          <div className="w-full lg:w-2/3 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="glass-panel rounded-2xl border-brand-accent/30 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-accent/20 to-brand-purple/20 border-b border-white/10 p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/20 blur-[50px]"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-extrabold mb-2 text-white">AI Simulation Complete</h2>
                  <p className="text-slate-300">Based on your inputs, here is your regulatory roadmap.</p>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                
                {/* Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Banknote className="h-6 w-6 text-brand-neon" />
                      <h3 className="font-bold text-slate-300 text-lg">Total Cost Estimate</h3>
                    </div>
                    <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-brand-accent">{result.totalEstimatedFee}</p>
                    <p className="text-xs text-slate-500 mt-2">Includes statutory & average professional fees.</p>
                  </div>
                  
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-6 w-6 text-brand-purple" />
                      <h3 className="font-bold text-slate-300 text-lg">Setup Timeline</h3>
                    </div>
                    <p className="text-2xl font-extrabold text-white">{result.timeline}</p>
                    <p className="text-xs text-slate-500 mt-2">Depending on document availability.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Licenses */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Building className="h-5 w-5 text-brand-accent" />
                      Required Licenses ({result.licenses.length})
                    </h3>
                    <ul className="space-y-4">
                      {result.licenses.map((lic, idx) => (
                        <li key={idx} className="bg-white/5 border text-left border-white/10 rounded-xl p-4">
                          <h4 className="font-bold text-white text-sm mb-1">{lic.name}</h4>
                          <p className="text-xs text-slate-400">{lic.reason}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-rose-500" />
                      Compliance Risks
                    </h3>
                    <ul className="space-y-3">
                      {result.riskFlags.map((risk, idx) => (
                         <li key={idx} className="flex gap-3 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-sm text-slate-300">
                           <span className="font-bold text-rose-500 flex-shrink-0">•</span>
                           <span>{risk}</span>
                         </li>
                      ))}
                    </ul>

                    <div className="mt-8 p-6 bg-brand-accent/10 border border-brand-accent/30 rounded-xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 to-brand-purple/10 pointer-events-none"></div>
                      <h4 className="font-bold text-white mb-2 relative z-10">Need guaranteed execution?</h4>
                      <p className="text-sm text-slate-400 mb-6 relative z-10">
                        Let the experts at Tuhin & Partners handle this complex roadmap for you.
                      </p>
                      <a 
                        href="https://outlook.office.com/book/TuhinAndPartners@tnp.legal/?ismsaljsauthenabled" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full relative z-10 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] text-sm font-bold text-brand-bg bg-brand-accent hover:bg-white hover:text-brand-bg transition-all"
                      >
                        Book Strategy Call
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
