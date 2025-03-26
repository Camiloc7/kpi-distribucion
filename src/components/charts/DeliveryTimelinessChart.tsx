"use client";


import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DeliveryKPIs } from '@/types/deliveryTypes';

interface DeliveryTimelinessChartProps {
  kpis: DeliveryKPIs;
}

const DeliveryTimelinessChart: React.FC<DeliveryTimelinessChartProps> = ({ kpis }) => {
  const data = [
    { name: 'A tiempo', value: kpis.onTimeDeliveries },
    { name: 'Con retraso', value: kpis.totalDeliveries - kpis.onTimeDeliveries }
  ];

  const COLORS = ['#3b82f6', '#f59e0b'];

  return (
    <div className="h-80 w-full">
      <h3 className="text-lg font-medium mb-2 text-center">Puntualidad de Entregas</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            animationBegin={300}
            animationDuration={800}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}`, 'Cantidad']}
            contentStyle={{ 
              borderRadius: '8px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeliveryTimelinessChart;
