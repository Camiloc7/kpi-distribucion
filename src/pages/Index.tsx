
"use client";

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import { DeliveryData } from '@/types/deliveryTypes';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [deliveryData, setDeliveryData] = useState<DeliveryData[] | null>(null);
  
  const handleDataProcessed = (data: DeliveryData[]) => {
    setDeliveryData(data);
    
    setTimeout(() => {
      const dashboardElement = document.getElementById('dashboard-section');
      if (dashboardElement) {
        dashboardElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white text-black">
    <header className="bg-white py-8 shadow-sm relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-center mb-2">Visualizador de KPIs de Entregas</h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Carga tu archivo Excel con datos de entregas y visualiza métricas clave de rendimiento
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 z-0"></div>
      </div>
    </header>
  
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Importar Datos</h2>
          <p className="text-gray-600">
            Arrastra y suelta tu archivo Excel o haz clic para seleccionarlo
          </p>
        </div>
        
        <FileUpload onDataProcessed={handleDataProcessed} />
      </section>
  
      {deliveryData && deliveryData.length > 0 && (
        <>
          <Separator className="my-12" />
          
          <section id="dashboard-section" className="pt-4">
            <Dashboard data={deliveryData} />
          </section>
        </>
      )}
    </main>
  
    <footer className="bg-white py-6 mt-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        Visualizador de KPIs de Entregas &copy; {new Date().getFullYear()}
      </div>
    </footer>
  </div>
  
  );
};

export default Index;