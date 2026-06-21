'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  
  // Estado para armazenar os dados introduzidos pelo utilizador
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Estados para controlo de carregamento e mensagens de erro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função que atualiza o estado em tempo real enquanto o utilizador digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Função principal disparada quando o formulário é submetido
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);
  setError('');

  try {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/token/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.detail ||
        "Email ou password inválidos"
      );
    }

    localStorage.setItem(
      "access",
      data.access
    );

    localStorage.setItem(
      "refresh",
      data.refresh
    );

    document.cookie =
      `access=${data.access}; path=/`;

    let userInfo = data.user;

    if (!userInfo) {

      const resMe = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/me/`,
        {
          headers: {
            Authorization:
              `Bearer ${data.access}`
          }
        }
      );

      if (resMe.ok) {
        userInfo =
          await resMe.json();
      }

    }

    if (!userInfo) {
      throw new Error(
        "Não foi possível obter utilizador"
      );
    }

    localStorage.setItem(
      "user_info",
      JSON.stringify(userInfo)
    );

    if (userInfo.is_authority) {

      localStorage.setItem(
        "station_name",
        userInfo.station_name || ""
      );

      router.push(
        "/authority/dashboard"
      );

    } else {

      router.push(
        "/home"
      );

    }

  } catch (err: any) {

    setError(
      err.message
    );

  } finally {

    setLoading(false);

  }

};

  return (
    <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
      <form onSubmit={handleLogin} className='flex flex-col gap-4'>
        
        {/* Campo de Email */}
        <div className='flex flex-col'>
          <label className='text-white mb-1 text-sm'>Email</label>
          <input
            name="email"
            type="email" // Alterado para type="email" para melhor validação no frontend
            placeholder='Introduza o seu email'
            className='bg-white/10 backdrop-blur-md w-full h-12 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>

        {/* Campo de Password */}
        <div className='flex flex-col'>
          <label className='text-white mb-1 text-sm'>Password</label>
          <input
            name="password"
            type="password"
            placeholder='Introduza a sua password'
            className='bg-white/10 backdrop-blur-md w-full h-12 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            onChange={handleChange}
            value={formData.password}
            required
          />
        </div>

        {/* Mensagem de Erro Condicional */}
        {error && (
          <p className="text-red-400 text-sm bg-red-900/30 p-2 rounded-lg border border-red-500/50">
            {error}
          </p>
        )}

        {/* Botão de Submissão com estado de Loading */}
        <button
          type="submit"
          disabled={loading}
          className='bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl h-12 w-full mt-2 font-medium hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>

      {/* Link para Registo (Novo Cidadão) */}
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
            Registe-se
          </Link>
        </p>
      </div>
    </div>
  );
}