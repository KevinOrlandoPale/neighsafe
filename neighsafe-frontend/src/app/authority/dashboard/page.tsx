'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Tipagem idêntica à do mapa
interface AlertData {
  id: number;
  type: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

// Importação dinâmica para evitar erros de renderização no servidor (SSR)
const DynamicMap = dynamic(() => import('@/components/authority/Map'), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-sm">
      <span className="text-cyan-400 animate-pulse font-medium">
        A inicializar satélite sobre Maputo...
      </span>
    </div>
  )
});

export default function AuthorityDashboard() {
  const [stationName, setStationName] = useState('Esquadra');
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  useEffect(() => {
    // Recuperar dados do LocalStorage
    const storedStation = localStorage.getItem('station_name');
    if (storedStation) setStationName(storedStation);

    // Função para ir buscar os alertas ao Django
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('access');
        
        // Verifica se o token existe antes de fazer o pedido
        if (!token) return;

        // AJUSTA O URL SE NECESSÁRIO para a tua rota do Django
        const res = await fetch('http://127.0.0.1:8000/api/alerts/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          setAlerts(data);
        } else {
          console.error("Erro na resposta do servidor:", res.status);
        }
      } catch (error) {
        console.error("Falha ao comunicar com a API:", error);
      }
    };

    // Fazer a primeira chamada imediatamente
    fetchAlerts();

    // Polling: Atualizar a cada 10 segundos para efeito de "Tempo Real"
    const intervalId = setInterval(fetchAlerts, 10000);
    
    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  // Contagem de alertas para o Header
  const emergencyCount = alerts.filter(a => a.type === 'EMERGÊNCIA').length;

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-slate-200">
      
      {/* EFEITOS DE LUZ (ORBS) DO NEIGH SAFE */}
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[100px] rounded-full top-[-100px] left-[-100px] z-0 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 blur-[100px] rounded-full bottom-[-80px] right-[-80px] z-0 pointer-events-none" />

      {/* 1. SIDEBAR LATERAL */}
      <aside className="w-64 flex flex-col z-20 bg-[#0f172a]/80 backdrop-blur-xl border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Neigh Safe
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Painel de Controlo</p>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-3 mt-4">
          <button className="w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-default">
            Vista Geral (Mapa)
          </button>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <Link 
            href="/login"
            onClick={() => localStorage.removeItem('access')}
            className="w-full block text-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          >
            Terminar Sessão
          </Link>
        </div>
      </aside>

      {/* 2. CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden z-10">
        
        {/* HEADER DE ESTATÍSTICAS */}
        <header className="h-20 flex items-center justify-between px-6 z-20 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10">
          <h1 className="text-xl font-semibold tracking-wide">Comando: <span className="text-cyan-400">{stationName}</span></h1>
          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${emergencyCount > 0 ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-slate-500'}`}></span>
              <span className="text-sm font-medium">{alerts.length} Alertas ({emergencyCount} Críticos)</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <span className="text-sm font-medium">Patrulhas Ativas</span>
            </div>
          </div>
        </header>

        {/* ÁREA DE TRABALHO: MAPA + FEED */}
        <div className="flex-1 overflow-hidden relative flex">
          
          {/* MAPA CONTAINER */}
          <div className="flex-1 relative z-0 h-full w-full">
            <div className="absolute inset-0">
              <DynamicMap alerts={alerts} />
            </div>
          </div>

          {/* 3. FEED DE ALERTAS LATERAL */}
          <aside className="w-[380px] h-full flex flex-col z-20 bg-[#0f172a]/80 backdrop-blur-xl border-l border-white/10 shadow-[-4px_0_24px_rgba(0,0,0,0.2)]">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                Feed em Tempo Real
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              
              {alerts.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">
                  <p>A aguardar ocorrências...</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className={`bg-white/5 border p-4 rounded-2xl flex flex-col gap-3 cursor-pointer hover:bg-white/10 transition-all duration-300 ${
                    alert.type === 'EMERGÊNCIA' 
                      ? 'border-red-500/30 hover:border-red-500/50 hover:shadow-[0_4px_20px_rgba(239,68,68,0.15)]' 
                      : 'border-orange-500/30 hover:border-orange-500/50 hover:shadow-[0_4px_20px_rgba(249,115,22,0.15)]'
                  }`}>
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold tracking-widest uppercase border ${
                        alert.type === 'EMERGÊNCIA'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 text-base">{alert.title}</h4>
                      <p className="text-sm text-slate-400 mt-0.5">{alert.location}</p>
                    </div>
                    <button className="mt-2 w-full text-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-600/40">
                      Despachar Autoridade
                    </button>
                  </div>
                ))
              )}

            </div>
          </aside>
          
        </div>
      </main>
    </div>
  );
}