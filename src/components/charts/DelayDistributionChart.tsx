"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DelayDistribution } from '@/types/deliveryTypes';

interface DelayDistributionChartProps {
  delayDistribution: DelayDistribution[];
}

const DelayDistributionChart: React.FC<DelayDistributionChartProps> = ({ delayDistribution }) => {
  const getBarColor = (range: string) => {
    switch (range) {
      case 'A tiempo o adelantado':
        return '#10b981'; 
      case '1-2 días':
        return '#3b82f6'; 
      case '3-5 días':
        return '#f59e0b'; 
      case '6-10 días':
        return '#f97316';
      case 'Más de 10 días':
        return '#ef4444'; 
      default:
        return '#3b82f6'; 
    }
  };

  return (
    <div className="h-80 w-full">
      <h3 className="text-lg font-medium mb-2 text-center">Distribución de Retrasos</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={delayDistribution}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="range" 
            angle={-35} 
            textAnchor="end" 
            height={60} 
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`${value}`, 'Entregas']}
            contentStyle={{ 
              borderRadius: '8px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}
          />
          <Bar 
            dataKey="count" 
            animationDuration={1000}
            radius={[4, 4, 0, 0]}
          >
            {delayDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.range)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DelayDistributionChart;