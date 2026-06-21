'use client';

import { useState } from "react";

interface Props {
  user: any;
  reload: () => void;
  close: () => void;
}

export default function EditProfileModal({
  user,
  reload,
  close,
}: Props) {

  const [data, setData] = useState({

    first_name:
      user.first_name || "",

    last_name:
      user.last_name || "",

    city:
      user.city || "",

    bio:
      user.bio || ""

  });

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const save = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem(
          "access"
        );

      const form =
        new FormData();

      // NÃO ENVIA NOME

      form.append(
        "city",
        data.city
      );

      form.append(
        "bio",
        data.bio
      );

      if (file) {

        form.append(
          "avatar",
          file
        );

      }

      const response =
        await fetch(

          `${process.env.NEXT_PUBLIC_API_URL}/api/profile/update/`,

          {

            method:
              "PUT",

            headers: {

              Authorization:
                `Bearer ${token}`

            },

            body:
              form

          }

        );

      if (!response.ok) {

        alert(
          "Erro ao salvar"
        );

        return;

      }

      await reload();

      close();

    }

    catch {

      alert(
        "Erro interno"
      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div
      className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
    "
    >

      <div
        className="
        w-[95%]
        max-w-xl
        rounded-3xl
        bg-[#081122]
        p-8
      "
      >

        <h1
          className="
          text-white
          text-2xl
          mb-6
        "
        >
          Editar Perfil
        </h1>

        {/* FOTO */}

        <div
          className="
          flex
          justify-center
          mb-6
        "
        >

          <label>

            <img
              src={
                file
                  ? URL.createObjectURL(
                      file
                    )
                  : user.avatar ||
                    "https://ui-avatars.com/api/?name=" +
                      user.first_name
              }
              className="
              w-28
              h-28
              rounded-full
              object-cover
              cursor-pointer
            "
            />

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] ||
                    null
                )
              }
            />

          </label>

        </div>

        {/* NOME BLOQUEADO */}

        <div
          className="
          flex
          gap-3
          mb-4
        "
        >

          <input
            disabled
            value={
              data.first_name
            }
            placeholder="Nome protegido"
            className="
            flex-1
            h-11
            rounded-xl
            px-4
            bg-white/5
            text-gray-500
          "
          />

          <input
            disabled
            value={
              data.last_name
            }
            placeholder="Sobrenome protegido"
            className="
            flex-1
            h-11
            rounded-xl
            px-4
            bg-white/5
            text-gray-500
          "
          />

        </div>

        {/* CIDADE */}

        <input
          value={data.city}
          placeholder={
            user.city ||
            "Cidade"
          }
          onChange={(e) =>
            setData({

              ...data,

              city:
                e.target.value

            })
          }
          className="
          w-full
          h-11
          rounded-xl
          px-4
          bg-white/10
          text-white
          mb-4
        "
        />

        {/* BIO */}

        <textarea
          value={data.bio}
          placeholder={
            user.bio ||
            "Escreve algo sobre ti"
          }
          onChange={(e) =>
            setData({

              ...data,

              bio:
                e.target.value

            })
          }
          className="
          w-full
          h-36
          rounded-xl
          p-4
          bg-white/10
          text-white
        "
        />

        {/* BOTÕES */}

        <div
          className="
          flex
          justify-end
          gap-3
          mt-6
        "
        >

          <button
            onClick={close}
            className="
            px-5
            py-2
            bg-white/10
            rounded-xl
            text-white
          "
          >
            Cancelar
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="
            px-6
            py-2
            rounded-xl
            bg-blue-600
            text-white
          "
          >
            {
              loading
                ? "Salvando..."
                : "Salvar"
            }
          </button>

        </div>

      </div>

    </div>

  );

}