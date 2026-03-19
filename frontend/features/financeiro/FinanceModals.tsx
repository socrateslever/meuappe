
import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.ts';

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'INCOME' | 'EXPENSE';
}

export const FinanceModal: React.FC<FinanceModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const isIncome = type === 'INCOME';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-white/10">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
              {isIncome ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {isIncome ? 'Registrar Recebimento' : 'Lançar Despesa'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Valor</label>
            <div className="relative">
              <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="number" 
                step="0.01"
                required
                placeholder="0,00"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-black text-lg dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Data</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="date" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Categoria</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm dark:text-white appearance-none">
                  {isIncome ? (
                    <>
                      <option>Aluguel</option>
                      <option>Taxa de Limpeza</option>
                      <option>Multa Contratual</option>
                      <option>Outros</option>
                    </>
                  ) : (
                    <>
                      <option>Manutenção</option>
                      <option>Água / Luz</option>
                      <option>Internet</option>
                      <option>Impostos</option>
                      <option>Outros</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Descrição / Observação</label>
            <div className="relative">
              <FileText className="absolute left-5 top-4 text-slate-400" size={20} />
              <textarea 
                rows={3}
                placeholder="Detalhes do lançamento..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-medium text-sm dark:text-white resize-none"
              ></textarea>
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-5 rounded-[24px] font-black text-white shadow-xl transition-all active:scale-[0.98] uppercase tracking-widest text-sm ${isIncome ? 'bg-emerald-600 shadow-emerald-200 dark:shadow-none hover:bg-emerald-700' : 'bg-rose-600 shadow-rose-200 dark:shadow-none hover:bg-rose-700'}`}
          >
            Confirmar Lançamento
          </button>
        </form>
      </div>
    </div>
  );
};
