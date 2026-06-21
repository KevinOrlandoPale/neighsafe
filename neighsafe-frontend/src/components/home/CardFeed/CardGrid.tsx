'use client';

import React, { useEffect, useState } from "react";
import CardStyle from "./CardStyle";
import AlertModal from "./AlertModal";

interface Comment {
  id: number;
  text: string;
  author_name: string;
  created_at: string;
}

interface Alert {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  comments: Comment[];
  views: number;
  location: string;
  author_name: string;
  priority: "low" | "medium" | "high";
  // Adicionado o campo status para estilização dinâmica
  status: "active" | "in_resolution" | "resolved" | "false" | "pending_review";
}

export default function CardsGrid() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const token = localStorage.getItem("access");
        if (!token) throw new Error("Sem token, faz login primeiro");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao buscar alertas");

        const data = await response.json();
        
        // Extração robusta dos dados da API
        const extractAlerts = (payload: any): Alert[] => {
          if (Array.isArray(payload)) return payload;
          if (payload && Array.isArray(payload.results)) return payload.results;
          if (payload && Array.isArray(payload.data)) return payload.data;
          return [];
        };

        setAlerts(extractAlerts(data));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error("Erro ao deletar alerta:", err);
    }
  };

  if (loading) return <p className="text-gray-400 text-center mt-10">Carregando...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.priority === "high" && b.priority !== "high") return -1;
    if (a.priority !== "high" && b.priority === "high") return 1;
    return 0;
  });

  return (
    <>
      <section className="w-full px-4 mt-8 pb-10">
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800 rounded-3xl max-w-2xl mx-auto p-6">
            <p className="text-zinc-400 font-medium text-base">Nenhum alerta registado no sistema.</p>
            <p className="text-zinc-600 text-xs mt-1">A comunidade está segura neste momento.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="cursor-pointer"
                onClick={() => setSelectedAlert(alert)}
              >
                <CardStyle
                  id={alert.id}
                  title={alert.title}
                  subtitle={alert.subtitle || alert.location}
                  description={alert.description}
                  comments={Array.isArray(alert.comments) ? alert.comments.length : 0}
                  views={alert.views}
                  priority={alert.priority}
                  status={alert.status} // <--- Propriedade enviada para o Card
                  isOwner={true} 
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedAlert && (
        <AlertModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </>
  );
}