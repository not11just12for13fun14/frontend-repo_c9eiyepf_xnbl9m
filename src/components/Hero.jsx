import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Loan Utilization Tracking
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl">
            Upload geo-tagged, time-stamped photos/videos of assets purchased with loan funds. Works offline and syncs later. AI-assisted validation and remote approvals.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#login" className="inline-flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 font-semibold transition-colors">
              Get Started
            </a>
            <a href="#how" className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white px-6 py-3 font-semibold transition-colors">
              How it works
            </a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
    </section>
  )
}

export default Hero