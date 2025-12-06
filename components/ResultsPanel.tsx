import React from 'react';
import { SimulationResult } from '../types';
import FinancialChart from './FinancialChart';

interface ResultsPanelProps {
  results: SimulationResult;
}

const MetricCard: React.FC<{ label: string; value: string; subtext?: string; positive?: boolean }> = ({ 
  label, value, subtext, positive 
}) => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-800/80 transition-colors">
    <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</span>
    <span className={`text-2xl font-bold ${positive ? 'text-emerald-400' : 'text-slate-100'}`}>{value}</span>
    {subtext && <span className="text-slate-500 text-xs mt-1">{subtext}</span>}
  </div>
);

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Annual Capture" 
          value={`${results.annualCapture.toFixed(0)} m³`} 
          subtext="Potential Yield"
        />
        <MetricCard 
          label="Water Saved" 
          value={`${results.waterSaved.toFixed(0)} m³`} 
          subtext="Actual Utilized"
        />
        <MetricCard 
          label="Annual Savings" 
          value={`$${results.annualSavings.toFixed(0)}`} 
          positive
        />
        <MetricCard 
          label="Payback Period" 
          value={results.paybackPeriod ? `${results.paybackPeriod} Years` : 'N/A'} 
          subtext={results.paybackPeriod ? 'Break-even point' : 'Not viable'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
           <h3 className="text-slate-200 font-semibold mb-4 text-sm flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
             Financial Projection (Cumulative Cashflow)
           </h3>
           <FinancialChart data={results.yearlyData} />
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex flex-col justify-center gap-4">
           <h3 className="text-slate-200 font-semibold text-sm">Investment Summary</h3>
           <div className="space-y-3">
             <div className="flex justify-between text-sm">
               <span className="text-slate-400">Initial Cost</span>
               <span className="text-slate-200 font-medium">${results.initialInvestment.toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-slate-400">Net Present Value (NPV)</span>
               <span className={`font-medium ${results.netPresentValue >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                 ${results.netPresentValue.toLocaleString()}
               </span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-slate-400">Return on Investment</span>
               <span className={`font-medium ${results.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                 {results.roi.toFixed(1)}%
               </span>
             </div>
             <div className="h-px bg-slate-700/50 my-2"></div>
              <p className="text-xs text-slate-500 leading-relaxed">
                *NPV calculated with discount rate. Payback assumes constant water prices and maintenance costs.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
