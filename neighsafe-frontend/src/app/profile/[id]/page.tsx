'use client';

import { useEffect, useState } from "react";

export default function ProfilePage({
  params
}: {
  params: { id: string }
}) {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const token =
          localStorage.getItem("access");
        if (!token) {
          return;
        }
        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/${params.id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        if (!response.ok) {
          console.log(
            "PROFILE ERROR",
            response.status
          );
          return;
        }
        const data =
          await response.json(); 
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    }
    loadUser();
  }, [params.id]);
  if (!user) {
    return (
      <div className="text-white p-10">
        Carregando perfil...
      </div>
    );
  }
  return (
    <div className="min-h-screen text-white p-10">

      <div className="max-w-5xl mx-auto">

        <div className="flex gap-8">

          <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${user.first_name}`
            }
            className=" w-32 h-32 rounded-full object-cover "
          />
          <div>

            <h1
              className=" text-3xl font-bold "
            >
              {user.first_name}
              {" "}
              {user.last_name}
            </h1>

            <p className="text-gray-400">
              {user.email}
            </p>

            <p className="mt-4">
              {user.bio}
            </p>
            
          </div>

        </div>

      </div>
      
    </div>
  );

}