
import React, { useState, useEffect } from 'react';
import { User, TimePunch, PunchType, GeoLocation } from '../types';
import { PUNCH_LABELS } from '../constants';

interface PunchClockProps {
  user: User;
  onPunch: (punch: TimePunch) => void;
  lastPunch?: TimePunch;
}

const PunchClock: React.FC<PunchClockProps> = ({ user, onPunch, lastPunch }) => {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [punchType, setPunchType] = useState<PunchType>('IN');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Auto-suggest next punch based on last record
    if (lastPunch) {
      if (lastPunch.type === 'IN') setPunchType('LUNCH_OUT');
      else if (lastPunch.type === 'LUNCH_OUT') setPunchType('LUNCH_IN');
      else if (lastPunch.type === 'LUNCH_IN') setPunchType('OUT');
      else setPunchType('IN');
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
          setLoadingLocation(false);
        },
        (err) => {
          setLocationError('GPS obrigatório para bater o ponto.');
          setLoadingLocation(false);
        }
      );
    }

    return () => clearInterval(timer);
  }, [lastPunch]);

  const handlePunch = () => {
    if (!location) {
      alert('Localização obrigatória para registrar o ponto.');
      return;
    }

    // Business Logic: Avoid same-type consecutive punches
    if (lastPunch?.type === punchType) {
      const confirmDup = confirm(`Você já registrou ${PUNCH_LABELS[punchType]} recentemente. Deseja registrar novamente?`);
      if (!confirmDup) return;
    }

    const newPunch: TimePunch = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      timestamp: new Date().toISOString(),
      type: punchType,
      location: location,
      deviceInfo: navigator.userAgent
    };

    onPunch(newPunch);
    alert(`${PUNCH_LABELS[punchType]} registrado com sucesso!`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        
        <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full mb-6 relative z-10">
          {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(time)}
        </div>
        
        <div className="text-7xl lg:text-9xl font-black text-slate-900 tracking-tighter mb-4 tabular-nums relative z-10">
          {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        
        <p className="text-slate-500 mb-10 text-center max-w-sm font-medium">
          Olá, <span className="text-slate-900 font-bold">{user.name}</span>. Seu GPS está ativo e pronto para registro.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-12">
          {(Object.keys(PUNCH_LABELS) as PunchType[]).map((type) => (
            <button
              key={type}
              onClick={() => setPunchType(type)}
              className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold flex flex-col items-center gap-1 group ${
                punchType === type 
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
                  : 'border-slate-100 hover:border-slate-200 text-slate-400 bg-white'
              }`}
            >
               <span className="uppercase text-[9px] tracking-widest opacity-80">Tipo</span>
               <span>{PUNCH_LABELS[type]}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={handlePunch}
          disabled={loadingLocation || !!locationError}
          className={`
            group relative w-full max-w-xs h-64 rounded-full border-[12px] flex flex-col items-center justify-center gap-3 transition-all
            ${loadingLocation || !!locationError ? 'bg-slate-100 border-slate-200 grayscale cursor-not-allowed opacity-50' : 'bg-emerald-500 border-emerald-100 hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-200 text-white'}
          `}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
          <svg className="w-16 h-16 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
          <span className="text-xl font-black uppercase tracking-widest relative z-10">Confirmar</span>
        </button>

        <div className="mt-12 flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
           <div className={`w-3 h-3 rounded-full ${loadingLocation ? 'bg-amber-400 animate-pulse' : location ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
           <span className="text-sm font-bold text-slate-600 uppercase tracking-tighter">
             {loadingLocation ? 'Sincronizando GPS...' : location ? 'Localização Validada' : locationError}
           </span>
        </div>
      </div>

      {lastPunch && (
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 flex items-center justify-between text-white animate-in slide-in-from-top-2 duration-700">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Último Registro Efetuado</p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black">{new Date(lastPunch.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              <div className="h-6 w-px bg-white/20"></div>
              <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-lg uppercase tracking-wider">{PUNCH_LABELS[lastPunch.type]}</span>
            </div>
          </div>
          <div className="text-right hidden sm:block">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Precisão GPS</p>
             <p className="text-sm font-mono font-bold">{lastPunch.location.accuracy.toFixed(1)}m</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PunchClock;
