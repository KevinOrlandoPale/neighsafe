'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const text = await res.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Resposta não é JSON válido");
      }

      if (!res.ok) {
        throw new Error(data.detail || 'Erro ao fazer login. Verifique as credenciais.');
      }

      // Guardar tokens
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      document.cookie = `access=${data.access}; path=/`;

      // REDIRECIONAMENTO INTELIGENTE (Esquadra vs Civil)
      if (data.is_authority) {
        localStorage.setItem('station_name', data.station_name || 'Autoridade');
        router.push('/authority/dashboard');
      } else {
        router.push('/home'); // Ou /feed, onde está o teu CardsGrid
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
      <form onSubmit={handleLogin} className='flex flex-col gap-4'>
        <div className='flex flex-col'>
          <label className='text-white mb-1 text-sm'>Email</label>
          <input
            name="email"
            type="text"
            placeholder='Introduza o seu email'
            className='bg-white/10 backdrop-blur-md w-full h-12 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            onChange={handleChange}
            value={formData.email}
          />
        </div>

        <div className='flex flex-col'>
          <label className='text-white mb-1 text-sm'>Password</label>
          <input
            name="password"
            type="password"
            placeholder='Introduza a sua password'
            className='bg-white/10 backdrop-blur-md w-full h-12 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            onChange={handleChange}
            value={formData.password}
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className='bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl h-12 w-full mt-2 font-medium hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>

      {/* Link para Cadastro */}
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