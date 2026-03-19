
import React from 'react';
import { 
  LayoutDashboard, 
  Home, 
  FileText, 
  MessageSquare, 
  Wrench, 
  TrendingUp, 
  Users,
  LogOut,
  Menu,
  Bell,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  theme: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, theme, toggleTheme }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'financeiro', label: 'Financeiro', icon: TrendingUp },
    { id: 'quartos', label: 'Quartos', icon: Home },
    { id: 'contratos', label: 'Contratos', icon: FileText },
    { id: 'cobranca', label: 'Cobrança', icon: MessageSquare },
    { id: 'chamados', label: 'Manutenção', icon: Wrench },
    { id: 'usuarios', label: 'Locatários', icon: Users },
  ];

  const mobileItems = menuItems.slice(0, 5);

  const ThemeIcon = () => {
    if (theme === 'light') return <Sun size={20} />;
    if (theme === 'dark') return <Moon size={20} />;
    return <Monitor size={20} />;
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden flex-col md:flex-row transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 dark:bg-slate-900 text-white flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-black flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm">M</div>
            MeuAppê <span className="text-indigo-400 text-[10px] font-black tracking-tighter">PRO</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors"
          >
            <ThemeIcon />
            <span className="font-bold text-sm capitalize">{theme}</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">M</div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white capitalize truncate max-w-[150px] md:max-w-none">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <ThemeIcon />
            </button>
            <button className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden md:block text-right">
                <p className="text-xs font-black text-slate-900 dark:text-white">Admin</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">CRECI 12345</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-sm">
                AD
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 no-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] transition-colors duration-300">
          {mobileItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 3 : 2} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
          <button 
            onClick={onLogout}
            className="flex flex-col items-center gap-1 px-3 py-1 text-slate-400 dark:text-slate-500"
          >
            <LogOut size={20} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Sair</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default Layout;
