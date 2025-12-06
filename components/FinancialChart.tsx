import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { SimulationResult } from '../types';

interface FinancialChartProps {
  data: SimulationResult['yearlyData'];
  currencySymbol?: string;
}

const CustomTooltip = ({ active, payload, label, currencySymbol }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800/95 border border-slate-700/80 p-3 rounded-lg shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-slate-200 mb-2 border-b border-slate-700/50 pb-1">Year {label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-slate-400">Cumulative Cash</span>
            </div>
            <span className="font-mono text-emerald-400 font-medium">
              {currencySymbol}{Math.round(data.cumulative).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 bg-slate-700/30 p-1.5 rounded border border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
              <span className="text-indigo-200 font-semibold">Annual Net</span>
            </div>
            <span className="font-mono text-indigo-300 font-bold text-sm">
              {currencySymbol}{Math.round(data.cashflow).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const FinancialChart: React.FC<FinancialChartProps> = ({ data, currencySymbol = '$' }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
          <XAxis 
            dataKey="year" 
            stroke="#94a3b8" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={10}
            tickMargin={5}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${currencySymbol}${value}`}
            width={45}
          />
          <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.6} />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#4ade80"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#4ade80', stroke: '#fff', strokeWidth: 2 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;