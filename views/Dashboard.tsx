
import React, { useMemo, useState } from 'react';
import { TimePunch, User, PunchType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { PUNCH_LABELS } from '../constants';

interface DashboardProps {
  punches: TimePunch[];
  users: User[];
}

const Dashboard: React.FC<DashboardProps> = ({ punches, users }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();
    const todayPunches = punches.filter(p => new Date(p.timestamp).toDateString() === todayStr);
    const activeTodayIds = new Set(todayPunches.map(p => p.userId));
    
    const activeCount = activeTodayIds.size;
    const totalCount = users.length;
    const latePunches = todayPunches.filter(p => {
      const time = new Date(p.timestamp);
      return p.type === 'IN' && (time.getHours() > 9 || (time.getHours() === 9 && time.getMinutes() > 0));
    });

    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    const chartData = last7Days.map(date => {
      const dayStr = date.toDateString();
      const count = new Set(punches
        .filter(p => new Date(p.timestamp).toDateString() === dayStr)
        .map(p => p.userId)).size;
      return { name: weekdays[date.getDay()], total: count };
    });

    return { activeCount, totalCount, lateCount: latePunches.length, chartData };
  }, [punches, users]);

  const userAnalysis = useMemo(() => {
    if (!selectedUser) return null;
    const userPunches = punches.filter(p => p.userId === selectedUser.id);
    const typeCounts = userPunches.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {} as Record<PunchType, number>);

    return {
      total: userPunches.length,
      punches: userPunches.slice(0, 10),
      typeCounts,
      lastSeen: userPunches[0]?.timestamp || null
    };
  }, [selectedUser, punches]);

  const pieData = [
    { name: 'Presentes', value: stats.activeCount, color: '#10b981' },
    { name: 'Ausentes', value: Math.max(0, stats.totalCount - stats.activeCount), color: '#f43f5e' },
  ];

  const handleExportAll = () => {
    alert('Relatório consolidado gerado! Iniciando download...');
  };

  const handleExportUserPDF = () => {
    window.print(); // Abre o diálogo de impressão, que permite salvar como PDF de forma nativa e profissional
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 print:p-0">
      {/* Header - Hidden in Print */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Painel de Controle</h2>
          <p className="text-sm text-slate-500">Métricas de frequência em tempo real</p>
        </div>
        <button 
          onClick={handleExportAll}
          className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-xl border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Relatório Geral
        </button>
      </div>

      {/* Main Stats - Hidden in Print */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Colaboradores</p>
          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-black text-slate-900">{stats.totalCount}</h3>
            <span className="text-emerald-500 text-sm font-bold">Base Ativa</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Presenças Hoje</p>
          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-black text-slate-900">{stats.activeCount}</h3>
            <span className="text-indigo-500 text-sm font-bold">
              {stats.totalCount > 0 ? Math.round((stats.activeCount/stats.totalCount)*100) : 0}% engajamento
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Atrasos (Hoje)</p>
          <div className="flex items-end justify-between">
            <h3 className={`text-4xl font-black ${stats.lateCount > 0 ? 'text-rose-500' : 'text-slate-900'}`}>{stats.lateCount}</h3>
            <span className="text-slate-400 text-sm font-bold">Meta: 0</span>
          </div>
        </div>
      </div>

      {/* Charts - Hidden in Print */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:hidden">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 mb-6">Volume de Registros (Últimos 7 dias)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 mb-6">Status da Operação Agora</h4>
          <div className="flex flex-col items-center">
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-8 mt-4">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span className="text-sm font-medium text-slate-600">{item.name}: {item.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Recent History List - Clickable for analysis */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm print:hidden">
        <h4 className="text-lg font-bold text-slate-900 mb-6">Histórico Recente (Clique para Análise)</h4>
        <div className="space-y-4">
          {punches.length > 0 ? punches.slice(0, 8).map(punch => {
            const punchUser = users.find(u => u.id === punch.userId);
            return (
              <div 
                key={punch.id} 
                onClick={() => punchUser && setSelectedUser(punchUser)}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-indigo-100 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="flex items-center gap-3">
                  <img src={punchUser?.avatar} className="w-10 h-10 rounded-full border border-white shadow-sm" alt="" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{punchUser?.name || 'Usuário Removido'}</p>
                    <p className="text-xs text-slate-500">{new Date(punch.timestamp).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                     punch.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                   }`}>{PUNCH_LABELS[punch.type]}</span>
                   <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                </div>
              </div>
            );
          }) : (
            <p className="text-center text-slate-400 py-10 italic">Nenhum registro no sistema ainda.</p>
          )}
        </div>
      </div>

      {/* User Analysis Modal */}
      {selectedUser && userAnalysis && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:relative print:bg-white print:p-0 print:block">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 print:max-h-none print:shadow-none print:rounded-none">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10 print:static print:p-4 print:border-b-2">
              <div className="flex items-center gap-4">
                <img src={selectedUser.avatar} className="w-16 h-16 rounded-2xl border-2 border-slate-100 object-cover" alt="" />
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{selectedUser.name}</h3>
                  <p className="text-sm font-medium text-slate-500">@{selectedUser.username} • {selectedUser.department || 'Geral'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 print:hidden">
                <button 
                  onClick={handleExportUserPDF}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Exportar PDF
                </button>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Individual Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Marcações</p>
                  <p className="text-2xl font-black text-slate-900">{userAnalysis.total}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entradas (IN)</p>
                  <p className="text-2xl font-black text-emerald-600">{userAnalysis.typeCounts['IN'] || 0}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saídas (OUT)</p>
                  <p className="text-2xl font-black text-slate-600">{userAnalysis.typeCounts['OUT'] || 0}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Último Visto</p>
                  <p className="text-xs font-bold text-slate-900">
                    {userAnalysis.lastSeen ? new Date(userAnalysis.lastSeen).toLocaleString('pt-BR') : 'Sem registros'}
                  </p>
                </div>
              </div>

              {/* Individual List */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <h4 className="text-sm font-black text-slate-900 p-6 bg-slate-50 border-b border-slate-100 uppercase tracking-widest">Registros de {selectedUser.name}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data/Hora</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">GPS / Geolocalização</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acurácia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {punches.filter(p => p.userId === selectedUser.id).map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-xs font-bold text-slate-900">{new Date(p.timestamp).toLocaleDateString('pt-BR')}</p>
                            <p className="text-[10px] text-slate-500">{new Date(p.timestamp).toLocaleTimeString('pt-BR')}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                              p.type === 'IN' || p.type === 'LUNCH_IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {PUNCH_LABELS[p.type]}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[10px] font-mono text-slate-400">
                            {p.location.latitude.toFixed(6)}, {p.location.longitude.toFixed(6)}
                          </td>
                          <td className="px-6 py-4 text-[10px] font-bold text-indigo-600">
                            ±{p.location.accuracy.toFixed(1)}m
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Print Footer */}
              <div className="hidden print:block pt-12 border-t-2 border-slate-100 text-center">
                <p className="text-xs font-bold text-slate-900">Energe Ponto - Relatório Individual Automático</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Gerado em {new Date().toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
