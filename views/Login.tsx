
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (identifier: string, password?: string, isBiometric?: boolean) => void;
  lastUser?: User;
}

const Login: React.FC<LoginProps> = ({ onLogin, lastUser }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(identifier, password);
  };

  const handleBiometric = () => {
    setIsScanning(true);
    // Simulação de leitura biométrica do Android
    setTimeout(() => {
      setIsScanning(false);
      // No mundo real, aqui chamamos a API nativa. 
      // Se houver um usuário lembrado, logamos direto.
      if (lastUser) {
        onLogin(lastUser.username, undefined, true);
      } else {
        alert('Digital não reconhecida ou nenhum usuário vinculado a este dispositivo.');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 lg:p-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Energe Ponto</h1>
          <p className="text-slate-500 mt-2 font-medium">Controle de jornada inteligente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Usuário ou E-mail</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
              placeholder="Digite seu usuário..."
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center">
          <div className="w-full flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-100"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ou use a Digital</span>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>

          <button 
            onClick={handleBiometric}
            disabled={isScanning}
            className={`
              relative w-24 h-24 rounded-3xl flex items-center justify-center transition-all border-2
              ${isScanning ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 hover:border-indigo-200 active:scale-90'}
            `}
          >
            {isScanning ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            )}
          </button>
          <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Toque para Digital</p>
        </div>
        
        <div className="mt-10 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-xs text-indigo-600 text-center">
          <p className="font-bold">Dica de Acesso:</p>
          <p>Admin: <span className="font-black">admin</span> / Senha: <span className="font-black">123</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
