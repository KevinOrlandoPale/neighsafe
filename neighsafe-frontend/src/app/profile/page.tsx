'use client';

import { useEffect, useState } from "react";

import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsCard from "@/components/profile/StatsCard";
import InfoCard from "@/components/profile/InfoCard";
import ActivityCard from "@/components/profile/ActivityCard";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);

  const [openEdit, setOpenEdit] = useState(false);

  const loadProfile = async () => {

    const token = localStorage.getItem("access");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/me/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    setUser(data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (!user) {
    return (
      <div className="text-white p-10">
        Carregando...
      </div>
    );
  }

  return (
    <div
      className="
      relative
      min-h-screen
      px-4
      py-10
      w-screen
      flex
      flex-col
      overflow-hidden

      bg-gradient-to-br
      from-[#020617]
      via-[#0f172a]
      to-[#020617]
    "
    >

      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />

      <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full bottom-[-80px] right-[-80px]" />

      <div className="relative max-w-6xl mx-auto flex flex-col gap-6">

        <ProfileHeader
          user={user}
          onEdit={() => setOpenEdit(true)}
        />

        <div className="grid grid-cols-2 gap-4">

          <StatsCard
            title="Alertas Enviados"
            value={user.alerts_count}
          />

          <StatsCard
            title="Interações"
            value={0}
          />

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 flex flex-col gap-6">

            <InfoCard
              title="Sobre mim"
              content={
                user.bio ||
                "Nenhuma descrição ainda."
              }
            />

            <InfoCard
              title="Informações"
              content={user}
              isInfoList
            />

          </div>

          <ActivityCard />

        </div>

      </div>

      {
        openEdit &&
        (
          <EditProfileModal
            user={user}
            close={() => setOpenEdit(false)}
            reload={async () => {
              await loadProfile()
                }}
          />
        )
      }

    </div>
  );
}