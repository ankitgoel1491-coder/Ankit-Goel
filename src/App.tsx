import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { analyzeFinancials } from './services/geminiService';
import { AnalysisResult, FileData } from './types';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  ShieldCheck, 
  Loader2, 
  RefreshCw,
  ChevronRight,
  Search,
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOADING_MESSAGES = [
  "Parsing financial statements...",
  "Calculating liquidity and solvency ratios...",
  "Analyzing profitability trends...",
  "Benchmarking against industry standards...",
  "Evaluating management's guidance...",
  "Assessing growth prospects and valuation...",
  "Synthesizing investment recommendation...",
  "Finalizing your equity research report..."
];

export default function App() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const handleFilesSelected = (newFiles: FileData[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeFinancials(files);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze documents. Please ensure they contain readable financial data.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={handleReset}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">EquityInsight</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Methodology</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          </div>

          {result && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              New Analysis
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!result && !isAnalyzing ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                  Analyze financials like a <span className="text-blue-600">pro analyst.</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  Upload annual reports, balance sheets, or income statements. Get instant ratio analysis, depth assessment, and investment recommendations.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                <FileUpload 
                  onFilesSelected={handleFilesSelected} 
                  files={files} 
                  onRemoveFile={handleRemoveFile} 
                />
                
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <button
                    disabled={files.length === 0}
                    onClick={handleAnalyze}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3"
                  >
                    {files.length === 0 ? "Upload documents to begin" : "Start Financial Analysis"}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {error && (
                    <p className="mt-4 text-center text-rose-500 font-medium text-sm flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                {[
                  { icon: BarChart3, title: "Ratio Analysis", desc: "Liquidity, Solvency, and Profitability metrics calculated instantly." },
                  { icon: Search, title: "Depth Analysis", desc: "Detailed breakdown of valuation, growth, and risk factors." },
                  { icon: ShieldCheck, title: "Smart Verdict", desc: "AI-powered investment recommendation based on raw data." }
                ].map((feature, i) => (
                  <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 space-y-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 animate-pulse" />
                <Loader2 className="w-20 h-20 text-blue-600 animate-spin relative z-10" />
              </div>
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-slate-900">Analyzing Financials</h2>
                <p className="text-slate-500 font-medium animate-pulse">
                  {LOADING_MESSAGES[loadingMessageIndex]}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {result && <AnalysisDashboard data={result} />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 px-6 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold tracking-tight text-slate-900">EquityInsight</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 EquityInsight. For educational purposes only. Not financial advice.
          </p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors"><FileText className="w-5 h-5" /></a>
            <a href="#" className="hover:text-blue-600 transition-colors"><PieChart className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
