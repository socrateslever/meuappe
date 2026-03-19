
import React, { useState } from 'react';
import { 
  Search, Plus, FileText, User, Calendar, 
  CheckCircle2, Clock, AlertTriangle, Download, 
  Eye, PenTool, ShieldCheck, X, Trash2, 
  FileSignature, Scale, Info, ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters.ts';
import { Contract, ContractStatus, Room, Tenant } from '../../types/index.ts';
import { LegalEngine } from '../../services/legalEngine.ts';

// Mock Data para Vínculos
const MOCK_TENANTS: Tenant[] = [
  { id: 't1', name: 'João Silva', cpf: '123.456.789-00', phone: '11999999999', email: 'joao@email.com', score: 85, photoUrl: 'https://picsum.photos/seed/user1/100/100' },
  { id: 't2', name: 'Maria Oliveira', cpf: '987.654.321-11', phone: '11988887777', email: 'maria@email.com', score: 92, photoUrl: 'https://picsum.photos/seed/user2/100/100' }
];

const MOCK_ROOMS: Room[] = [
  { id: 'r1', number: '101', status: 'OCUPADO' as any, baseRent: 1200, description: '', images: [], residents: [], documents: [], expenses: [], messages: [] },
  { id: 'r2', number: '102', status: 'DISPONIVEL' as any, baseRent: 1100, description: '', images: [], residents: [], documents: [], expenses: [], messages: [] }
];

const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'CTR-2024-001',
    roomId: 'r1',
    tenantId: 't1',
    startDate: '2024-01-10',
    endDate: '2025-01-10',
    dueDay: 10,
    status: ContractStatus.ACTIVE,
    finePercentage: 10,
    dailyInterestRate: 0.33,
    guaranteeType: 'CAUCAO',
    guaranteeValue: 2400,
    adjustmentIndex: 'IGP-M',
    rentValue: 1200,
    auditTrail: {
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      signedAt: '2024-01-10T14:30:00Z',
      hash: 'a7b8c9d0e1f2'
    }
  },
  {
    id: 'CTR-2024-002',
    roomId: 'r2',
    tenantId: 't2',
    startDate: '2024-04-01',
    endDate: '2025-04-01',
    dueDay: 5,
    status: ContractStatus.PENDING_SIGNATURE,
    finePercentage: 10,
    dailyInterestRate: 0.33,
    guaranteeType: 'FIADOR',
    guaranteeValue: 0,
    adjustmentIndex: 'IPCA',
    rentValue: 1100
  }
];

