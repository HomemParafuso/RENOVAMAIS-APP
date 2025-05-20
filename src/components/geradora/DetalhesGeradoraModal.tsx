
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
  
  // Load Google Maps script
  useEffect(() => {
    if (!geradora || !isOpen || mapLoaded) return;
    
    // For demonstration, using a placeholder for location display
    // In a real implementation, we would load Google Maps API and display location
    const loadMap = async () => {
      if (!mapRef.current) return;
      
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }
      
      try {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initGoogleMap`;
        script.async = true;
        script.defer = true;
        
        // Define the callback function globally
        window.initGoogleMap = () => {
          initializeMap();
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };
    
    const initializeMap = () => {
      if (!mapRef.current || !geradora) return;
      
      // Default coordinates if none provided
      const lat = geradora.latitude || -23.550520;
      const lng = geradora.longitude || -46.633308;
      
      const mapOptions = {
        center: { lat, lng },
        zoom: 15,
      };
      
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      
      new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: geradora.nome,
      });
      
      setMapLoaded(true);
    };
    
    // Display a placeholder instead of actual map for now
    // loadMap();
    setMapLoaded(true);
  }, [geradora, isOpen, mapLoaded]);
  
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
                <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center" ref={mapRef}>
                  <div className="flex flex-col items-center">
                    <MapPin className="h-8 w-8 text-green-600 mb-2" />
                    <p className="text-gray-500">
                      {geradora.localizacao}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Coordenadas aproximadas para visualização
                    </p>
                  </div>
                </div>
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
