
import React, { useState } from 'react';
import { 
  Search, Plus, Home, Users, CheckCircle2, Wrench, 
  Camera, X, ArrowRight, MapPin, Zap, Droplets, 
  Wifi, Sofa, Bath, Layers, Wind, Anchor, 
  Car, Dog, Globe, Info
} from 'lucide-react';
import { Room, RoomStatus } from '../../types/index.ts';
import RoomDetails from './RoomDetails.tsx';
import { formatCurrency } from '../../utils/formatters.ts';

const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    number: '101',
    status: RoomStatus.OCUPADO,
    baseRent: 1200,
    description: 'Quitinete mobiliada com ar-condicionado.',
    address: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    city: 'Manaus',
    zipCode: '69000-000',
    images: ['https://picsum.photos/seed/room1/800/600'],
    residents: [
      { id: 't1', name: 'João Silva', cpf: '123.456.789-00', phone: '11999999999', email: 'joao@email.com', score: 85, photoUrl: 'https://picsum.photos/seed/user1/100/100' }
    ],
    documents: [],
    expenses: [],
    messages: [],
    features: {
      roomsCount: 1,
      bathroomsCount: 1,
      isFurnished: true,
      floorType: 'Cerâmica',
      airConditioning: 'SPLIT',
      hasHammockHooks: true,
      hasGarage: true,
      allowVehicles: true,
      allowPets: false
    },
    utilities: {
      waterIncluded: false,
      electricityIncluded: false,
      internetIncluded: true
    },
    isPublic: true
  }
];

const RoomManager: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = MOCK_ROOMS.filter(r => 
    r.number.includes(searchTerm) || 
    r.residents.some(res => res.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.OCUPADO:
        return <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg uppercase border border-emerald-100 dark:border-emerald-900/30"><CheckCircle2 size={10}/> Ocupado</span>;
      case RoomStatus.DISPONIVEL:
        return <span className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg uppercase border border-blue-100 dark:border-blue-900/30"><Home size={10}/> Livre</span>;
      case RoomStatus.MANUTENCAO:
        return <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg uppercase border border-amber-100 dark:border-amber-900/30"><Wrench size={10}/> Reparo</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Número ou morador..." 
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-bold dark:text-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsNewRoomModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 font-black text-sm uppercase tracking-widest active:scale-95"
        >
          <Plus size={18} />
          <span>Novo apartamento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredRooms.map(room => (
          <div 
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={room.images[0]} alt={`Quarto ${room.number}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4">
                {getStatusBadge(room.status)}
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">Aluguel</p>
                <p className="text-base font-black text-indigo-600 dark:text-indigo-400 leading-none">{formatCurrency(room.baseRent)}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Apartamento {room.number}</h3>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users size={16} />
                  <span className="text-xs font-black">{room.residents.length}</span>
                </div>
              </div>
              
              {room.residents.length > 0 ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <img src={room.residents[0].photoUrl} className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-700 shadow-sm object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{room.residents[0].name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Locatário Ativo</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Disponível</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <RoomDetails 
          room={selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
        />
      )}

      {isNewRoomModalOpen && (
        <NewApartmentModal onClose={() => setIsNewRoomModalOpen(false)} />
      )}
    </div>
  );
};

const NewApartmentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in zoom-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[48px] shadow-2xl flex flex-col overflow-hidden border border-white/10">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
              <Home size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Novo Apartamento</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Passo {step} de 3</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        <form className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 no-scrollbar" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Número / Identificação</label>
                  <input type="text" required placeholder="Ex: 101" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Valor do Aluguel</label>
                  <input type="number" required placeholder="R$ 0,00" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold text-sm dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} /> Endereço Completo
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Logradouro</label>
                    <input type="text" placeholder="Rua, Avenida..." className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm font-bold dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">CEP</label>
                    <input type="text" placeholder="00000-000" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm font-bold dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Bairro</label>
                    <input type="text" placeholder="Bairro" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm font-bold dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Cidade</label>
                    <input type="text" placeholder="Cidade" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm font-bold dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Estado</label>
                    <select className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm font-bold dark:text-white">
                      <option>AM</option><option>SP</option><option>RJ</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => setStep(2)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  Próximo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} /> Utilidades e Cobrança
                  </h4>
                  <div className="space-y-4">
                    {[
                      { id: 'water', label: 'Água Inclusa no Aluguel', icon: Droplets },
                      { id: 'energy', label: 'Energia Inclusa no Aluguel', icon: Zap },
                      { id: 'internet', label: 'Internet Inclusa', icon: Wifi },
                      { id: 'public', label: 'Disponível para Visualização Pública', icon: Globe },
                    ].map(item => (
                      <label key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                        </div>
                        <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <Sofa size={14} /> Características Técnicas
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Qtd. Quartos</label>
                      <input type="number" defaultValue={1} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm font-bold dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Qtd. Banheiros</label>
                      <input type="number" defaultValue={1} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm font-bold dark:text-white" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Tipo de Piso</label>
                      <input type="text" placeholder="Ex: Porcelanato, Cerâmica..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm font-bold dark:text-white" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Ar Condicionado</label>
                      <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm font-bold dark:text-white">
                        <option value="NENHUM">Nenhum</option>
                        <option value="SPLIT">Lugar para Split</option>
                        <option value="CAIXA">Lugar para Caixa (Janela)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="text-slate-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Voltar</button>
                <button type="button" onClick={() => setStep(3)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  Próximo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <Car size={14} /> Regras e Comodidades
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'furnished', label: 'Mobiliado', icon: Sofa },
                      { id: 'hammock', label: 'Armadores de Rede', icon: Anchor },
                      { id: 'garage', label: 'Possui Garagem', icon: Car },
                      { id: 'vehicles', label: 'Permite Veículos', icon: Car },
                      { id: 'pets', label: 'Permite Animais', icon: Dog },
                    ].map(item => (
                      <label key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                        </div>
                        <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <Camera size={14} /> Mídia e Fotos
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="aspect-video border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-400 transition-all bg-slate-50/50 dark:bg-slate-800/50">
                      <Camera size={24} />
                      <span className="text-[9px] font-black mt-2 uppercase tracking-widest">Foto Principal</span>
                    </button>
                    <button type="button" className="aspect-video border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-400 transition-all bg-slate-50/50 dark:bg-slate-800/50">
                      <Plus size={24} />
                      <span className="text-[9px] font-black mt-2 uppercase tracking-widest">Mais Fotos</span>
                    </button>
                  </div>
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-[32px] border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
                    <Info className="text-amber-600 shrink-0 mt-1" size={20} />
                    <p className="text-[11px] font-medium text-amber-800 dark:text-amber-300 leading-relaxed">
                      Ao marcar como "Público", um link exclusivo será gerado para que você possa enviar a interessados via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setStep(2)} className="text-slate-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Voltar</button>
                <button type="submit" className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95">
                  Finalizar Cadastro
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RoomManager;
