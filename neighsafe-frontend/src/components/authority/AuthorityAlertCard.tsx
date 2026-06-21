'use client';

import React from 'react';

interface AlertDetail {
  id: number;
  title: string;
  description: string;
  location: string;
  status: string;
  priority: string;
  created_at: string;
}

interface Props {
  alert: AlertDetail;
  onClose: () => void;
  onAssume: (id: number) => void;
}

export default function AuthorityAlertCard({ alert, onClose, onAssume }: Props) {
  return (
    <div className="absolute right-0 top-0 h-full w-[400px] bg-[#020617]/90 backdrop-blur-xl border-l border-white/10 p-8 shadow-2xl z-[1000] text-white flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Botão de Fechar */}
      <button 
        onClick={onClose} 
        className="text-gray-400 hover:text-white mb-6 text-sm flex items-center gap-2 transition"
      >
        <span>←</span> Voltar ao Mapa
      </button>
      
      {/* Cabeçalho do Card */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-red-400 bg-red-400/10 px-2 py-1 rounded">
          {alert.priority} Priority
        </span>
        <h1 className="text-2xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          {alert.title}
        </h1>
      </div>

      {/* Conteúdo Detalhado */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        <div>
          <label className="text-gray-500 text-xs uppercase">Descrição</label>
          <p className="text-white mt-1 leading-relaxed">{alert.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-500 text-xs uppercase">Localização</label>
            <p className="text-white mt-1">{alert.location}</p>
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase">Estado</label>
            <p className="text-cyan-400 mt-1 capitalize">{alert.status.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Ação de Assumir */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <button 
          onClick={() => onAssume(alert.id)}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
        >
          Assumir Ocorrência
        </button>
      </div>
    </div>
  );
}