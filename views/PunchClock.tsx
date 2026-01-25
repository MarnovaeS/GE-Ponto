import React, { useState, useEffect } from 'react';
import { User, TimePunch, PunchType, GeoLocation } from '../types';
import { PUNCH_LABELS } from '../constants';
import { Clock, MapPin, CheckCircle2, AlertCircle, Info } from 'lucide-react';

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
    
    // Sugestão inteligente baseada no último registro
    if (lastPunch) {
      if (lastPunch.type === 'IN') setPunchType('LUNCH_OUT');
      else if (lastPunch.type === 'LUNCH_OUT') setPunchType('LUNCH_IN');
      else if (lastPunch.type === 'LUNCH_IN') setPunchType('OUT');
      else setPunchType('IN');
    }

    const requestGPS = () => {
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
            setLocationError('O acesso ao GPS é obrigatório para registrar o ponto.');
            setLoadingLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000 }
        );
      }
    };

    requestGPS();
    return () => clearInterval(timer);
  }, [lastPunch]);

  const handlePunch = () => {
    if (!location) {
      alert('Aguarde a validação da localização GPS.');
      return;
    }

    const newPunch: TimePunch = {
      id: crypto.randomUUID(),
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
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center relative overflow-hidden">
        
        <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-5 py-2 rounded-full mb-6 font-bold text-sm">
          <Clock size={16} />
          {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(time)}
        </div>
        
        <div className="text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter mb-4 tabular-nums">
          {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        
        <div className="text-slate-500 mb-10 text-center font-medium">
          Olá, <span className="text-slate-900 font-bold">{user.name.split(' ')[0]}</span>. Selecione o tipo de registro:
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mb-12">
          {(Object.keys(PUNCH_LABELS) as PunchType[]).map((type) => (
            <button
              key={type}
              onClick={() => setPunchType(type)}
              className={`p-4 rounded-2xl border-2 transition-all text-xs font-black flex flex-col items-center gap-1 uppercase tracking-widest ${
                punchType === type 
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'border-slate-50 hover:border-slate-200 text-slate-400 bg-slate-50/50'
              }`}
            >
               {PUNCH_LABELS[type]}
            </button>
          ))}
        </div>

        <button 
          onClick={handlePunch}
          disabled={loadingLocation || !!locationError}
          className={`
            relative w-56 h-56 rounded-full border-[12px] flex flex-col items-center justify-center gap-2 transition-all active:scale-90
            ${loadingLocation || !!locationError 
              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 border-indigo-100 shadow-2xl shadow-indigo-200 text-white hover:bg-indigo-700'}
          `}
        >
          <MapPin size={40} className={loadingLocation ? 'animate-bounce' : ''} />
          <span className="text-lg font-black uppercase tracking-widest">Registrar</span>
        </button>

        <div className={`mt-10 flex items-center gap-2.5 px-6 py-3 rounded-2xl border transition-all ${
          loadingLocation ? 'bg-amber-50 border-amber-100 text-amber-700' :
          location ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
           {loadingLocation ? <Clock className="animate-spin" size={16} /> : 
            location ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
           <span className="text-xs font-bold uppercase tracking-tight">
             {loadingLocation ? 'Validando GPS...' : location ? `Localização Segura (±${location.accuracy.toFixed(0)}m)` : locationError}
           </span>
        </div>
      </div>

      {lastPunch && (
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex items-center justify-between text-white border border-white/5">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
               <Info size={24} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-slate-400">Último Registro</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black">{new Date(lastPunch.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded uppercase">{PUNCH_LABELS[lastPunch.type]}</span>
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-slate-400">Status</p>
             <p className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">Sincronizado</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PunchClock;