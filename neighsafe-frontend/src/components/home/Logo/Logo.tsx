import React from 'react'

export default function Logo() {
  return (
    <div className='w-full flex justify-center mt-6 px-4'>
      
      <div className='
        w-full max-w-3xl 
        bg-white/5 
        backdrop-blur-lg 
        border border-white/10 
        rounded-2xl 
        py-6 
        text-center
        mb-10
      '>

        <h1 className='text-5xl text-white gradient'>
          Neigh Safe
        </h1>

        <p className='text-gray-400 mt-2 text-sm'>
          Segurança em tempo real na sua vizinhança
        </p>

      </div>

    </div>
  )
}