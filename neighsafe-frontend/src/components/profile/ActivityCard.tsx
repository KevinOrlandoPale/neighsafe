export default function ActivityCard() {
  return (
    <div className="
      p-6 rounded-2xl h-full

      bg-white/5 
      backdrop-blur-lg 
      border border-white/10
    ">

      <h2 className="text-white mb-4 font-semibold">
        Atividade Recente
      </h2>

      <div className="flex flex-col gap-4 text-sm text-gray-300">

        <div>
          <p>Enviou um alerta: "Roubaram minha ..."</p>
          <span className="text-gray-500 text-xs">2 horas atrás</span>
        </div>

        <div>
          <p>Comentou em um alerta</p>
          <span className="text-gray-500 text-xs">3 dias atrás</span>
        </div>

      </div>
    </div>
  );
}