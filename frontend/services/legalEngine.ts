
import { Contract } from '../types/index.ts';
import { differenceInMonths, parseISO } from 'date-fns';

export const LegalEngine = {
  /**
   * Art. 4 da Lei 8.245/91: Multa proporcional ao tempo restante do contrato.
   */
  calculateTerminationFine: (contract: Contract, terminationDate: string): number => {
    const start = parseISO(contract.startDate);
    const end = parseISO(contract.endDate);
    const term = parseISO(terminationDate);
    
    const totalMonths = differenceInMonths(end, start);
    const monthsRemaining = differenceInMonths(end, term);
    
    if (monthsRemaining <= 0) return 0;

    // Padrão de mercado: 3 meses de aluguel como base de multa
    const baseFine = 3000; // Exemplo fixo para demonstração
    return (baseFine / totalMonths) * monthsRemaining;
  },

  generateAuditHash: (data: any): string => {
    return btoa(JSON.stringify(data)).substring(0, 16);
  }
};
