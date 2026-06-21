'use client';

import { useState, useEffect } from "react";

interface Comment {
  id: number;
  text: string;
  author_name?: string;
  author_id?: number;
  created_at?: string;
}

interface Alert {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  views: number;
  status: "active" | "in_resolution" | "resolved" | "false" | "pending_review";
  author_name?: string;
  author_id?: number;
  comments?: Comment[];
  confirmations_count?: number;
  false_reports_count?: number;
}

interface Props {
  alert: Alert;
  onClose: () => void;
}

const STATUS_BADGES = {
  active: { text: "🟢 ATIVO", className: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  in_resolution: { text: "🟡 EM RESOLUÇÃO", className: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  resolved: { text: "✅ RESOLVIDO", className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  false: { text: "❌ FALSO", className: "bg-rose-500/10 border-rose-500/20 text-rose-400" },
  pending_review: { text: "⚠️ SOB REVISÃO", className: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
};

export default function AlertModal({ alert, onClose }: Props) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  
  const [confirms, setConfirms] = useState(alert.confirmations_count || 0);
  const [falses, setFalses] = useState(alert.false_reports_count || 0);
  const [currentStatus, setCurrentStatus] = useState(alert.status || "active");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (alert?.id) {
      fetchComments();
      setConfirms(alert.confirmations_count || 0);
      setFalses(alert.false_reports_count || 0);
      setCurrentStatus(alert.status || "active");
    }
  }, [alert]);

  async function fetchComments() {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${alert.id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) return;
      const data = await response.json();
      setComments(Array.isArray(data.comments) ? data.comments : []);
      setConfirms(data.confirmations_count || 0);
      setFalses(data.false_reports_count || 0);
      if (data.status) setCurrentStatus(data.status);
    } catch (err) {
      console.error(err);
    }
  }

  // Altera o estado do alerta no Backend
  async function handleStatusChange(newStatus: string) {
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem("access");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${alert.id}/update-status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) return;
      const data = await response.json();
      setCurrentStatus(data.status);
    } catch (err) {
      console.error("Erro ao atualizar estado:", err);
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleVote(endpoint: "confirm" | "false-report") {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${alert.id}/${endpoint}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) return;
      const data = await response.json();
      setConfirms(data.confirmations_count);
      setFalses(data.false_reports_count);
      if (data.status) setCurrentStatus(data.status);
    } catch (err) {
      console.error(err);
    }
  }

  async function sendComment() {
    if (!commentText.trim()) return;
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${alert.id}/comment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText })
      });
      if (!response.ok) return;
      setCommentText("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-center p-3">
      <div className="w-full max-w-6xl h-[92vh] rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row relative">
        
        {/* ESQUERDA - Informações Principais do Alerta */}
        <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
          
          {/* Topo com Autor e Badge Dinâmico de Estado */}
          <div className="flex items-center justify-between">
            <p className="text-cyan-400 text-sm font-medium">{alert.author_name || "Utilizador"}</p>
            <span className={`inline-flex items-center border px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${STATUS_BADGES[currentStatus]?.className || STATUS_BADGES.active.className}`}>
              {STATUS_BADGES[currentStatus]?.text || "ATIVO"}
            </span>
          </div>

          <h1 className="text-white text-3xl font-bold mt-3">{alert.title}</h1>
          
          {/* PAINEL DE CONTROLO DE ESTADO (Apenas Administrativo / Autor) */}
          <div className="mt-3 bg-zinc-900/30 border border-zinc-900 p-3 rounded-xl flex items-center justify-between gap-4">
            <span className="text-zinc-400 text-xs font-semibold">Atualizar estado da ocorrência:</span>
            <select
              value={currentStatus}
              disabled={updatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer disabled:opacity-50"
            >
              <option value="active">🟢 Ativo</option>
              <option value="in_resolution">🟡 Em Resolução</option>
              <option value="resolved">✅ Resolvido</option>
              <option value="false">❌ Falso Relato</option>
              <option value="pending_review">⚠️ Sob Revisão</option>
            </select>
          </div>
          
          {/* Localização Inteligência (Ajustes de Link em Standby) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pb-4 border-b border-zinc-900">
            <p className="text-gray-400 text-sm flex items-center gap-1.5">
              📍 {alert.location}
            </p>
            
            {alert.latitude && alert.longitude && (
              <a
                href={`https://maps.google.com/?q=${alert.latitude},${alert.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-1.5 rounded-xl text-cyan-400 text-xs font-semibold transition w-fit"
              >
                🗺️ Abrir localização
              </a>
            )}
          </div>
          
          <p className="text-gray-300 mt-6 whitespace-pre-wrap text-base leading-relaxed flex-1">{alert.description}</p>
          
          {/* Sistema de Confirmação Comunitária */}
          <div className="mt-8 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Validação da Comunidade</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => handleVote("confirm")}
                className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-sm font-medium transition"
              >
                ✔ Confirmar ocorrência ({confirms})
              </button>
              <button 
                onClick={() => handleVote("false-report")}
                className="flex items-center gap-2 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 px-4 py-2 rounded-xl text-rose-400 text-sm font-medium transition"
              >
                ❌ Não encontrei nada ({falses})
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-900 text-gray-500 text-sm">
            👁 {alert.views} visualizações
          </div>
        </div>

        {/* DIREITA - Painel Lateral de Comentários */}
        <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col bg-zinc-950/50">
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-8 text-sm">Sem comentários nesta ocorrência.</p>
            )}
            {comments.map((comment) => (
              <div key={comment.id} className="bg-zinc-900/60 border border-zinc-900/80 rounded-xl p-4">
                <div className="text-cyan-400 text-xs font-bold">{comment.author_name || "Utilizador"}</div>
                <p className="text-zinc-200 mt-1.5 text-sm leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>

          {/* Input de Envio de Comentários */}
          <div className="p-4 border-t border-zinc-800 flex gap-2 bg-zinc-950">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escreve um comentário público..."
              className="flex-1 rounded-xl px-4 h-11 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm border border-zinc-850"
            />
            <button 
              onClick={sendComment} 
              className="px-5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-black font-bold text-sm transition"
            >
              Enviar
            </button>
          </div>
        </div>

        {/* Botão Flutuante de Fecho X */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-zinc-400 hover:text-white text-2xl transition z-10 p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}