const ContractManager: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredContracts = contracts.filter(c => {
    const tenant = MOCK_TENANTS.find(t => t.id === c.tenantId);
    return tenant?.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.includes(searchTerm);
  });

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE:
        return <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg uppercase border border-emerald-100 dark:border-emerald-900/30"><CheckCircle2 size={10}/> Ativo</span>;
      case ContractStatus.PENDING_SIGNATURE:
        return <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg uppercase border border-amber-100 dark:border-amber-900/30"><Clock size={10}/> Assinatura</span>;
      case ContractStatus.EXPIRED:
        return <span className="flex items-center gap-1 text-[10px] font-black text-slate-600 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg uppercase border border-slate-100 dark:border-slate-700"><AlertTriangle size={10}/> Expirado</span>;
      case ContractStatus.TERMINATED:
        return <span className="flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-lg uppercase border border-rose-100 dark:border-rose-900/30"><X size={10}/> Rescindido</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por locatário ou contrato..." 
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 font-black text-sm uppercase tracking-wider active:scale-95"
        >
          <Plus size={18} />
          <span>Novo Contrato</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Ativos', value: contracts.filter(c => c.status === ContractStatus.ACTIVE).length, color: 'text-emerald-600' },
          { label: 'Pendentes', value: contracts.filter(c => c.status === ContractStatus.PENDING_SIGNATURE).length, color: 'text-amber-600' },
          { label: 'Vencendo', value: 2, color: 'text-indigo-600' },
          { label: 'Rescindidos', value: contracts.filter(c => c.status === ContractStatus.TERMINATED).length, color: 'text-rose-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value.toString().padStart(2, '0')}</p>
          </div>
        ))}
      </div>

      {/* Contracts List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredContracts.map(contract => {
          const tenant = MOCK_TENANTS.find(t => t.id === contract.tenantId);
          const room = MOCK_ROOMS.find(r => r.id === contract.roomId);
          
          return (
            <div 
              key={contract.id}
              onClick={() => setSelectedContract(contract)}
              className="bg-white dark:bg-slate-900 p-6 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group cursor-pointer"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                    <FileSignature size={32} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">{tenant?.name}</h3>
                      {getStatusBadge(contract.status)}
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Home size={14} /> Quarto {room?.number} • ID: {contract.id}
                    </p>
                    <div className="flex items-center gap-4 pt-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        <Calendar size={14} /> {formatDate(contract.startDate)}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        <Calendar size={14} /> {formatDate(contract.endDate)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between gap-4">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Aluguel Mensal</p>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(contract.rentValue)}</p>
                    <div className="flex items-center md:justify-end gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{contract.guaranteeType}</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{contract.adjustmentIndex}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                      <Eye size={20} />
                    </button>
                    <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                      <Download size={20} />
                    </button>
                    {contract.status === ContractStatus.PENDING_SIGNATURE && (
                      <button className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 dark:shadow-none">
                        <PenTool size={18} />
                        Assinar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legal Compliance Footer */}
      <div className="p-8 bg-slate-900 dark:bg-indigo-950 rounded-[40px] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center shrink-0 border border-white/10">
          <Scale size={40} className="text-indigo-400" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h4 className="font-black text-lg uppercase tracking-widest text-indigo-400">Motor Jurídico MeuAppê</h4>
          <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
            Nossa arquitetura garante que cada contrato gerado esteja em total conformidade com a <b>Lei do Inquilinato (8.245/91)</b>. 
            Cálculos de rescisão proporcional (Art. 4), reajustes anuais e auditoria de assinatura eletrônica são processados automaticamente 
            pelo nosso motor jurídico enterprise.
          </p>
        </div>
        <div className="flex gap-4 shrink-0">
          <div className="flex flex-col items-center p-3 bg-white/5 rounded-2xl border border-white/5">
            <ShieldCheck size={24} className="text-emerald-400 mb-1" />
            <span className="text-[9px] font-black uppercase opacity-60">LGPD OK</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white/5 rounded-2xl border border-white/5">
            <FileSignature size={24} className="text-blue-400 mb-1" />
            <span className="text-[9px] font-black uppercase opacity-60">Auditado</span>
          </div>
        </div>
      </div>

      {/* Contract Details Modal */}
      {selectedContract && (
        <ContractDetails 
          contract={selectedContract} 
          onClose={() => setSelectedContract(null)} 
          tenant={MOCK_TENANTS.find(t => t.id === selectedContract.tenantId)!}
          room={MOCK_ROOMS.find(r => r.id === selectedContract.roomId)!}
        />
      )}

      {/* New Contract Modal */}
      {isModalOpen && (
        <NewContractModal 
          onClose={() => setIsModalOpen(false)}
          rooms={MOCK_ROOMS.filter(r => r.status === 'DISPONIVEL' as any)}
          tenants={MOCK_TENANTS}
        />
      )}
    </div>
  );
};

