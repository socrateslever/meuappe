
import { Competency, Contract, CompetencyStatus } from '../types/index.ts';
import { differenceInDays, isAfter, parseISO } from 'date-fns';

export const FinanceEngine = {
  calculateTotalDue: (competency: Competency): number => {
    return competency.items.reduce((acc, item) => acc + item.amount, 0);
  },

  calculateTotalPaid: (competency: Competency): number => {
    return competency.payments.reduce((acc, p) => acc + p.amount, 0);
  },

  calculateOverdueDays: (dueDate: string): number => {
    const today = new Date();
    const due = parseISO(dueDate);
    if (isAfter(today, due)) {
      return differenceInDays(today, due);
    }
    return 0;
  },

  calculateFineAndInterest: (competency: Competency, contract: Contract) => {
    const totalBase = FinanceEngine.calculateTotalDue(competency);
    const paid = FinanceEngine.calculateTotalPaid(competency);
    const balance = totalBase - paid;
    
    if (balance <= 0) return { fine: 0, interest: 0, total: 0 };

    const days = FinanceEngine.calculateOverdueDays(competency.dueDate);
    if (days <= 0) return { fine: 0, interest: 0, total: balance };

    const fine = balance * (contract.finePercentage / 100);
    const interest = balance * (contract.dailyInterestRate / 100) * days;

    return {
      fine,
      interest,
      total: balance + fine + interest
    };
  },

  getCompetencyStatus: (competency: Competency): CompetencyStatus => {
    const totalDue = FinanceEngine.calculateTotalDue(competency);
    const totalPaid = FinanceEngine.calculateTotalPaid(competency);
    const daysOverdue = FinanceEngine.calculateOverdueDays(competency.dueDate);

    if (totalPaid >= totalDue) return CompetencyStatus.PAGO;
    if (totalPaid > 0) return CompetencyStatus.PAGO_PARCIAL;
    if (daysOverdue > 0) return CompetencyStatus.VENCIDO;
    return CompetencyStatus.A_VENCER;
  }
};
