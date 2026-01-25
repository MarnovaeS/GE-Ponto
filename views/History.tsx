
import React, { useState } from 'react';
import { TimePunch, User, PunchType } from '../types';
import { PUNCH_LABELS } from '../constants';

interface HistoryProps {
  punches: TimePunch[];
  user: User;
}

const History: React.FC<HistoryProps> = ({ punches, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const myPunches = punches
    .filter(p => p.userId === user.id)
    .filter(p => {
      const dateStr = new Date(p.timestamp).toLocaleDateString();
      return dateStr.includes(searchTerm) || PUNCH_LABELS[p.type].toLowerCase().includes(searchTerm.toLowerCase());
    });

  const handleExport = () => {
    alert('Exportando seu espelho de ponto...');
    // Real export logic would generate a Blob here
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Meu Histórico</h2>
          <p className="text-sm text-slate-500">Consulta de registros individuais</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="text"
            placeholder="Buscar data ou tipo..."
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={handleExport}
            className="whitespace-nowrap text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hora</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tipo de Marcação</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Localização (GPS)</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myPunches.length > 0 ? myPunches.map((punch) => (
                <tr key={punch.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {new Date(punch.timestamp).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-indigo-600 tabular-nums">
                    {new Date(punch.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      punch.type === 'IN' || punch.type === 'LUNCH_IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {PUNCH_LABELS[punch.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                    {punch.location.latitude.toFixed(6)}, {punch.location.longitude.toFixed(6)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Validado
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium italic">Nenhum registro encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
