'use client';

import { useState, useEffect } from "react";

export default function AlertForm() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    priority: "medium",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const [loading, setLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState<"idle" | "fetching" | "success" | "error">("idle");

  // Captura automática da localização real do utilizador (HTML5 Geolocation API)
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }

    setGeoStatus("fetching");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setGeoStatus("success");
      },
      (error) => {
        console.error("Erro de Geolocalização:", error);
        setGeoStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("access");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          priority: formData.priority,
          latitude: formData.latitude, // Envia para o backend
          longitude: formData.longitude, // Envia para o backend
          notify_authorities: formData.priority === "high",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(JSON.stringify(data));
        return;
      }

      window.location.href = "/home";
    } catch (err) {
      console.error(err);
      alert("Erro ao criar alerta no servidor.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full max-w-2xl p-8 rounded-3xl bg-zinc-950/60 border border-zinc-800 backdrop-blur-xl shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Criar alerta</h1>
          <p className="text-zinc-500 text-sm mt-1">Notifica a comunidade sobre incidentes em tempo real.</p>
        </div>
        
        {/* Badge Dinâmico de Status do GPS */}
        <div>
          {geoStatus === "fetching" && (
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-xl font-medium animate-pulse">
              🟡 Detetando GPS...
            </span>
          )}
          {geoStatus === "success" && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-xl font-medium">
              🟢 GPS Vinculado
            </span>
          )}
          {geoStatus === "error" && (
            <span className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-xl font-medium">
              🔴 GPS Indisponível
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* TÍTULO */}
        <div>
          <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider block mb-2">O que está a acontecer?</label>
          <input
            name="title"
            placeholder="Ex: Assalto em andamento, Incêndio florestal..."
            value={formData.title}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition"
          />
        </div>

        {/* LOCALIZAÇÃO VISUAL */}
        <div>
          <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider block mb-2">Ponto de Referência / Bairro</label>
          <input
            name="location"
            placeholder="Ex: Matola, Bairro Fomento - Próximo ao mercado"
            value={formData.location}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition"
          />
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider block mb-2">Detalhes da Ocorrência</label>
          <textarea
            name="description"
            placeholder="Descreve a situação com o máximo de detalhes possível para ajudar as autoridades e vizinhos..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition resize-none"
          />
        </div>

        {/* PRIORIDADE */}
        <div>
          <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider block mb-2">Nível de Gravidade</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition appearance-none cursor-pointer"
          >
            <option value="low" className="bg-zinc-950 text-white">Baixa (Apenas informativo / Sem perigo imediato)</option>
            <option value="medium" className="bg-zinc-950 text-white">Média (Requer atenção dos residentes)</option>
            <option value="high" className="bg-zinc-950 text-white">Alta (Perigo iminente - Notifica as Autoridades)</option>
          </select>
        </div>

        {/* BOTÃO SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black font-extrabold tracking-wide text-sm transition duration-300 shadow-lg shadow-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed mt-2 transform active:scale-[0.99]"
        >
          {loading ? "A PUBLICAR ALERTA..." : "EMITIR ALERTA COMUNITÁRIO"}
        </button>
      </form>
    </div>
  );
}