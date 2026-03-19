
import React from 'react';
import { MessageSquare, Send, Clock, ShieldAlert, FileWarning } from 'lucide-react';

const CollectionManager: React.FC = () => {
  const templates = [
    { id: 'REMINDER', label: 'Lembrete Pré-Vencimento', icon: Clock, color: 'bg-blue-50 text-blue-600' },
    { id: 'DUE_DAY', label: 'Aviso de Vencimento', icon: Send, color: 'bg-indigo-50 text-indigo-600' },
    { id: 'FRIENDLY', label: 'Cobrança Amigável', icon: MessageSquare, color: 'bg-amber-50 text-amber-600' },
    { id: 'FORMAL', label: 'Notificação Formal', icon: ShieldAlert, color: 'bg-rose-50 text-rose-600' },
    { id: 'TERMINATION', label: 'Pré-Rescisão', icon: FileWarning, color: 'bg-slate-900 text-white' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Templates Sidebar */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Modelos Inteligentes</h3>
        <div className="space-y-2">
          {templates.map((t) => (
            <button 
              key={t.id}
              className="w-full flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all text-left group"
            >
              <div className={`p-2 rounded-lg ${t.color}`}>
                <t.icon size={20} />
              </div>
              <span className="font-medium text-slate-700 group-hover:text-indigo-600">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pending Collections List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Cobranças Pendentes</h3>
          <span className="text-sm text-slate-500">12 locatários em atraso</span>
        </div>

        <div className="space-y-3">
          {[
            { name: 'João Silva', room: '102', days: 15, value: 1250.40, phone: '11999999999' },
            { name: 'Carlos Souza', room: '101', days: 45, value: 2400.00, phone: '11888888888' },
            { name: 'Beatriz Lima', room: '304', days: 3, value: 850.00, phone: '11777777777' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-sm text-slate-500">Quarto {item.room} • {item.days} dias de atraso</p>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-xs text-slate-400 uppercase font-bold">Valor Atualizado</p>
                <p className="text-xl font-bold text-rose-600">R$ {item.value.toFixed(2)}</p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare size={18} />
                  <span>WhatsApp</span>
                </button>
                <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Histórico
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionManager;
