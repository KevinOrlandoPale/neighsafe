import AlertForm from "@/components/Alert/form/AlertForm";

export default function CreateAlertPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]
    ">

      {/* blur blobs */}
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full bottom-[-80px] right-[-80px] animate-pulse"></div>

      <AlertForm />
    </div>
  );
}