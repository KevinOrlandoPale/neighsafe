interface Props {
  title: string;
  value: string;
}

export default function StatsCard({ title, value }: Props) {
  return (
    <div className="
      p-5 rounded-2xl

      bg-white/5 
      backdrop-blur-lg 
      border border-white/10

      hover:scale-[1.02]
      transition
    ">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl text-white font-semibold mt-2">
        {value}
      </h2>
    </div>
  );
}