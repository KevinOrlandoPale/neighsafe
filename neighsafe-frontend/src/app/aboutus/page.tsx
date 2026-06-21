export default function AboutPage() {
  return (
    <div className="
      relative min-h-screen px-4 py-16 overflow-hidden

      bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]
      text-white 
    ">

      {/* background glow */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-500/20 blur-3xl rounded-full bottom-[-80px] right-[-80px]"></div>

      <div className="relative max-w-6xl mx-auto flex flex-col gap-16">

        {/* HERO */}
        <section className="text-center flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Sobre o <span className="gradient">Neigh Safe</span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Estamos a construir uma nova forma de segurança comunitária,
            conectando vizinhos através de tecnologia, confiança e colaboração em tempo real.
          </p>
        </section>

        {/* MISSÃO */}
        <section className="
          grid grid-cols-1 md:grid-cols-2 gap-6
        ">

          <div className="
            p-6 rounded-2xl
            bg-white/5 backdrop-blur-lg border border-white/10
          ">
            <h2 className="text-xl font-semibold mb-3">Missão</h2>
            <p className="text-gray-300 text-sm">
              Tornar bairros mais seguros através da colaboração digital,
              permitindo que qualquer pessoa possa reportar, acompanhar e agir
              rapidamente em situações de risco.
            </p>
          </div>

          <div className="
            p-6 rounded-2xl
            bg-white/5 backdrop-blur-lg border border-white/10
          ">
            <h2 className="text-xl font-semibold mb-3">Visão</h2>
            <p className="text-gray-300 text-sm">
              Criar comunidades conectadas onde a segurança não depende apenas
              de autoridades, mas também da união entre vizinhos.
            </p>
          </div>

        </section>

        {/* FEATURES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {[
            "Alertas em tempo real",
            "Mapa interativo de ocorrências (Brevemente)",
            "Comunicação entre vizinhos",
            "Sistema de reputação",
            "Integração com autoridades",
            "Segurança colaborativa"
          ].map((item, index) => (
            <div
              key={index}
              className="
                p-5 rounded-2xl

                bg-white/5 backdrop-blur-lg border border-white/10

                hover:scale-[1.03]
                transition
              "
            >
              <p className="text-gray-200">{item}</p>
            </div>
          ))}

        </section>

        {/* VALORES */}
        <section className="
          p-8 rounded-2xl text-center

          bg-white/5 backdrop-blur-lg border border-white/10
        ">

          <h2 className="text-2xl font-semibold mb-4">
            Nossos Valores
          </h2>

          <p className="text-gray-300 max-w-2xl mx-auto text-sm">
            Transparência, confiança e colaboração são a base do Neigh Safe.
            Acreditamos que comunidades fortes são construídas com informação
            acessível e ação coletiva.
          </p>

        </section>

        {/* CTA */}
        <section className="text-center flex flex-col gap-4">

          <h2 className="text-2xl font-semibold">
            Faça parte da mudança
          </h2>

          <p className="text-gray-400 text-sm">
            Comece agora a proteger a sua vizinhança.
          </p>

          <div>
            <a
              href="/home"
              className="
                inline-block px-6 py-3 rounded-xl

                bg-gradient-to-r from-blue-600 to-cyan-500

                hover:scale-105
                hover:shadow-lg hover:shadow-blue-500/30

                transition
              "
            >
              Explorar Plataforma
            </a>
          </div>

        </section>

      </div>
    </div>
  );
}