// Sub-componente: Detalhes do Contrato
const ContractDetails: React.FC<{ contract: Contract, onClose: () => void, tenant: Tenant, room: Room }> = ({ contract, onClose, tenant, room }) => {
  const terminationFine = LegalEngine.calculateTerminationFine(contract, new Date().toISOString());

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[48px] shadow-2xl flex flex-col overflow-hidden border border-white/10">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Detalhes do Contrato</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{contract.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all text-slate-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 no-scrollbar">
          {/* Grid de Informações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Locatário</h4>
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                <img src={tenant.photoUrl} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm">{tenant.name}</p>
                  <p className="text-[10px] font-bold text-slate-500">{tenant.cpf}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Imóvel</h4>
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                  <Home size={24} />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm">Quarto {room.number}</p>
                  <p className="text-[10px] font-bold text-slate-500">QuitGestão Pro Unit</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Financeiro</h4>
              <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <p className="text-[10px] font-black uppercase opacity-70 mb-1">Aluguel Atual</p>
                <p className="text-2xl font-black">{formatCurrency(contract.rentValue)}</p>
              </div>
            </div>
          </div>

          {/* Termos e Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vigência e Regras</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-500">Início</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{formatDate(contract.startDate)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-500">Término</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{formatDate(contract.endDate)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-500">Dia de Vencimento</span>
                  <span className="text-sm font-black text-indigo-600">Todo dia {contract.dueDay}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-500">Multa por Atraso</span>
                  <span className="text-sm font-black text-rose-600">{contract.finePercentage}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Garantia e Reajuste</h4>
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-emerald-500" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Tipo de Garantia</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{contract.guaranteeType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-blue-500" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Índice de Reajuste</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{contract.adjustmentIndex} (Anual)</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Valor da Garantia</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(contract.guaranteeValue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auditoria Jurídica */}
          {contract.auditTrail && (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-[32px] border border-emerald-100 dark:border-emerald-900/30 space-y-4">
              <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck size={24} />
                <h4 className="font-black text-sm uppercase tracking-widest">Assinatura Eletrônica Auditada</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/50 uppercase">
                <div>
                  <p>IP de Origem</p>
                  <p className="text-emerald-800 dark:text-emerald-300">{contract.auditTrail.ip}</p>
                </div>
                <div>
                  <p>Data/Hora</p>
                  <p className="text-emerald-800 dark:text-emerald-300">{formatDate(contract.auditTrail.signedAt)}</p>
                </div>
                <div className="col-span-2">
                  <p>Hash de Integridade (SHA-256)</p>
                  <p className="text-emerald-800 dark:text-emerald-300 truncate">{contract.auditTrail.hash}</p>
                </div>
              </div>
            </div>
          )}

          {/* Ações de Rescisão */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-rose-600 bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
              <AlertTriangle size={20} />
              <div>
                <p className="text-[10px] font-black uppercase">Multa Rescisória Estimada (Art. 4)</p>
                <p className="text-lg font-black">{formatCurrency(terminationFine)}</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
                Baixar Contrato
              </button>
              <button className="flex-1 md:flex-none px-8 py-4 border-2 border-rose-200 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all">
                Rescindir Contrato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-componente: Modal de Novo Contrato
const NewContractModal: React.FC<{ onClose: () => void, rooms: Room[], tenants: Tenant[] }> = ({ onClose, rooms, tenants }) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in zoom-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[48px] shadow-2xl flex flex-col overflow-hidden border border-white/10">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Novo Vínculo Contratual</h2>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 md:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Selecionar Quarto</label>
              <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm dark:text-white">
                <option>Selecione um quarto livre...</option>
                {rooms.map(r => <option key={r.id} value={r.id}>Quarto {r.number} - {formatCurrency(r.baseRent)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Selecionar Locatário</label>
              <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm dark:text-white">
                <option>Selecione um cliente...</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.name} ({t.cpf})</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Data de Início</label>
              <input type="date" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Duração (Meses)</label>
              <input type="number" defaultValue={12} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm dark:text-white" />
            </div>
          </div>

          <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[32px] border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-4">
            <Info className="text-indigo-600 shrink-0 mt-1" size={20} />
            <p className="text-xs font-medium text-indigo-800 dark:text-indigo-300 leading-relaxed">
              Ao criar o contrato, o sistema gerará automaticamente as competências mensais e enviará o link de assinatura eletrônica para o e-mail do locatário.
            </p>
          </div>

          <button className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-[0.98] uppercase tracking-widest text-sm">
            GERAR CONTRATO JURÍDICO
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractManager;
