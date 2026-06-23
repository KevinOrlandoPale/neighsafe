'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

// Configuração dos ícones personalizados do Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const emergencyIcon = L.icon({
  ...defaultIcon.options,
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
});

const warningIcon = L.icon({
  ...defaultIcon.options,
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
});

// Adicionada a prop onAssumeAlert para capturar o clique do botão dentro do mapa
export default function Map({ 
  alerts = [], 
  onAssumeAlert 
}: { 
  alerts?: AlertData[]; 
  onAssumeAlert?: (id: number) => void;
}) {
  const maputoPosition: [number, number] = [-25.9692, 32.5732];

  return (
    <MapContainer 
      center={maputoPosition} 
      zoom={13} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marcador da Esquadra */}
      <Marker position={maputoPosition} icon={defaultIcon}>
        <Popup>Esquadra Central</Popup>
      </Marker>

      {/* Renderizar os Alertas dinamicamente */}
      {alerts && alerts.map((alert) => {
        if (typeof alert.latitude !== 'number' || typeof alert.longitude !== 'number') {
          return null;
        }

        const timeString = new Date(alert.created_at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        return (
          <Marker 
            key={alert.id} 
            position={[alert.latitude, alert.longitude]} 
            icon={alert.type === 'EMERGÊNCIA' ? emergencyIcon : warningIcon}
          >
            {/* Adicionada classe personalizada para controlo total no CSS */}
            <Popup className="custom-incident-popup">
              <div className="bg-[#1e293b] p-5 rounded-2xl flex flex-col gap-4 w-[280px] border border-white/5 text-slate-200 font-sans">
                
                {/* Topo: Linha Indicadora e Hora */}
                <div className="flex justify-between items-center">
                  <div className={`w-5 h-1.5 rounded-full ${alert.type === 'EMERGÊNCIA' ? 'bg-red-600' : 'bg-orange-600'}`}></div>
                  <span className="text-xs text-slate-400 font-medium">{timeString}</span>
                </div>
                
                {/* Conteúdo */}
                <div>
                  <h4 className="font-bold text-white text-lg tracking-wide m-0 p-0 leading-tight">
                    {alert.title}
                  </h4>
                  <p className="text-sm text-slate-400 mt-1.5 m-0 p-0">
                    {alert.location}
                  </p>
                </div>
                
                {/* Botão de Ação integrado com o State do Dashboard */}
                <button 
                  onClick={() => onAssumeAlert && onAssumeAlert(alert.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-[#0ea5e9] hover:opacity-90 text-white py-2.5 rounded-xl font-semibold transition-all shadow-lg text-sm border-0 cursor-pointer block text-center"
                >
                  Despachar Autoridade
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}