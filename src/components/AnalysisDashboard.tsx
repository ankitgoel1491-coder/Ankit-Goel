import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, AreaChart, Area 
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { AnalysisResult } from '../types';
import { cn } from '../lib/utils';

interface AnalysisDashboardProps {
  data: AnalysisResult;
}

export function AnalysisDashboard({ data }: AnalysisDashboardProps) {
  const getRecommendationColor = (rec: string) => {
    if (rec.includes('Buy')) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (rec.includes('Sell')) return 'text-rose-600 bg-rose-50 border-rose-100';
    return 'text-amber-600 bg-amber-50 border-amber-100';
  };

  const getRecommendationIcon = (rec: string) => {
    if (rec.includes('Buy')) return <CheckCircle2 className="w-6 h-6" />;
    if (rec.includes('Sell')) return <AlertCircle className="w-6 h-6" />;
    return <Info className="w-6 h-6" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{data.companyName}</h1>
          <p className="text-gray-500 mt-1">Equity Research Analysis Report</p>
        </div>
        <div className={cn(
          "flex items-center gap-3 px-6 py-4 rounded-xl border font-bold text-xl",
          getRecommendationColor(data.recommendation)
        )}>
          {getRecommendationIcon(data.recommendation)}
          {data.recommendation}
        </div>
      </div>

      {/* Summary & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Executive Summary
            </h2>
            <div className="prose prose-blue max-w-none text-gray-600">
              <ReactMarkdown>{data.summary}</ReactMarkdown>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <h3 className="text-emerald-800 font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Key Strengths
              </h3>
              <ul className="space-y-2">
                {data.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-emerald-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
              <h3 className="text-rose-800 font-semibold mb-3 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Risk Factors
              </h3>
              <ul className="space-y-2">
                {data.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-rose-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm h-full">
            <h2 className="text-xl font-semibold mb-6">Financial Ratios</h2>
            <div className="space-y-6">
              {data.ratios.map((ratio, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{ratio.category}</span>
                      <h4 className="text-sm font-medium text-gray-900">{ratio.name}</h4>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{ratio.value.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000" 
                      style={{ width: `${Math.min(ratio.value * 10, 100)}%` }} 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic opacity-0 group-hover:opacity-100 transition-opacity">
                    {ratio.interpretation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold mb-8">Revenue & Net Income Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="netIncome" fill="#10b981" radius={[4, 4, 0, 0]} name="Net Income" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold mb-8">Operating Margin (%)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="operatingMargin" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorMargin)" 
                  strokeWidth={3}
                  name="Operating Margin %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Valuation Analysis', content: data.valuationAnalysis, icon: TrendingUp },
          { title: 'Growth Prospects', content: data.growthProspects, icon: ArrowRight },
          { title: 'Risk Assessment', content: data.riskAssessment, icon: AlertCircle },
        ].map((section, i) => (
          <div key={i} className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <section.icon className="w-5 h-5 text-blue-500" />
              {section.title}
            </h3>
            <div className="prose prose-sm prose-blue text-gray-600">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
