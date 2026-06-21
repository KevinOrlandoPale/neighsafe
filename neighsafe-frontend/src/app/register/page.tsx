'use client';

import React, { useEffect, useState } from 'react';
import RegisterForm from './form/form';
import Image from 'next/image';
import Link from 'next/link';

export default function Register() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className='relative bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] w-screen h-screen flex justify-center items-center overflow-hidden'>
      {/* Glow do mouse */}
      <div
        className='pointer-events-none fixed w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-3xl'
        style={{
          left: position.x - 250,
          top: position.y - 250,
        }}
      />

      {/* Blur blobs */}
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full bottom-[-80px] right-[-80px] animate-pulse"></div>

      {/* CONTAINER */}
      <div className="w-full md:w-[70%] lg:w-[65%] h-full md:h-[85%] flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 animate-fadeIn">

        {/* LEFT */}
        <div className='w-full md:w-1/2 flex flex-col justify-center px-8 py-10 bg-white/5 backdrop-blur-lg overflow-y-auto no-scrollbar'>
          <h1 className='text-4xl text-center mb-2 gradient'>
            Neigh Safe
          </h1>
          <h2 className='text-2xl text-center text-white mb-2'>Junte-se à Comunidade</h2>
          <p className='text-center text-gray-400 mb-6 text-sm'>
            Crie a sua conta e ajude a manter o seu bairro seguro.
          </p>

          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Faça Login aqui
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className='hidden md:block relative md:w-1/2'>
          <Image
            src="/neighborhood.jpg"
            alt="Neighbors"
            fill
            className="object-cover"
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent'></div>
        </div>
      </div>
    </div>
  );
}