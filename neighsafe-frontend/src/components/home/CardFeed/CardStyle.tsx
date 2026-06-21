'use client';

import React, { useState } from "react";
import { MessageCircle, Eye, MoreVertical } from "lucide-react";

interface Data {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  comments: number;
  views: number;
  priority?: "low" | "medium" | "high"; // Mapeamento adicionado
  isOwner?: boolean;
  onDelete?: (id: number) => void;
}

const CardStyle: React.FC<Data> = ({
  id,
  title,
  subtitle,
  description,
  comments,
  views,
  priority,
  isOwner,
  onDelete
}) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const isHighPriority = priority === "high";

  return (
    <div
      className={`
        relative 
        w-full 
        rounded-2xl 
        p-5 
        flex flex-col 
        h-full
        backdrop-blur-lg 
        transition-all duration-300
        hover:scale-[1.02] 

        ${isHighPriority 
          ? "bg-red-950/20 border-2 border-red-500/60 shadow-lg shadow-red-500/10 hover:shadow-red-500/20" 
          : "bg-white/5 border border-white/10 hover:shadow-xl hover:shadow-blue-500/10"
        }
      `}
    >
      {/* Badge Superior Dinâmico (Prioridade 1) */}
      {isHighPriority && (
        <div className="absolute -top-3 left-5 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md animate-pulse z-10">
          🚨 EMERGÊNCIA / ALTA
        </div>
      )}

      {/* MENU BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition z-20"
      >
        <MoreVertical size={18} className="text-white" />
      </button>

      {/* MENU */}
      {menuOpen && (
        <div className="absolute right-2 top-12 bg-black/80 backdrop-blur-lg border border-white/10 rounded-lg p-2 z-50 flex flex-col gap-1">

          <button
            className="px-4 py-2 text-white hover:bg-white/10 text-left rounded"
            onClick={(e) => {
              e.stopPropagation();
              console.log("ver perfil");
            }}
          >
            Ver perfil
          </button>

          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(id);
              }}
              className="px-4 py-2 text-red-400 hover:bg-white/10 text-left rounded"
            >
              Deletar
            </button>
          )}

        </div>
      )}

      {/* HEADER */}
      <div className={`mb-3 ${isHighPriority ? "mt-2" : ""}`}>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
        {description}
      </p>

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">

        <div className="flex items-center gap-1">
          <MessageCircle size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">{comments}</span>
        </div>

        <div className="flex items-center gap-1">
          <Eye size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">{views}</span>
        </div>

      </div>

    </div>
  );
};

export default CardStyle;