'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Logo from "@/components/home/Logo/Logo";
import CardsGrid from "@/components/home/CardFeed/CardGrid";
import EmergencyDashboard from "@/components/home/EmergencyDashboard";

export default function Home() {

  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem("access");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div
      className=" relative w-screen min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]"
    >

      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />

      <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full bottom-[-80px] right-[-80px]" />

      <Logo />
      <EmergencyDashboard />
      <CardsGrid />

    </div>
  );
}