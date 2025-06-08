import { IPixIntegration } from "./IPixIntegration";
import { PixPayload } from "./pixUtils";

export const sicrediPix: IPixIntegration = {
  generatePixPayload: (options) => {
    // Para o Sicredi, vamos usar a implementação padrão do BR Code
    // Se houver regras específicas do Sicredi, elas seriam aplicadas aqui antes de construir a payload.
    const payload = new PixPayload(options);
    return payload.buildPayload();
  },
  // Futuramente, se houver APIs específicas para geração de QR Code do Sicredi,
  // métodos adicionais seriam implementados aqui.
}; 