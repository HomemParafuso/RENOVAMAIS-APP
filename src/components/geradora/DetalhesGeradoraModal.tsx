
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
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';

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
  const mapInstanceRef = useRef<Map | null>(null);
  
  useEffect(() => {
    if (!geradora || !isOpen || !mapRef.current) return;
    
    // Default coordinates if none provided
    const lat = geradora.latitude || -23.550520;
    const lng = geradora.longitude || -46.633308;
    
    // Convert to OpenLayers projection
    const position = fromLonLat([lng, lat]);
    
    // Create vector layer for marker
    const iconFeature = new Feature({
      geometry: new Point(position)
    });
    
    const vectorSource = new VectorSource({
      features: [iconFeature]
    });
    
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/latest/examples/data/icon.png'
        })
      })
    });
    
    // Initialize map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: position,
        zoom: 13
      })
    });
    
    mapInstanceRef.current = map;
    
    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [geradora, isOpen]);
  
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
              <div className="h-[200px] bg-gray-100 rounded-lg" ref={mapRef}>
                {!mapInstanceRef.current && (
                  <div className="h-full flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <MapPin className="h-8 w-8 text-green-600 mb-2" />
                      <p className="text-gray-500">
                        {geradora.localizacao || "Localização não informada"}
                      </p>
                    </div>
                  </div>
                )}
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
