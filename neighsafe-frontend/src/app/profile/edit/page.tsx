'use client';

import { useState } from "react";

export default function EditProfile() {

  const [
    firstName,
    setFirstName
  ] = useState("");

  const [
    lastName,
    setLastName
  ] = useState("");

  const [
    city,
    setCity
  ] = useState("");

  const [
    bio,
    setBio
  ] = useState("");

  async function save() {

    const token =
      localStorage.getItem(
        "access"
      );

    await fetch(

      `${process.env.NEXT_PUBLIC_API_URL}/api/profile/update/`,

      {

        method: "PUT",

        headers: {

          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          first_name:
            firstName,

          last_name:
            lastName,

          city,

          bio

        })

      }

    );

    window.location.href =
      "/profile";

  }

  return (

    <div
      className="
      min-h-screen
      bg-[#020617]
      text-white
      p-10
    "
    >

      <div
        className="
        max-w-xl
        mx-auto
        space-y-4
      "
      >

        <h1
          className="
          text-3xl
          font-bold
        "
        >
          Editar Perfil
        </h1>

        <input
          value={firstName}
          onChange={
            (e) =>
              setFirstName(
                e.target.value
              )
          }

          placeholder="Nome"

          className="
          w-full
          p-3
          rounded
          bg-white/10
        "
        />

        <input
          value={lastName}
          onChange={
            (e) =>
              setLastName(
                e.target.value
              )
          }

          placeholder="Sobrenome"

          className="
          w-full
          p-3
          rounded
          bg-white/10
        "
        />

        <input
          value={city}
          onChange={
            (e) =>
              setCity(
                e.target.value
              )
          }

          placeholder="Cidade"

          className="
          w-full
          p-3
          rounded
          bg-white/10
        "
        />

        <textarea
          value={bio}
          onChange={
            (e) =>
              setBio(
                e.target.value
              )
          }

          placeholder="Bio"

          className="
          w-full
          p-3
          rounded
          bg-white/10
        "
        />

        <button

          onClick={save}

          className="
          w-full
          h-12
          rounded
          bg-blue-600
        "
        >

          Salvar

        </button>

      </div>

    </div>

  );

}