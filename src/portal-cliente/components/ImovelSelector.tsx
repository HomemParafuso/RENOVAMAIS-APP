
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Zap, Calendar } from 'lucide-react';
import { Imovel } from '@/admin/types';

interface ImovelSelectorProps {
  imoveis: Imovel[];
  imovelSelecionado: number | null;
  onImovelChange: (imovelId: number) => void;
}

const ImovelSelector = ({ imoveis, imovelSelecionado, onImovelChange }: ImovelSelectorProps) => {
  const imovelAtual = imoveis.find(i => i.id === imovelSelecionado);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Selecione o Imóvel
              </label>
              <Select 
                value={imovelSelecionado?.toString() || ''} 
                onValueChange={(value) => onImovelChange(Number(value))}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Escolha um imóvel" />
                </SelectTrigger>
                <SelectContent>
                  {imoveis.map((imovel) => (
                    <SelectItem key={imovel.id} value={imovel.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{imovel.endereco}</span>
                        <span className="text-sm text-gray-500">
                          {imovel.cidade} - {imovel.estado}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {imovelAtual && (
            <div className="flex space-x-6 text-sm">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{imovelAtual.potenciaInstalada} kWp</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                <span>Desde {imovelAtual.dataInstalacao}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImovelSelector;
