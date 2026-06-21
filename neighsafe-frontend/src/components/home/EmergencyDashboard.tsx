'use client';

import { useEffect, useState } from "react";

interface Stats {
  active: number;
  in_resolution: number;
  resolved: number;
  critical: number;
}

export default function EmergencyDashboard() {
  const [stats, setStats] = useState<Stats>({ active: 0, in_resolution: 0, resolved: 0, critical: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/stats/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Erro ao carregar estatísticas do centro de emergência:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    // Atualiza os dados automaticamente a cada 30 segundos para manter o aspeto "tempo real"
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-zinc-900/50 border border-zinc-800/80" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* CARD 1 - CRÍTICOS */}
      <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 backdrop-blur-md flex flex-col justify-between">
        <span className="text-rose-400 text-xs font-bold uppercase tracking-wider">Perigo Crítico</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-white text-3xl font-black">{stats.critical}</span>
          <span className="text-rose-500 text-xs animate-ping">●</span>
        </div>
      </div>

      {/* CARD 2 - ATIVOS */}
      <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 backdrop-blur-md flex flex-col justify-between">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Casos Ativos</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-white text-3xl font-black">{stats.active}</span>
        </div>
      </div>

      {/* CARD 3 - EM RESOLUÇÃO */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 backdrop-blur-md flex flex-col justify-between">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Em Resolução</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-white text-3xl font-black">{stats.in_resolution}</span>
        </div>
      </div>

      {/* CARD 4 - RESOLVIDOS */}
      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-md flex flex-col justify-between">
        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Casos Resolvidos</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-white text-3xl font-black">{stats.resolved}</span>
          <span className="text-emerald-500 text-xs"></span>
        </div>
      </div>

    </div>
  );
}