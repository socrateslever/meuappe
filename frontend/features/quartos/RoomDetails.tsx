
import React, { useState } from 'react';
import { 
  X, Users, FileText, DollarSign, MessageSquare, 
  Image as ImageIcon, Plus, Download, Send, ShieldCheck,
  Droplets, Zap, TrendingUp, Wrench, MapPin, Sofa,
  Bath, Layers, Wind, Anchor, Car, Dog, Globe, Share2
} from 'lucide-react';
import { Room, RoomStatus } from '../../types/index.ts';
import { formatCurrency, formatDate } from '../../utils/formatters.ts';

interface RoomDetailsProps {
  room: Room;
  onClose: () => void;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ room, onClose }) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'moradores' | 'financeiro' | 'documentos' | 'chat'>('geral');
  const [newMessage, setNewMessage] = useState('');

  const tabs = [
    { id: 'geral', label: 'Geral', icon: ImageIcon },
    { id: 'moradores', label: 'Moradores', icon: Users },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'documentos', label: 'Docs', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[95vh] md:h-[90vh] rounded-t-[48px] md:rounded-[48px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border border-white/10">
        
        <div className="md:hidden w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-4 mb-2 shrink-0"></div>

        <div className="px-6 py-4 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <Home size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Apartamento {room.number}</h2>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${
                  room.status === RoomStatus.OCUPADO ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {room.status}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold flex items-center gap-2">
                <MapPin size={14} className="text-indigo-500" /> {room.address}, {room.neighborhood} - {room.city}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {room.isPublic && (
              <button className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl hover:bg-emerald-100 transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                <Share2 size={18} />
                <span className="hidden md:inline">Link Público</span>
              </button>
            )}
            <button onClick={onClose} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all text-slate-600 dark:text-slate-400">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 md:px-8 overflow-x-auto no-scrollbar shrink-0 bg-white dark:bg-slate-900">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-5 text-xs md:text-sm font-black transition-all border-b-4 whitespace-nowrap uppercase tracking-widest ${
                activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={18} strokeWidth={activeTab === tab.id ? 3 : 2} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white dark:bg-slate-950 no-scrollbar">
          {activeTab === 'geral' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Galeria de Fotos</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {room.images.map((img, i) => (
                      <div key={i} className="relative group rounded-[32px] overflow-hidden h-40 md:h-56 shadow-lg">
                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    ))}
                    <button className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-400 transition-all h-40 md:h-56 bg-slate-50/50 dark:bg-slate-900/50">
                      <Plus size={32} />
                      <span className="text-[10px] font-black mt-3 uppercase tracking-widest">Adicionar Foto</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-6">Configuração Financeira</h4>
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold opacity-80">Aluguel Mensal</span>
                        <span className="text-3xl font-black">{formatCurrency(room.baseRent)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                        <div>
                          <p className="text-[9px] font-black uppercase opacity-60 mb-1">Água</p>
                          <p className="text-sm font-black flex items-center gap-2">
                            {room.utilities.waterIncluded ? <CheckCircle2 size={14} className="text-emerald-400" /> : <X size={14} className="text-rose-400" />}
                            {room.utilities.waterIncluded ? 'Inclusa' : 'Cobrada'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase opacity-60 mb-1">Energia</p>
                          <p className="text-sm font-black flex items-center gap-2">
                            {room.utilities.electricityIncluded ? <CheckCircle2 size={14} className="text-emerald-400" /> : <X size={14} className="text-rose-400" />}
                            {room.utilities.electricityIncluded ? 'Inclusa' : 'Cobrada'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Quartos', val: room.features.roomsCount, icon: Home },
                      { label: 'Banheiros', val: room.features.bathroomsCount, icon: Bath },
                      { label: 'Mobiliado', val: room.features.isFurnished ? 'Sim' : 'Não', icon: Sofa },
                      { label: 'Piso', val: room.features.floorType, icon: Layers },
                      { label: 'Ar Cond.', val: room.features.airConditioning, icon: Wind },
                      { label: 'Armadores', val: room.features.hasHammockHooks ? 'Sim' : 'Não', icon: Anchor },
                      { label: 'Garagem', val: room.features.hasGarage ? 'Sim' : 'Não', icon: Car },
                      { label: 'Veículos', val: room.features.allowVehicles ? 'Sim' : 'Não', icon: Car },
                      { label: 'Animais', val: room.features.allowPets ? 'Sim' : 'Não', icon: Dog },
                    ].map((feat, i) => (
                      <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:border-indigo-200 transition-all">
                        <feat.icon size={20} className="text-slate-400 group-hover:text-indigo-500 mb-2 transition-colors" />
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">{feat.label}</p>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">{feat.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'moradores' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Locatários ({room.residents.length})</h4>
                <button className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-2 uppercase tracking-wider">
                  <Plus size={14} /> Novo Vínculo
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.residents.map(res => (
                  <div key={res.id} className="flex items-center gap-5 p-5 border border-slate-100 dark:border-slate-800 rounded-[32px] bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">
                    <img src={res.photoUrl} className="w-20 h-20 rounded-3xl object-cover shadow-inner" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-black text-slate-900 dark:text-white text-lg truncate">{res.name}</h5>
                      <p className="text-xs text-slate-500 font-medium mb-3">{res.email}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[9px] font-black bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg uppercase border border-emerald-100 dark:border-emerald-900/30">Score: {res.score}</span>
                        <span className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-lg uppercase">CPF: {res.cpf}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'financeiro' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-[32px] border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-emerald-600" />
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Receita Total</p>
                  </div>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{formatCurrency(14400)}</p>
                </div>
                <div className="p-6 bg-rose-50 dark:bg-rose-900/10 rounded-[32px] border border-rose-100 dark:border-rose-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench size={16} className="text-rose-600" />
                    <p className="text-[10px] text-rose-600 font-black uppercase tracking-widest">Manutenção</p>
                  </div>
                  <p className="text-2xl font-black text-rose-700 dark:text-rose-400">{formatCurrency(450)}</p>
                </div>
                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-[32px] border border-indigo-100 dark:border-indigo-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={16} className="text-indigo-600" />
                    <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">Lucro Líquido</p>
                  </div>
                  <p className="text-2xl font-black text-indigo-700 dark:text-indigo-400">{formatCurrency(13950)}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documentos' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Arquivo Digital</h4>
                <button className="bg-slate-900 dark:bg-indigo-600 text-white text-[10px] font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 uppercase tracking-wider shadow-lg">
                  <Plus size={14} /> Upload
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-5 border border-slate-100 dark:border-slate-800 rounded-[32px] bg-white dark:bg-slate-900 hover:border-indigo-200 transition-all group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                        <FileText size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 dark:text-white text-sm truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Enviado em {formatDate(doc.uploadedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Download size={20} /></button>
                      <ShieldCheck size={20} className="text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-full flex flex-col animate-in fade-in duration-300">
              <div className="flex-1 space-y-6 mb-6 overflow-y-auto pr-2 no-scrollbar">
                {room.messages.length > 0 ? room.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-[32px] shadow-sm ${
                      msg.isAdmin 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                    }`}>
                      <p className="text-[9px] font-black mb-2 uppercase tracking-widest opacity-70">{msg.senderName}</p>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      <p className="text-[9px] mt-3 text-right font-bold opacity-50">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 space-y-4">
                    <MessageSquare size={64} strokeWidth={1} />
                    <p className="text-sm font-black uppercase tracking-[0.3em]">Nenhuma mensagem</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-inner shrink-0">
                <input 
                  type="text" 
                  placeholder="Escreva para o morador..." 
                  className="flex-1 bg-transparent px-5 py-3 outline-none text-sm font-bold dark:text-white"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95">
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
