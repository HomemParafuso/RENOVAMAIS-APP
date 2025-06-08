import { crc16ccitt } from "./crc16";

interface PixPayloadOptions {
  nome: string;
  chavepix: string;
  valor: string;
  cidade: string;
  txtId: string;
}

export class PixPayload {
  private nome: string;
  private chavepix: string;
  private valor: string;
  private cidade: string;
  private txtId: string;

  constructor(options: PixPayloadOptions) {
    this.nome = options.nome;
    this.chavepix = options.chavepix;
    this.valor = options.valor.replace(',', '.'); // Ensure dot as decimal separator
    this.cidade = options.cidade;
    this.txtId = options.txtId;
  }

  private formatLength(value: string | number): string {
    const len = String(value).length;
    return String(len).padStart(2, '0');
  }

  public buildPayload(): string {
    const payloadFormat = '000201';

    const merchantAccount = `26${this.formatLength(`0014BR.GOV.BCB.PIX01${this.formatLength(this.chavepix)}${this.chavepix}`)}0014BR.GOV.BCB.PIX01${this.formatLength(this.chavepix)}${this.chavepix}`;
    const merchantCategCode = '52040000';
    const transactionCurrency = '5303986'; // BRL currency code
    const transactionAmount = `54${this.formatLength(parseFloat(this.valor).toFixed(2))}${parseFloat(this.valor).toFixed(2)}`;
    const countryCode = '5802BR';
    const merchantName = `59${this.formatLength(this.nome)}${this.nome}`;
    const merchantCity = `60${this.formatLength(this.cidade)}${this.cidade}`;
    const addDataField = `62${this.formatLength(`05${this.formatLength(this.txtId)}${this.txtId}`)}05${this.formatLength(this.txtId)}${this.txtId}`;

    let payload = (
      `${payloadFormat}${merchantAccount}` +
      `${merchantCategCode}${transactionCurrency}` +
      `${transactionAmount}${countryCode}` +
      `${merchantName}${merchantCity}` +
      `${addDataField}6304`
    );

    const crc = crc16ccitt(0xFFFF, payload);
    const crcHex = crc.toString(16).toUpperCase().padStart(4, '0');

    return `${payload}${crcHex}`;
  }
} 