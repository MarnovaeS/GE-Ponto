
import React from 'react';

const SystemDocs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <section className="space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Roteiro de Implantação (Produção)</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Este guia detalha os passos necessários para tirar o PontoSmart do modo de demonstração e colocá-lo em operação real na sua empresa.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">1</div>
          <h3 className="text-xl font-bold text-slate-900">Configurar Banco de Dados</h3>
          <p className="text-sm text-slate-500">
            Atualmente os dados são locais. Para centralizar, utilize o <strong>Firebase</strong> ou <strong>Supabase</strong>. 
            Eles oferecem banco de dados em tempo real e autenticação segura de forma gratuita para pequenas equipes.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">2</div>
          <h3 className="text-xl font-bold text-slate-900">Gerar APK Android</h3>
          <p className="text-sm text-slate-500">
            Utilize o <strong>Capacitor.js</strong> para empacotar este código como um aplicativo nativo. 
            Isso permitirá o uso da biometria digital do sistema operacional e maior precisão do GPS em segundo plano.
          </p>
        </div>
      </div>

      <section className="bg-slate-900 text-white p-8 lg:p-12 rounded-[40px] space-y-8">
        <h2 className="text-3xl font-bold">Passo a Passo para Colocar no Ar</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-black">A</div>
            <div>
              <h4 className="font-bold text-lg">Hospedagem Web</h4>
              <p className="text-slate-400 text-sm">Publique o projeto na <strong>Vercel</strong> ou <strong>Netlify</strong> para que o Painel Administrativo seja acessível via link.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-black">B</div>
            <div>
              <h4 className="font-bold text-lg">Trocar LocalStorage por API</h4>
              <p className="text-slate-400 text-sm">No arquivo <code>App.tsx</code>, substitua o salvamento em disco local por chamadas <code>fetch()</code> ou <code>axios()</code> para o seu novo backend.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-black">C</div>
            <div>
              <h4 className="font-bold text-lg">Distribuição aos Funcionários</h4>
              <p className="text-slate-400 text-sm">Envie o link do site (PWA) para que eles "Instalem na Tela de Início" ou gere o APK assinado para distribuição direta.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-slate-900">Segurança e LGPD</h2>
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
          <h4 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Aviso de Produção
          </h4>
          <p className="text-amber-700 text-sm leading-relaxed">
            Ao migrar para produção, certifique-se de implementar políticas de privacidade claras, pois o sistema coleta dados sensíveis (localização e biometria). 
            Armazene as fotos de perfil em um Storage seguro (como S3 ou Firebase Storage) e nunca trafegue senhas em texto puro.
          </p>
        </div>
      </section>

      <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
         <h3 className="text-xl font-bold text-slate-900">Próximas Funcionalidades Sugeridas</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <h5 className="font-black text-indigo-600 text-[10px] uppercase tracking-widest mb-1">Tecnologia</h5>
               <h5 className="font-bold text-sm mb-1">Sincronização Offline</h5>
               <p className="text-xs text-slate-500">Permitir bater ponto sem internet e enviar quando houver conexão.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <h5 className="font-black text-emerald-600 text-[10px] uppercase tracking-widest mb-1">UX</h5>
               <h5 className="font-bold text-sm mb-1">Cerca Geográfica (Geofencing)</h5>
               <p className="text-xs text-slate-500">Bloquear o ponto se o funcionário estiver fora do raio da empresa.</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default SystemDocs;
