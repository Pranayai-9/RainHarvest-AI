import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorInputs, SimulationResult } from './types';
import { calculateROI } from './utils/calculations';
import { fetchRainfallForCity } from './services/weatherService';
import ResultsPanel from './components/ResultsPanel';
import AIAdvisor from './components/AIAdvisor';

const DEFAULT_INPUTS: CalculatorInputs = {
  city: '',
  roofArea: 120,
  rainfall: 800,
  runoffCoefficient: 0.85,
  annualDemand: 50,
  tankCost: 1500,
  installCost: 800,
  maintenanceCost: 50,
  waterPrice: 3.50,
  lifespan: 20,
  discountRate: 5,
};

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<SimulationResult>(calculateROI(DEFAULT_INPUTS));
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  // Auto-calculate when inputs change
  useEffect(() => {
    const res = calculateROI(inputs);
    setResults(res);
  }, [inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'city' ? value : parseFloat(value) || 0,
    }));
  };

  const handleFetchWeather = useCallback(async () => {
    if (!inputs.city) return;
    setWeatherLoading(true);
    setWeatherError('');
    
    const rain = await fetchRainfallForCity(inputs.city);
    
    if (rain !== null) {
      setInputs(prev => ({ ...prev, rainfall: rain }));
    } else {
      setWeatherError('Could not find weather data for this location.');
    }
    setWeatherLoading(false);
  }, [inputs.city]);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Header (Full Width) */}
        <header className="lg:col-span-12 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/20">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v6m0 0l-3-3m3 3l3-3" />
               </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                RainHarvest AI
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium tracking-wide uppercase">
                Intelligent ROI & Sizing Engine
              </p>
            </div>
          </div>
        </header>

        {/* Left Column: Inputs (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5 border-b border-slate-700/50 pb-2">
              Site Parameters
            </h2>
            
            <div className="space-y-5">
              
              {/* Climate Section */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium uppercase">Location (City)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="city"
                    value={inputs.city}
                    onChange={handleInputChange}
                    placeholder="e.g. London"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-600"
                  />
                  <button 
                    onClick={handleFetchWeather}
                    disabled={weatherLoading || !inputs.city}
                    className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                    title="Fetch Annual Rainfall"
                  >
                    {weatherLoading ? (
                       <svg className="animate-spin h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    )}
                  </button>
                </div>
                {weatherError && <p className="text-red-400 text-xs">{weatherError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Rainfall (mm/yr)</label>
                  <input
                    type="number"
                    name="rainfall"
                    value={inputs.rainfall}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                  />
                  <a 
                    href="https://open-meteo.com/en/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-indigo-400/80 hover:text-indigo-300 transition-colors inline-block pt-0.5"
                  >
                    Used for climate data
                  </a>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Roof Area (m²)</label>
                  <input
                    type="number"
                    name="roofArea"
                    value={inputs.roofArea}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                 <label className="text-xs text-slate-400">Roof Efficiency (Runoff Coeff)</label>
                 <select 
                    name="runoffCoefficient"
                    value={inputs.runoffCoefficient}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-emerald-500 outline-none"
                 >
                   <option value={0.95}>Metal (High) - 0.95</option>
                   <option value={0.85}>Tiles/Concrete (Avg) - 0.85</option>
                   <option value={0.70}>Flat/Gravel (Low) - 0.70</option>
                 </select>
              </div>
              
              <div className="space-y-1">
                  <label className="text-xs text-slate-400">Annual Water Demand (m³)</label>
                  <input
                    type="number"
                    name="annualDemand"
                    value={inputs.annualDemand}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-500">e.g., Garden + Toilet flushing ~ 50-100m³</p>
              </div>

            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5 border-b border-slate-700/50 pb-2">
              Financial inputs
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Tank Cost ($)</label>
                  <input type="number" name="tankCost" value={inputs.tankCost} onChange={handleInputChange} className="input-base" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Install Cost ($)</label>
                  <input type="number" name="installCost" value={inputs.installCost} onChange={handleInputChange} className="input-base" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Maint. ($/yr)</label>
                  <input type="number" name="maintenanceCost" value={inputs.maintenanceCost} onChange={handleInputChange} className="input-base" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Water Price ($/m³)</label>
                  <input type="number" step="0.1" name="waterPrice" value={inputs.waterPrice} onChange={handleInputChange} className="input-base" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500">Lifespan (yrs)</label>
                    <input type="number" name="lifespan" value={inputs.lifespan} onChange={handleInputChange} className="input-base !bg-slate-900/30" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs text-slate-500">Discount (%)</label>
                    <input type="number" name="discountRate" value={inputs.discountRate} onChange={handleInputChange} className="input-base !bg-slate-900/30" />
                 </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Results (8 cols) */}
        <main className="lg:col-span-8">
          <ResultsPanel results={results} />
          
          <AIAdvisor inputs={inputs} results={results} />
          
          <div className="mt-8 text-center text-slate-600 text-xs">
            <p>
              Calculations are estimates. Actual yield depends on rainfall distribution and daily usage patterns. 
              <br/>
              Rainfall data provided by Open-Meteo. AI Analysis by Google Gemini.
            </p>
          </div>
        </main>

      </div>
      
      {/* Global Input Styles Injection */}
      <style>{`
        .input-base {
          width: 100%;
          background-color: rgba(15, 23, 42, 0.5);
          border: 1px solid #475569;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #e2e8f0;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-base:focus {
          border-color: #10b981;
        }
      `}</style>
    </div>
  );
}

export default App;