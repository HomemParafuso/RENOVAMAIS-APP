import { IPixIntegration } from "./IPixIntegration";
import { PixPayload } from "./pixUtils";

export const sicoobPix: IPixIntegration = {
  generatePixPayload: (options) => {
    // Para o Sicoob, também vamos usar a implementação padrão do BR Code inicialmente.
    // Se houver regras específicas do Sicoob, elas seriam aplicadas aqui.
    const payload = new PixPayload(options);
    return payload.buildPayload();
  },
}; 