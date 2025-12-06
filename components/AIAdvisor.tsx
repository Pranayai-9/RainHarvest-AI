import React, { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { CalculatorInputs, SimulationResult } from '../types';
import { getAIRecommendation } from '../services/geminiService';

interface AIAdvisorProps {
  inputs: CalculatorInputs;
  results: SimulationResult;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ inputs, results }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzed, setAnalyzed] = useState<boolean>(false);

  const handleGenerateAdvice = useCallback(async () => {
    if (!inputs.city) return;
    setLoading(true);
    setAnalyzed(true);
    const text = await getAIRecommendation(inputs, results);
    setAdvice(text);
    setLoading(false);
  }, [inputs, results]);

  // Auto-trigger analysis when city is entered and results are available
  useEffect(() => {
    // Prevent auto-trigger if already analyzed, loading, or city name is too short/empty
    if (analyzed || loading || !inputs.city || inputs.city.length < 2) return;

    const timer = setTimeout(() => {
      handleGenerateAdvice();
    }, 2000); // 2 second debounce to allow typing to finish

    return () => clearTimeout(timer);
  }, [inputs.city, analyzed, loading, handleGenerateAdvice]);

  return (
    <div className="mt-8 bg-gradient-to-br from-indigo-900/20 to-slate-900/50 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-indigo-200 font-bold text-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-400">
            <path d="M16.5 7.5h-9v9h9v-9z" opacity="0.3"/>
            <path d="M9.75 3a.75.75 0 00-1.5 0v1.5H7.5A.75.75 0 006.75 5.25v1.5h-1.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0h.75v1.5a.75.75 0 001.5 0h1.5v-1.5h.75a.75.75 0 001.5 0V8.25h1.5a.75.75 0 000-1.5h-1.5V5.25a.75.75 0 00-1.5 0h-.75V3.75a.75.75 0 00-1.5 0h-1.5V3z" />
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          Gemini AI Engineer
        </h3>
        
        {!analyzed && (
           <button 
             onClick={handleGenerateAdvice}
             disabled={!inputs.city}
             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2"
           >
             Analyze System
           </button>
        )}
        
        {analyzed && !loading && (
           <button 
             onClick={handleGenerateAdvice}
             className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-indigo-300 hover:text-indigo-200 text-xs font-semibold rounded-lg transition-all flex items-center gap-2"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
             </svg>
             Refresh Analysis
           </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-300/70 text-sm animate-pulse">Consulting expert models...</p>
        </div>
      )}

      {!loading && advice && (
        <div className="prose prose-invert prose-sm max-w-none text-slate-300">
           <ReactMarkdown>{advice}</ReactMarkdown>
        </div>
      )}
      
      {!analyzed && !loading && (
        <p className="text-slate-500 text-sm italic">
          {inputs.city 
            ? "Analyzing system parameters automatically..." 
            : "Enter a city above to receive a personalized AI sizing recommendation."}
        </p>
      )}
    </div>
  );
};

export default AIAdvisor;