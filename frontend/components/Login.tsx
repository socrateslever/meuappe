
import React, { useState } from 'react';
import { Lock, User, ArrowRight, Building2, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Regra: admin (case insensitive, trim whitespace) / 123456
    const normalizedUser = username.trim().toLowerCase();
    
    if (normalizedUser === 'admin' && password === '123456') {
      onLogin();
    } else {
      setError('Usuário ou senha incorretos. Tente admin / 123456');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[24px] shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/20 mb-4 animate-bounce-slow">
              <Building2 className="text-white" size={40} />
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">MeuAppê</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Gestão profissional de quitinetes</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-slate-200/60 dark:shadow-black/40 border border-slate-100 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">Usuário</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    placeholder="admin"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[24px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[24px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 active:scale-[0.97]"
              >
                ACESSAR PAINEL
                <ArrowRight size={22} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="py-10 px-6 text-center">
        <p className="text-slate-400 dark:text-slate-600 text-xs font-bold tracking-wide">
          Criado por{' '}
          <a 
            href="https://wa.me/5592993836812" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-500 font-black hover:text-indigo-700 transition-colors underline decoration-indigo-200 dark:decoration-indigo-900 underline-offset-4"
          >
            CapitalFlow Agência de Software - 92993836812
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Login;
