'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Tipagem para os alertas
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

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Ícone vermelho para emergências
const emergencyIcon = L.icon({
  ...defaultIcon.options,
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
});

// Ícone laranja para suspeitos
const warningIcon = L.icon({
  ...defaultIcon.options,
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
});

export default function Map({ alerts = [] }: { alerts?: AlertData[] }) {
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
      
      {/* Marcador da Esquadra (Fixo) */}
      <Marker position={maputoPosition} icon={defaultIcon}>
        <Popup>Esquadra Central</Popup>
      </Marker>

      {/* Renderização com Validação de Segurança */}
      {alerts && alerts.map((alert) => {
        // Verifica se latitude e longitude são números válidos para evitar erro de runtime
        if (typeof alert.latitude !== 'number' || typeof alert.longitude !== 'number') {
          return null;
        }

        return (
          <Marker 
            key={alert.id} 
            position={[alert.latitude, alert.longitude]} 
            icon={alert.type === 'EMERGÊNCIA' ? emergencyIcon : warningIcon}
          >
            <Popup>
              <div className="font-sans">
                <strong className={alert.type === 'EMERGÊNCIA' ? 'text-red-600' : 'text-orange-500'}>
                  {alert.title}
                </strong>
                <p className="text-sm mt-1 text-gray-700">{alert.location}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}