import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, UploadCloud, Calendar, FileText, 
  CheckCircle2, Lock, ShieldCheck, ArrowRight,
  Bell, FileCheck, Search, Plus
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  return (
    <div className="w-full bg-brand-bg min-h-screen pb-12 font-sans text-slate-300">
      {/* Dashboard Nav/Header */}
      <div className="border-b border-white/5 py-4 px-4 sm:px-6 lg:px-8 bg-brand-bg/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Compliance Workspace</h1>
            <span className="px-3 py-1 bg-white/5 border border-white/10 text-brand-neon rounded-full text-xs font-bold uppercase tracking-wider">
              Free Plan
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-accent to-brand-purple text-white flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              AZ
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Main Dashboard */}
        <div className="flex-1 space-y-6">
          
          {/* Critical Alerts - The Renewal Hook */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6 relative overflow-hidden group border-rose-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent"></div>
            <div className="relative z-10 flex items-start gap-5">
              <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-rose-400">Trade License Expires in 14 Days</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Dhaka North City Corporation will impose a 20% late fine starting July 1st. 
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                    Upload Renewed Doc
                  </button>
                  <a href="#" className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-neon" />
                    Let T&P Renew (৳5,000)
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Freemium Constraints Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-6 bg-gradient-to-r relative overflow-hidden from-brand-accent/20 to-brand-purple/20 border border-brand-purple/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/30 rounded-full blur-[80px]"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-xl text-white mb-1">Upgrade to Workspace Pro</h3>
              <p className="text-sm text-slate-300 max-w-md">You are tracking 1/3 free licenses. Unlock unlimited tracking, secure cloud storage, and automated compliance calendars.</p>
            </div>
            <button className="relative z-10 bg-white text-brand-bg px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Upgrade Now
            </button>
          </motion.div>

          {/* Active Licenses Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Tracked Compliance</h2>
              <button className="flex items-center gap-2 bg-brand-neon/10 text-brand-neon border border-brand-neon/30 px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-neon/20 transition-all">
                <Plus className="w-4 h-4" /> Add Record
              </button>
            </div>

            <div className="space-y-3">
              {/* License 1 - Expiring Soon */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-rose-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
                  <div>
                    <h4 className="font-bold text-white">Trade License (Commercial)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Dhaka North City Corporation</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-rose-400">Expires: Jun 30, 2026</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Action Required</p>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* License 2 - Active */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-brand-neon/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-brand-neon rounded-full shadow-[0_0_10px_rgba(45,212,191,0.8)]"></div>
                  <div>
                    <h4 className="font-bold text-white">e-TIN Certificate</h4>
                    <p className="text-xs text-slate-400 mt-0.5">National Board of Revenue</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-brand-neon">Active (No Expiry)</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Return Due Nov 30</p>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* License 3 - Locked (Freemium) */}
              <div className="bg-brand-surface/30 border border-white/5 rounded-xl p-4 flex items-center justify-between opacity-50 backdrop-grayscale">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  <div>
                    <h4 className="font-bold text-slate-400 flex items-center gap-2">
                      VAT Registration (BIN) <Lock className="w-3 h-3 text-brand-purple" />
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">Customs, Excise and VAT</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-brand-purple">Pro Feature</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Upgrade to Track</p>
                  </div>
                  <button className="p-2 cursor-not-allowed text-slate-600">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Document Vault */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-[400px] flex-shrink-0 space-y-6"
        >
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Cloud Vault</h2>
              <span className="text-xs font-bold text-brand-neon bg-brand-neon/10 border border-brand-neon/20 px-2 py-1 rounded">10% Full</span>
            </div>

            {/* Upload Area */}
            <div className="border border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-brand-neon hover:bg-white/5 transition-all cursor-pointer mb-6 group">
              <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-3 group-hover:text-brand-neon transition-colors" />
              <p className="text-sm font-medium text-slate-300">Drag & drop compliance files</p>
              <p className="text-xs text-slate-500 mt-1">Encrypted & Secure</p>
            </div>

            {/* Files List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-5 h-5 text-brand-accent flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-200 truncate">Trade_License_2025.pdf</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-brand-neon flex-shrink-0" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-5 h-5 text-brand-accent flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-200 truncate">NID_MD_Verified.jpg</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-brand-neon flex-shrink-0" />
              </div>

              {/* Locked Vault Feature */}
              <div className="flex items-center justify-between p-3 bg-brand-surface/20 rounded-lg border border-white/5 opacity-50">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-brand-purple" />
                  <span className="text-sm font-medium text-slate-400">Add Custom Folders</span>
                </div>
                <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">Pro</span>
              </div>
            </div>
          </div>

          <div className="glass-panel border-brand-accent/30 rounded-2xl p-6 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 to-brand-purple/10 pointer-events-none"></div>
             <ShieldCheck className="w-8 h-8 text-brand-accent mb-4" />
             <h3 className="font-bold text-lg text-white mb-2">Request Legal Audit</h3>
             <p className="text-sm text-slate-400 mb-6 leading-relaxed">Are your stored documents legally accurate? Have T&P lawyers verify your vault for total peace of mind.</p>
             <button className="w-full bg-brand-accent/20 border border-brand-accent/50 text-white py-3 rounded-lg font-bold text-sm hover:bg-brand-accent hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
               Verify My Vault
             </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
