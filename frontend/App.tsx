
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Login from './components/Login.tsx';
import Dashboard from './features/financeiro/Dashboard.tsx';
import CompetencyList from './features/financeiro/CompetencyList.tsx';
import CollectionManager from './features/cobranca/CollectionManager.tsx';
import RoomManager from './features/quartos/RoomManager.tsx';
import ContractManager from './features/contratos/ContractManager.tsx';

type Theme = 'light' | 'dark' | 'system';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('meuappe_auth') === 'true';
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('meuappe_theme') as Theme) || 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (t: Theme) => {
      root.classList.remove('light', 'dark');
      if (t === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(t);
      }
    };

    applyTheme(theme);
    localStorage.setItem('meuappe_theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const handleLogin = () => {
    localStorage.setItem('meuappe_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('meuappe_auth');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'financeiro':
        return <CompetencyList />;
      case 'cobranca':
        return <CollectionManager />;
      case 'quartos':
        return <RoomManager />;
      case 'contratos':
        return <ContractManager />;
      case 'chamados':
        return (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
            <h3 className="text-xl font-semibold text-slate-400">Módulo de Manutenção em Desenvolvimento</h3>
            <p className="text-slate-500 mt-2">Abertura de chamados e controle de custos.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
