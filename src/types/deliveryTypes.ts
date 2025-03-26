
export interface DeliveryData {
  ordenId: number;
  entregaId: number;
  fechaPedido: string;
  fechaEstimada: string;
  fechaReal: string;
  cantidadEntregada: number;
  cantidadTotal: number;
  entregaCompleta: boolean;
  aTiempo: boolean;
}

export interface DeliveryKPIs {
  totalDeliveries: number;
  completedDeliveries: number;
  onTimeDeliveries: number;
  completionPercentage: number;
  onTimePercentage: number;
  averageDelayDays: number;
}

export interface DelayDistribution {
  range: string;
  count: number;
}