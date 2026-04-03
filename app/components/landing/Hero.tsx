import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-blue-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Supercharge Your Customer <br />
              Support with <span className="text-blue-600">AI Chatbots</span>
            </h1>

            <p className="mt-4 text-slate-600 max-w-md">
              Automate customer interactions, improve response times, and boost
              satisfaction with intelligent AI-powered chatbots.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            {/* soft background glow */}

            <Image
              src="/hero.png"
              alt="AI Chatbot Dashboard"
              width={3500}
              height={480}
              className="rounded-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
