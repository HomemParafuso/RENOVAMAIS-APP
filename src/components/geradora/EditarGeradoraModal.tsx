import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface EditarGeradoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  geradora: any;
  onSave: (geradora: any) => void;
  onDelete: (geradora: any) => void;
}

const EditarGeradoraModal = ({ isOpen, onClose, geradora, onSave, onDelete }: EditarGeradoraModalProps) => {
  const { toast } = useToast();
  const [nome, setNome] = useState("");
  const [potencia, setPotencia] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [status, setStatus] = useState("");
  const [clientesVinculados, setClientesVinculados] = useState(0);
  const [marcaInversor, setMarcaInversor] = useState<string | undefined>("");
  const [apiKey, setApiKey] = useState<string | undefined>("");

  useEffect(() => {
    if (geradora) {
      setNome(geradora.nome);
      setPotencia(geradora.potencia);
      setLocalizacao(geradora.localizacao);
      setStatus(geradora.status);
      setClientesVinculados(geradora.clientesVinculados);
      setMarcaInversor(geradora.marcaInversor || "");
      setApiKey(geradora.apiKey || "");
    }
  }, [geradora]);

  const handleSave = () => {
    if (!nome || !potencia || !localizacao || !status) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const geradoraAtualizada = {
      ...geradora,
      nome,
      potencia,
      localizacao,
      status,
      clientesVinculados,
      marcaInversor,
      apiKey
    };

    onSave(geradoraAtualizada);
    onClose();
  };

  const handleDelete = () => {
    onDelete(geradora);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Geradora</DialogTitle>
          <DialogDescription>
            Atualize as informações da usina geradora.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="potencia" className="text-right">
              Potência
            </Label>
            <Input
              id="potencia"
              value={potencia}
              onChange={(e) => setPotencia(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Localização
            </Label>
            <Input
              id="location"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Input
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientesVinculados" className="text-right">
              Clientes Vinculados
            </Label>
            <Input
              id="clientesVinculados"
              type="number"
              value={clientesVinculados}
              onChange={(e) => setClientesVinculados(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="marcaInversor" className="text-right">
              Marca Inversor
            </Label>
            <Input
              id="marcaInversor"
              value={marcaInversor || ""}
              onChange={(e) => setMarcaInversor(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              value={apiKey || ""}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditarGeradoraModal;
