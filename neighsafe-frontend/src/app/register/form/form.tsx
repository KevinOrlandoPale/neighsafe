'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
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

    // Validação básica de passwords no frontend
    if (formData.password !== formData.confirm_password) {
      setError('As passwords não coincidem.');
      setLoading(false);
      return;
    }

    try {
      // Ajusta o endpoint '/api/register/' conforme a rota configurada no teu urls.py do Django
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // O Django não precisa do confirm_password na base de dados
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password
        })
      });

      const text = await res.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("A resposta do servidor não é válida.");
      }

      if (!res.ok) {
        // Mostra o primeiro erro retornado pelo Django (ex: "Este email já existe")
        const errorMessage = typeof data === 'object' && Object.values(data)[0];
        throw new Error(
          Array.isArray(errorMessage) ? errorMessage[0] : (data.detail || 'Erro ao criar conta.')
        );
      }

      setSuccess(true);
      
      // Redireciona para o login após 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
      {success ? (
        <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-center">
          <h3 className="text-green-400 font-medium text-lg">Conta criada com sucesso!</h3>
          <p className="text-gray-300 text-sm mt-1">A redirecionar para o login...</p>
        </div>
      ) : (
        <form onSubmit={handleRegister} className='flex flex-col gap-4'>
          
          <div className='flex gap-4'>
            <div className='flex flex-col w-1/2'>
              <label className='text-white mb-1 text-sm'>Nome</label>
              <input
                name="first_name"
                type="text"
                required
                placeholder='Ex: João'
                className='bg-white/10 backdrop-blur-md w-full h-12 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                onChange={handleChange}
                value={formData.first_name}
              />
            </div>
            <div className='flex flex-col w-1/2'>
              <label className='text-white mb-1 text-sm'>Apelido</label>
              <input
                name="last_name"
                type="text"
                required
                placeholder='Ex: Silva'
                className='bg-white/10 backdrop-blur-md w-full h-12 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
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
              required
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
              required
              placeholder='Crie uma password'
              className='bg-white/10 backdrop-blur-md w-full h-12 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <div className='flex flex-col'>
            <label className='text-white mb-1 text-sm'>Confirmar Password</label>
            <input
              name="confirm_password"
              type="password"
              required
              placeholder='Repita a password'
              className='bg-white/10 backdrop-blur-md w-full h-12 text-white text-sm rounded-xl px-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
              onChange={handleChange}
              value={formData.confirm_password}
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
            {loading ? 'A registar...' : 'Registar Conta'}
          </button>
        </form>
      )}

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}