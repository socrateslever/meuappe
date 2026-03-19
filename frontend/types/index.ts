
export enum CompetencyStatus {
  A_VENCER = 'A_VENCER',
  VENCIDO = 'VENCIDO',
  PAGO = 'PAGO',
  PAGO_PARCIAL = 'PAGO_PARCIAL',
  EM_NEGOCIACAO = 'EM_NEGOCIACAO'
}

export enum RoomStatus {
  DISPONIVEL = 'DISPONIVEL',
  OCUPADO = 'OCUPADO',
  MANUTENCAO = 'MANUTENCAO'
}

export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED'
}

export interface Tenant {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  photoUrl?: string;
  score: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'CONTRATO' | 'RG' | 'CPF' | 'COMPROVANTE' | 'OUTRO';
  url: string;
  uploadedAt: string;
}

export interface RoomExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'MANUTENCAO' | 'UTILIDADE' | 'MELHORIA';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface Room {
  id: string;
  number: string;
  status: RoomStatus;
  baseRent: number;
  description: string;
  images: string[];
  residents: Tenant[];
  documents: Document[];
  expenses: RoomExpense[];
  messages: ChatMessage[];
}

export interface Contract {
  id: string;
  roomId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  dueDay: number;
  status: ContractStatus;
  finePercentage: number;
  dailyInterestRate: number;
  guaranteeType: 'CAUCAO' | 'FIADOR' | 'SEGURO_FIANCA';
  guaranteeValue: number;
  adjustmentIndex: 'IGP-M' | 'IPCA';
  rentValue: number;
  witnesses?: { name: string; cpf: string }[];
  auditTrail?: {
    ip: string;
    userAgent: string;
    signedAt: string;
    hash: string;
  };
}

export interface Competency {
  id: string;
  contractId: string;
  month: number;
  year: number;
  dueDate: string;
  status: CompetencyStatus;
  items: ChargeItem[];
  payments: PaymentRecord[];
}

export interface ChargeItem {
  id: string;
  description: string;
  amount: number;
  type: 'RENT' | 'WATER' | 'ELECTRICITY' | 'INTERNET' | 'OTHER';
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
}
