
import { DeliveryData, DeliveryKPIs, DelayDistribution } from '../types/deliveryTypes';

export const calculateKPIs = (data: DeliveryData[]): DeliveryKPIs => {
  const totalDeliveries = data.length;
  const completedDeliveries = data.filter(item => item.entregaCompleta).length;
  const onTimeDeliveries = data.filter(item => item.aTiempo).length;
  
  const completionPercentage = (completedDeliveries / totalDeliveries) * 100;
  const onTimePercentage = (onTimeDeliveries / totalDeliveries) * 100;
  
  const delayDays = data.map(item => {
    const estimatedDate = new Date(item.fechaEstimada);
    const actualDate = new Date(item.fechaReal);
    const diffTime = actualDate.getTime() - estimatedDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays > 0 ? diffDays : 0; 
  });
  
  const totalDelayDays = delayDays.reduce((sum, days) => sum + days, 0);
  const averageDelayDays = totalDelayDays / totalDeliveries;
  
  return {
    totalDeliveries,
    completedDeliveries,
    onTimeDeliveries,
    completionPercentage,
    onTimePercentage,
    averageDelayDays
  };
};

export const calculateDelayDistribution = (data: DeliveryData[]): DelayDistribution[] => {
  const delays = data.map(item => {
    const estimatedDate = new Date(item.fechaEstimada);
    const actualDate = new Date(item.fechaReal);
    const diffTime = actualDate.getTime() - estimatedDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Round up to nearest day
  });
  
  const distribution: Record<string, number> = {
    "A tiempo o adelantado": 0,
    "1-2 días": 0,
    "3-5 días": 0,
    "6-10 días": 0,
    "Más de 10 días": 0
  };
  
  delays.forEach(delay => {
    if (delay <= 0) {
      distribution["A tiempo o adelantado"]++;
    } else if (delay <= 2) {
      distribution["1-2 días"]++;
    } else if (delay <= 5) {
      distribution["3-5 días"]++;
    } else if (delay <= 10) {
      distribution["6-10 días"]++;
    } else {
      distribution["Más de 10 días"]++;
    }
  });
  
  return Object.entries(distribution).map(([range, count]) => ({
    range,
    count
  }));
};
