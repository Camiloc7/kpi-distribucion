"use client";

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { processExcelFile } from '@/utils/excelProcessor';
import { DeliveryData } from '@/types/deliveryTypes';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onDataProcessed: (data: DeliveryData[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataProcessed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExt !== 'xlsx' && fileExt !== 'xls') {
      toast({
        title: "Formato no soportado",
        description: "Por favor, sube un archivo Excel (.xlsx o .xls)",
        variant: "destructive"
      });
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    
    try {
      const data = await processExcelFile(file);
      
      toast({
        title: "Archivo procesado con éxito",
        description: `Se procesaron ${data.length} registros de entregas.`,
        variant: "default"
      });
      
      onDataProcessed(data);
    } catch (error: any) {
      toast({
        title: "Error al procesar el archivo",
        description: error.message || "Verifica que el archivo tenga el formato correcto",
        variant: "destructive"
      });
      setFileName(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={cn(
          "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ease-in-out",
          "bg-secondary/30 hover:bg-secondary/50",
          isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/25",
          "glassmorphism"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".xlsx,.xls"
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center",
            "bg-secondary text-primary transition-transform duration-500",
            isDragging ? "scale-110" : "",
            isProcessing ? "animate-pulse-subtle" : "animate-float"
          )}>
            {isProcessing ? (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : fileName ? (
              <CheckCircle2 size={36} className="text-success" />
            ) : (
              <Upload size={36} />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-lg">
              {isProcessing 
                ? "Procesando archivo..." 
                : fileName 
                  ? "Archivo cargado correctamente" 
                  : "Arrastra y suelta tu archivo Excel"}
            </h3>
            
            <p className="text-sm text-muted-foreground max-w-xs mx-auto text-balance">
              {fileName 
                ? fileName 
                : "O haz clic para seleccionar un archivo .xlsx con tus datos de entregas"}
            </p>
          </div>
        </div>
        
        {fileName && !isProcessing && (
          <div className="absolute top-3 right-3 flex items-center">
            <FileText size={16} className="mr-2 text-primary" />
            <span className="text-xs text-muted-foreground">{fileName}</span>
          </div>
        )}
      </div>

      {fileName && !isProcessing && (
        <div className="flex justify-center mt-4">
<Button
  variant="outline"
  className="text-sm bg-black text-white hover:bg-neutral-800"
  onClick={(e) => {
    e.stopPropagation();
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    triggerFileInput();
  }}
>
  Cargar otro archivo
</Button>
        </div>
      )}
      
      <div className="flex items-center justify-center mt-4">
        <AlertCircle size={14} className="text-muted-foreground mr-2" />
        <p className="text-xs text-muted-foreground text-center">
          El archivo debe contener las columnas: Orden ID, Entrega ID, Fecha Pedido, Fecha Estimada, Fecha Real, 
          Cantidad Entregada, Cantidad Total, Entrega Completa, A Tiempo
        </p>
      </div>
    </div>
  );
};

export default FileUpload;