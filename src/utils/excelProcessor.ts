
import * as XLSX from 'xlsx';
import { DeliveryData } from '../types/deliveryTypes';

const REQUIRED_COLUMNS = [
  'Orden ID',
  'Entrega ID',
  'Fecha Pedido',
  'Fecha Estimada',
  'Fecha Real',
  'Cantidad Entregada',
  'Cantidad Total',
  'Entrega Completa?',
  'A Tiempo?'
];

export const processExcelFile = (file: File): Promise<DeliveryData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Validate that required columns exist
        const sampleRow = jsonData[0] as Record<string, any>;
        const hasRequiredColumns = REQUIRED_COLUMNS.every(column => 
          Object.keys(sampleRow).some(key => key.trim() === column)
        );
        
        if (!hasRequiredColumns) {
          reject(new Error('El archivo no contiene todas las columnas requeridas'));
          return;
        }
        
        const deliveryData = jsonData.map((row: any) => {
          // Handle possible variations in column names by matching case-insensitive
          const getColumnValue = (columnName: string) => {
            const key = Object.keys(row).find(k => 
              k.toLowerCase().trim() === columnName.toLowerCase().trim()
            );
            return key ? row[key] : null;
          };
          
          return {
            ordenId: Number(getColumnValue('Orden ID')),
            entregaId: Number(getColumnValue('Entrega ID')),
            fechaPedido: getColumnValue('Fecha Pedido'),
            fechaEstimada: getColumnValue('Fecha Estimada'),
            fechaReal: getColumnValue('Fecha Real'),
            cantidadEntregada: Number(getColumnValue('Cantidad Entregada')),
            cantidadTotal: Number(getColumnValue('Cantidad Total')),
            entregaCompleta: getColumnValue('Entrega Completa?').toString().toLowerCase() === 'sí' 
              || getColumnValue('Entrega Completa?').toString().toLowerCase() === 'si'
              || getColumnValue('Entrega Completa?') === true,
            aTiempo: getColumnValue('A Tiempo?').toString().toLowerCase() === 'sí'
              || getColumnValue('A Tiempo?').toString().toLowerCase() === 'si'
              || getColumnValue('A Tiempo?') === true
          };
        });
        
        resolve(deliveryData);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        reject(new Error('Error al procesar el archivo Excel'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsBinaryString(file);
  });
};
