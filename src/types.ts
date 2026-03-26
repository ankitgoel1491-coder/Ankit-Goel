export interface FinancialRatio {
  name: string;
  value: number;
  benchmark?: number;
  interpretation: string;
  category: 'Liquidity' | 'Profitability' | 'Solvency' | 'Efficiency';
}

export interface AnalysisResult {
  companyName: string;
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  summary: string;
  ratios: FinancialRatio[];
  strengths: string[];
  weaknesses: string[];
  valuationAnalysis: string;
  growthProspects: string;
  riskAssessment: string;
  chartData: {
    year: string;
    revenue: number;
    netIncome: number;
    operatingMargin: number;
  }[];
}

export interface FileData {
  name: string;
  type: string;
  base64: string;
}
