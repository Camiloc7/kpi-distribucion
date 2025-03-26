"use client";

import React from 'react';
import { DeliveryData, DeliveryKPIs } from '@/types/deliveryTypes';
import { calculateKPIs, calculateDelayDistribution } from '@/utils/dataAnalytics';
import DeliveryCompletionChart from './charts/DeliveryCompletionChart';
import DeliveryTimelinessChart from './charts/DeliveryTimelinessChart';
import DelayDistributionChart from './charts/DelayDistributionChart';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, PackageOpen, Truck, AlertTriangle, Calendar } from 'lucide-react';

interface DashboardProps {
  data: DeliveryData[];
}

const KpiCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  colorClass 
}: { 
  title: string; 
  value: string | number; 
  description?: string; 
  icon: React.ReactNode; 
  colorClass: string 
}) => (
  <Card className="card-hover h-full">
    <CardContent className="flex flex-col h-full p-6">
      <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold mb-2">{value}</div>
      {description && <p className="text-sm text-muted-foreground mt-auto">{description}</p>}
    </CardContent>
  </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const kpis: DeliveryKPIs = calculateKPIs(data);
  const delayDistribution = calculateDelayDistribution(data);

  // Format numbers for display
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatNumber = (value: number) => value.toLocaleString();
  const formatDays = (value: number) => `${value.toFixed(1)} días`;

  return (
    <div className="animate-fadeIn">
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-2 text-center">Panel de KPIs de Entregas</h2>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto">
          Análisis detallado del rendimiento de entregas basado en {data.length} registros procesados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <KpiCard
          title="Total de Entregas"
          value={formatNumber(kpis.totalDeliveries)}
          description="Número total de órdenes procesadas"
          icon={<Truck size={24} className="text-white" />}
          colorClass="bg-primary"
        />
        
        <KpiCard
          title="Completitud"
          value={formatPercentage(kpis.completionPercentage)}
          description={`${formatNumber(kpis.completedDeliveries)} entregas completas`}
          icon={<CheckCircle2 size={24} className="text-white" />}
          colorClass="bg-success"
        />
        
        <KpiCard
          title="Puntualidad"
          value={formatPercentage(kpis.onTimePercentage)}
          description={`${formatNumber(kpis.onTimeDeliveries)} entregas a tiempo`}
          icon={<Clock size={24} className="text-white" />}
          colorClass="bg-info"
        />

        <KpiCard
          title="Entregas Incompletas"
          value={formatNumber(kpis.totalDeliveries - kpis.completedDeliveries)}
          description="Órdenes con entrega parcial"
          icon={<PackageOpen size={24} className="text-white" />}
          colorClass="bg-warning"
        />
        
        <KpiCard
          title="Entregas con Retraso"
          value={formatNumber(kpis.totalDeliveries - kpis.onTimeDeliveries)}
          description="Órdenes que no cumplieron la fecha estimada"
          icon={<AlertTriangle size={24} className="text-white" />}
          colorClass="bg-destructive"
        />
        
        <KpiCard
          title="Promedio de Retraso"
          value={formatDays(kpis.averageDelayDays)}
          description="Tiempo promedio de retraso por entrega"
          icon={<Calendar size={24} className="text-white" />}
          colorClass="bg-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <DeliveryCompletionChart kpis={kpis} />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <DeliveryTimelinessChart kpis={kpis} />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <DelayDistributionChart delayDistribution={delayDistribution} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;




