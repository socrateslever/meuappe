
import { Tenant, Room, Competency, Contract } from '../types/index.ts';
import { FinanceEngine } from './financeEngine.ts';

export const CollectionEngine = {
  generateWhatsAppLink: (tenant: Tenant, room: Room, competency: Competency, contract: Contract, type: 'REMINDER' | 'DUE_DAY' | 'FRIENDLY' | 'FORMAL') => {
    const { total, fine, interest } = FinanceEngine.calculateFineAndInterest(competency, contract);
    const days = FinanceEngine.calculateOverdueDays(competency.dueDate);
    
    const messages = {
      REMINDER: `Olá ${tenant.name}, lembramos que o aluguel do quarto ${room.number} vence em breve. Valor: R$ ${total.toFixed(2)}.`,
      DUE_DAY: `Olá ${tenant.name}, hoje é o vencimento do seu aluguel (Quarto ${room.number}). Valor: R$ ${total.toFixed(2)}.`,
      FRIENDLY: `Olá ${tenant.name}, notamos um atraso de ${days} dias no aluguel do quarto ${room.number}. O valor atualizado com multa e juros é R$ ${total.toFixed(2)}. Podemos ajudar?`,
      FORMAL: `NOTIFICAÇÃO EXTRAJUDICIAL: ${tenant.name}, referente ao Quarto ${room.number}, informamos atraso de ${days} dias. Valor total: R$ ${total.toFixed(2)}. Evite medidas judiciais.`
    };

    const text = encodeURIComponent(messages[type]);
    return `https://wa.me/${tenant.phone.replace(/\D/g, '')}?text=${text}`;
  }
};
