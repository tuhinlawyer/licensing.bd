import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, Calculator, BarChart3 } from 'lucide-react';
import Home from './pages/Home';
import BusinessList from './pages/BusinessList';
import BusinessDetail from './pages/BusinessDetail';
import LicenseList from './pages/LicenseList';
import LicenseDetail from './pages/LicenseDetail';
import AICalculator from './pages/AICalculator';
import Dashboard from './pages/Dashboard';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg font-sans text-slate-300 flex flex-col selection:bg-brand-neon selection:text-brand-bg">
      <nav className="bg-brand-bg/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-brand-accent to-brand-purple flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-2xl tracking-tight text-white flex items-center gap-1">
                    licensing<span className="text-brand-neon">.bd</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5 ml-11 font-medium letter-spacing-[0.2em]">SaaS OS v2.0</span>
              </Link>
              <div className="hidden md:ml-12 md:flex sm:space-x-8 items-center">
                <Link to="/start" className="text-slate-400 hover:text-white transition-colors text-sm font-medium tracking-wide">
                  Start a Business
                </Link>
                <Link to="/licenses" className="text-slate-400 hover:text-white transition-colors text-sm font-medium tracking-wide">
                  License Directory
                </Link>
                <Link to="/calculator" className="text-slate-400 hover:text-white transition-colors text-sm font-medium tracking-wide">
                  AI Calculator
                </Link>
              </div>
            </div>
            <div className="hidden md:flex md:items-center space-x-6">
              <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Compliance Login
              </Link>
              <a href="#" className="relative inline-flex items-center px-6 py-2.5 text-sm font-bold text-white rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all overflow-hidden group">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-accent/20 to-brand-purple/20 blur-xl group-hover:via-brand-neon/20 transition-all"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-neon animate-pulse"></span>
                  Implemented by T&P
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      <footer className="bg-brand-bg border-t border-white/5 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand-neon" />
                <span className="font-bold text-lg text-white">licensing<span className="text-brand-neon">.bd</span></span>
              </div>
              <p className="text-xs text-slate-500 mt-2">The AI Regulatory OS for Bangladesh Businesses.</p>
            </div>
            <div className="flex flex-col md:items-end space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Platform Implemented By</span>
              <span className="text-white font-bold tracking-wider text-sm">Tuhin & Partners</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<BusinessList />} />
          <Route path="/start/:id" element={<BusinessDetail />} />
          <Route path="/licenses" element={<LicenseList />} />
          <Route path="/licenses/:id" element={<LicenseDetail />} />
          <Route path="/calculator" element={<AICalculator />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
