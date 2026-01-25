import React, { useState } from 'react';
import { Fingerprint, Clock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (identifier: string, password?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(identifier, password);
  };

  const handleBiometric = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert('Sensor biométrico não detectado via navegador. Use usuário e senha.');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      {/* Background Decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl overflow-hidden p-8 lg:p-12 relative z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-200">
             <Clock size={40} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Energe Ponto</h1>
          <p className="text-slate-500 mt-2 font-medium">Sua jornada, bem cuidada.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Usuário / Email</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-700"
              placeholder="Digite seu login..."
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-700"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 group"
          >
            Acessar Sistema
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center">
          <div className="w-full flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-100"></div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Biometria Android</span>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>

          <button 
            onClick={handleBiometric}
            disabled={isScanning}
            className={`
              relative w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all border-2
              ${isScanning ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 hover:border-indigo-200 active:scale-90'}
            `}
          >
            {isScanning ? (
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Fingerprint size={48} className="text-indigo-600" strokeWidth={1.5} />
            )}
          </button>
          <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Touch ID</p>
        </div>
        
        <div className="mt-12 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] text-slate-400 text-center font-bold">
          ADMIN: <span className="text-indigo-600">admin@empresa.com</span> / SENHA: <span className="text-indigo-600">123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;