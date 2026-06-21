export default function FloatingButton() {
  return (
    <a
      href="/alerts"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg md:hidden shadow-blue-500/30 hover:scale-110 hover:shadow-blue-500/50 transition-all duration-300 animate-pulseSlow"
    >
      <span className="text-2xl text-white">+</span>
    </a>
  );
}
