'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Certifica-te de que a rota no Django corresponde a esta
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        // Formata os erros do Django (que vêm num objeto) para uma string legível
        const errorMsg = Object.values(data).flat().join(', ');
        throw new Error(errorMsg || 'Erro ao criar conta.');
      }

      setSuccess(true);
      
      // Aguarda 2 segundos para o utilizador ver a mensagem de sucesso e redireciona
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
        <p className="text-green-400 font-medium">Conta criada com sucesso!</p>
        <p className="text-sm text-gray-400 mt-2">A redirecionar para o login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className='w-full max-w-md mx-auto flex flex-col gap-4'>
      
      <div className='flex gap-4'>
        <div className='flex flex-col w-1/2'>
          <label className='text-white mb-1 text-sm'>Nome</label>
          <input
            name="first_name"
            type="text"
            placeholder='João'
            required
            className='bg-white/10 backdrop-blur-md w-full h-11 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            onChange={handleChange}
            value={formData.first_name}
          />
        </div>
        <div className='flex flex-col w-1/2'>
          <label className='text-white mb-1 text-sm'>Apelido</label>
          <input
            name="last_name"
            type="text"
            placeholder='Silva'
            required
            className='bg-white/10 backdrop-blur-md w-full h-11 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            onChange={handleChange}
            value={formData.last_name}
          />
        </div>
      </div>

      <div className='flex flex-col'>
        <label className='text-white mb-1 text-sm'>Email</label>
        <input
          name="email"
          type="email"
          placeholder='seu.email@exemplo.com'
          required
          className='bg-white/10 backdrop-blur-md w-full h-11 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
          onChange={handleChange}
          value={formData.email}
        />
      </div>

      <div className='flex flex-col'>
        <label className='text-white mb-1 text-sm'>Password</label>
        <input
          name="password"
          type="password"
          placeholder='••••••••'
          required
          minLength={6}
          className='bg-white/10 backdrop-blur-md w-full h-11 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
          onChange={handleChange}
          value={formData.password}
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className='bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl h-11 w-full mt-2 font-medium hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {loading ? 'A registar...' : 'Criar Conta'}
      </button>
    </form>
  );
}