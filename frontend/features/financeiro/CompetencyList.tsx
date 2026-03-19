
import React, { useState } from 'react';
import { Search, Filter, Download, Plus, MoreVertical, ChevronRight, Wallet, Calendar } from 'lucide-react';
import { CompetencyStatus } from '../../types/index.ts';
import { formatCurrency } from '../../utils/formatters.ts';

const CompetencyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const statusStyles = {
    [CompetencyStatus.A_VENCER]: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30',
    [CompetencyStatus.VENCIDO]: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30',
    [CompetencyStatus.PAGO]: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30',
    [CompetencyStatus.PAGO_PARCIAL]: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30',
    [CompetencyStatus.EM_NEGOCIACAO]: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30',
  };

  const statusLabels = {
    [CompetencyStatus.A_VENCER]: 'A Vencer',
    [CompetencyStatus.VENCIDO]: 'Vencido',
    [CompetencyStatus.PAGO]: 'Pago',
    [CompetencyStatus.PAGO_PARCIAL]: 'Parcial',
    [CompetencyStatus.EM_NEGOCIACAO]: 'Negociando',
  };

  const mockData = [
    { month: '04/2024', tenant: 'João Silva', room: '101', due: '10/04/2024', base: 1200, extra: 50.40, status: CompetencyStatus.VENCIDO },
    { month: '04/2024', tenant: 'Maria Oliveira', room: '205', due: '15/04/2024', base: 950, extra: 0, status: CompetencyStatus.A_VENCER },
    { month: '03/2024', tenant: 'Carlos Souza', room: '101', due: '05/03/2024', base: 1100, extra: 120, status: CompetencyStatus.PAGO },
    { month: '04/2024', tenant: 'Ana Costa', room: '303', due: '12/04/2024', base: 1300, extra: 0, status: CompetencyStatus.PAGO_PARCIAL },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white dark:bg-slate-900 p-4 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por locatário ou quarto..." 
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-bold dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <Filter size={18} />
            <span>Filtros</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all text-sm font-black shadow-xl shadow-indigo-500/20 uppercase tracking-wider">
            <Plus size={18} />
            <span>Lançar</span>
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Competência</th>
              <th className="px-8 py-5">Locatário / Quarto</th>
              <th className="px-8 py-5">Vencimento</th>
              <th className="px-8 py-5">Total</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockData.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-8 py-6 font-black text-slate-900 dark:text-white">{item.month}</td>
                <td className="px-8 py-6">
                  <div className="font-black text-slate-900 dark:text-white">{item.tenant}</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Quarto {item.room}</div>
                </td>
                <td className="px-8 py-6 text-slate-600 dark:text-slate-400 font-bold text-sm">{item.due}</td>
                <td className="px-8 py-6 font-black text-slate-900 dark:text-white text-lg">{formatCurrency(item.base + item.extra)}</td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusStyles[item.status]}`}>
                    {statusLabels[item.status]}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {mockData.map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">{item.month}</p>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">{item.tenant}</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Quarto {item.room}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusStyles[item.status]}`}>
                {statusLabels[item.status]}
              </span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Vencimento</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.due}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Total</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(item.base + item.extra)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetencyList;
