'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import AuthorityAlertCard from '@/components/authority/AuthorityAlertCard'; // Importação do card modularizado

// Carregamento dinâmico para evitar problemas com o SSR do Next.js (pois o Leaflet depende do objeto window)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

export default function AuthorityDashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Carregar lista de alertas críticos ao iniciar o componente
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/map-data/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }
    })
    .then(res => res.json())
    .then(data => setAlerts(data))
    .catch(err => console.error("Erro ao carregar dados do mapa:", err));
  }, []);

  // 2. Função para buscar detalhes completos do alerta específico ao clicar no pino
  const handleMarkerClick = async (alertId: number) => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${alertId}/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }
    });
    const data = await res.json();
    setSelectedAlert(data);
    setLoading(false);
  };

  // 3. Função para assumir a ocorrência (fluxo de despacho policial)
  const handleAssume = async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${id}/assume/`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      alert("Ocorrência assumida. A equipa foi notificada.");
      // Fecha a sidebar após o sucesso
      setSelectedAlert(null);
      // Remove o alerta assumido da lista local para limpar o pino do mapa
      setAlerts(prev => prev.filter(a => a.id !== id));
    } else {
      alert("Erro ao assumir ocorrência.");
    }
  };

  return (
    <div className="w-screen h-screen relative flex">
      
      {/* MAPA - Renderizado com o centro definido para a área de atuação */}
      <MapContainer center={[-25.965, 32.589]} zoom={13} className="flex-1 h-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Renderização dos marcadores para cada alerta crítico */}
        {alerts.map((alert: any) => (
          <Marker 
            key={alert.id} 
            position={[alert.lat, alert.lng]} 
            eventHandlers={{ click: () => handleMarkerClick(alert.id) }}
          />
        ))}
      </MapContainer>

      {/* SIDEBAR DE DETALHES - Exibe o card quando um pino é selecionado */}
      {selectedAlert && (
        <AuthorityAlertCard 
          alert={selectedAlert} 
          onClose={() => setSelectedAlert(null)}
          onAssume={handleAssume}
        />
      )}

      {/* Opcional: Feedback visual de carregamento */}
      {loading && (
        <div className="absolute top-4 right-4 z-[2000] bg-blue-600 text-white px-4 py-2 rounded-lg animate-pulse">
          Carregando detalhes...
        </div>
      )}
    </div>
  );
}