'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // Importação dinâmica do Next.js
import Link from 'next/link';

// Tipagem dos dados
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

// O SEGREDO ESTÁ AQUI: Importar o componente do mapa dinamicamente e desativar o SSR
const DynamicMap = dynamic(() => import('@/components/authority/Map'), { 
  ssr: false, // Isto impede o erro "window is not defined"
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#020617]">
      <span className="text-cyan-400 animate-pulse font-medium">A carregar mapa...</span>
    </div>
  )
});

export default function AuthorityDashboard() {
  const [stationName, setStationName] = useState('Esquadra');
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  useEffect(() => {
    const storedStation = localStorage.getItem('station_name');
    if (storedStation) setStationName(storedStation);

    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) return;

        const res = await fetch('http://127.0.0.1:8000/api/alerts/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          // Validação extra para garantir que só definimos o array se os dados forem válidos
          if (Array.isArray(data)) {
            setAlerts(data);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar alertas:", error);
      }
    };

    fetchAlerts();
    const intervalId = setInterval(fetchAlerts, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAssumeAlert = async (alertId: number) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("Token de acesso não encontrado.");
      return;
    }

    // Chamada para o endpoint focado na ação de assumir o caso
    const res = await fetch(`http://127.0.0.1:8000/api/alerts/${alertId}/assume/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      const updatedAlert = await res.json();
      console.log("Alerta assumido com sucesso:", updatedAlert);
      
      // Remove o alerta do estado local imediatamente para atualizar o feed e o mapa
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
      
      // Opcional: Aqui podes disparar uma notificação visual de sucesso na interface
    } else {
      const errorData = await res.json();
      console.error("Erro do servidor ao assumir alerta:", errorData.error || res.statusText);
    }
  } catch (error) {
    console.error("Falha na comunicação com o servidor:", error);
  }
};

  const criticalAlerts = alerts.filter(
    (a) => a.type === 'EMERGÊNCIA' || a.type === 'CRÍTICO' || a.title.toLowerCase().includes('assalto')
  );

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-[#020617] text-slate-200">
      
      {/* SIDEBAR */}
      <aside className="w-64 flex flex-col z-20 bg-[#0f172a] border-r border-white/5">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-cyan-400">Neigh Safe</h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Painel de Controlo</p>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-3 mt-4">
          <button className="w-full text-left px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            Vista Geral (Mapa)
          </button>
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <Link 
            href="/login"
            onClick={() => localStorage.removeItem('access')}
            className="w-full block text-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium"
          >
            Terminar Sessão
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden z-10">
        
        {/* HEADER */}
        <header className="h-20 flex items-center justify-between px-6 z-20 bg-[#0f172a] border-b border-white/5">
          <h1 className="text-xl font-semibold tracking-wide">Comando: <span className="text-cyan-400">{stationName}</span></h1>
          <div className="flex gap-4">
            <div className="bg-[#1e293b] px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-sm font-medium">{criticalAlerts.length} Alertas Críticos</span>
            </div>
          </div>
        </header>

        {/* ÁREA DE TRABALHO */}
        <div className="flex-1 overflow-hidden relative flex">
          
          <div className="flex-1 relative z-0 h-full w-full">
            <div className="absolute inset-0">
              {/* O componente DynamicMap é chamado aqui. Como tem ssr: false, não vai causar erro */}
              <DynamicMap alerts={alerts} onAssumeAlert={handleAssumeAlert} />
            </div>
          </div>

          {/* FEED LATERAL */}
          <aside className="w-[380px] h-full flex flex-col z-20 bg-[#0f172a] border-l border-white/5">
            <div className="p-5">
              <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                Feed em Tempo Real
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4 custom-scrollbar">
              {criticalAlerts.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">
                  <p>A aguardar ocorrências críticas...</p>
                </div>
              ) : (
                criticalAlerts.map((alert) => {
                  const timeString = new Date(alert.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', hour12: true
                  });

                  return (
                    <div key={alert.id} className="bg-[#1e293b] border border-white/5 p-5 rounded-2xl flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div className={`w-5 h-1.5 rounded-full ${alert.type === 'EMERGÊNCIA' ? 'bg-red-600' : 'bg-orange-600'}`}></div>
                        <span className="text-xs text-slate-400 font-medium">{timeString}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg tracking-wide">{alert.title}</h4>
                        <p className="text-sm text-slate-400 mt-1">{alert.location}</p>
                      </div>
                      <button 
                        onClick={() => handleAssumeAlert(alert.id)}
                        className="mt-1 w-full bg-gradient-to-r from-blue-600 to-[#0ea5e9] hover:opacity-90 text-white py-3 rounded-xl font-semibold transition-all shadow-lg"
                      >
                        Despachar Autoridade
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
          
        </div>
      </main>
    </div>
  );
}