
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Geradora {
  id: number;
  nome: string;
  potencia: string;
  localizacao: string;
  status: string;
  clientesVinculados: number;
  latitude?: number;
  longitude?: number;
}

// Declare mapboxgl to avoid TypeScript errors
declare global {
  interface Window {
    mapboxgl: typeof mapboxgl;
  }
}

const DetalhesGeradoraModal = ({ 
  isOpen, 
  onClose, 
  geradora 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  geradora?: Geradora;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  
  useEffect(() => {
    if (!geradora || !isOpen || !mapboxToken || mapLoaded) return;
    
    const loadMap = async () => {
      if (!mapRef.current) return;
      
      try {
        // Initialize Mapbox
        mapboxgl.accessToken = mapboxToken;
        
        // Default coordinates if none provided
        const lat = geradora.latitude || -23.550520;
        const lng = geradora.longitude || -46.633308;
        
        // Create map
        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lng, lat],
          zoom: 13
        });
        
        // Add marker
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
        
        // Add navigation control
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (error) {
        console.error("Error loading Mapbox:", error);
      }
    };
    
    loadMap();
  }, [geradora, isOpen, mapboxToken]);
  
  // Clean up map instance when modal closes
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Geradora</DialogTitle>
        </DialogHeader>
        
        {geradora ? (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-base">{geradora.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Potência</p>
                <p className="text-base">{geradora.potencia}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Localização</p>
                <p className="text-base">{geradora.localizacao}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-base">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {geradora.status}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Clientes Vinculados</p>
              <p className="text-base">{geradora.clientesVinculados}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Localização no Mapa</p>
              <div className="relative">
                {mapLoaded ? (
                  <div className="h-[200px] bg-gray-100 rounded-lg" ref={mapRef} />
                ) : (
                  <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center" ref={mapRef}>
                    <div className="flex flex-col items-center">
                      <MapPin className="h-8 w-8 text-green-600 mb-2" />
                      <p className="text-gray-500">
                        {geradora.localizacao}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Insira uma chave do Mapbox para visualizar o mapa interativo
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-2">
                  <label className="text-sm font-medium text-gray-500 mb-1 block">
                    Insira uma chave do Mapbox para visualizar o mapa interativo:
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={mapboxToken} 
                      onChange={(e) => setMapboxToken(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Insira a chave do Mapbox"
                    />
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (mapboxToken) setMapLoaded(false);
                      }}
                    >
                      Aplicar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Nenhuma informação disponível para esta geradora.</p>
        )}
        
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesGeradoraModal;
