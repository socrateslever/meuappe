
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, 
  Wallet, Calendar, Plus, ArrowUpRight, ArrowDownRight,
  Zap, Droplets, Wifi, ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.ts';
import { FinanceModal } from './FinanceModals.tsx';

const data = [
  { name: 'Jan', recebido: 4500, previsto: 5000 },
  { name: 'Fev', recebido: 4800, previsto: 5000 },
  { name: 'Mar', recebido: 3200, previsto: 5000 },
  { name: 'Abr', recebido: 4900, previsto: 5000 },
];

const pieData = [
  { name: 'Em dia', value: 85, color: '#10b981' },
  { name: 'Atrasado', value: 10, color: '#f59e0b' },
  { name: 'Inadimplente', value: 5, color: '#ef4444' },
];

const Dashboard: React.FC = () => {
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE' | null>(null);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Painel de Controle</h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">Bem-vindo ao centro financeiro do seu MeuAppê.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setModalType('INCOME')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none active:scale-95"
          >
            <ArrowUpRight size={18} />
            <span>Receita</span>
          </button>
          <button 
            onClick={() => setModalType('EXPENSE')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 dark:shadow-none active:scale-95"
          >
            <ArrowDownRight size={18} />
            <span>Despesa</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 md:p-7 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">Recebido (Mês)</p>
          <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(18400)}</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-7 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl w-fit mb-4">
            <AlertCircle size={24} />
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">Vencido</p>
          <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(2150)}</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-7 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl w-fit mb-4">
            <TrendingDown size={24} />
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">Inadimplência</p>
          <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">5.4%</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-7 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mb-4">
            <Wallet size={24} />
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">Previsto</p>
          <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">{formatCurrency(22500)}</h3>
        </div>
      </div>

      {/* Charts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Fluxo de Caixa</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Recebido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Previsto</span>
              </div>
            </div>
          </div>
          <div className="h-72 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc', opacity: 0.1}} 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    padding: '16px'
                  }} 
                />
                <Bar dataKey="recebido" fill="#6366f1" radius={[12, 12, 0, 0]} barSize={40} />
                <Bar dataKey="previsto" fill="#e2e8f0" radius={[12, 12, 0, 0]} barSize={40} className="dark:opacity-10" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest">Saúde da Carteira</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius="70%" outerRadius="90%" paddingAngle={12} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-500 dark:text-slate-400 font-bold">{item.name}</span>
                  </div>
                  <span className="font-black text-slate-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <ShieldCheck className="mb-4 opacity-80" size={32} />
            <h4 className="text-sm font-black uppercase tracking-widest mb-2">Segurança Jurídica</h4>
            <p className="text-xs font-medium opacity-80 leading-relaxed">
              Seu MeuAppê monitora automaticamente prazos de reajuste e vencimentos conforme a Lei 8.245/91.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Atividade Recente</h4>
          <button className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-widest">Ver Extrato</button>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {[
            { type: 'INCOME', desc: 'Aluguel Quarto 101 - João Silva', date: 'Hoje, 14:30', val: 1250.40, cat: 'Aluguel' },
            { type: 'EXPENSE', desc: 'Reparo Elétrico Quarto 205', date: 'Ontem, 09:15', val: 180.00, cat: 'Manutenção' },
            { type: 'INCOME', desc: 'Aluguel Quarto 302 - Maria Oliveira', date: '12 Abr, 2024', val: 950.00, cat: 'Aluguel' },
            { type: 'EXPENSE', desc: 'Conta de Água - Condomínio', date: '10 Abr, 2024', val: 450.00, cat: 'Utilidades' },
          ].map((item, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'INCOME' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600'}`}>
                  {item.type === 'INCOME' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm md:text-base">{item.desc}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.cat}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-black ${item.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.type === 'INCOME' ? '+' : '-'} {formatCurrency(item.val)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <FinanceModal 
        isOpen={modalType !== null} 
        onClose={() => setModalType(null)} 
        type={modalType || 'INCOME'} 
      />
    </div>
  );
};

export default Dashboard;
