function HowItWorks() {
  const steps = [
    {
      title: 'Login with Mobile',
      desc: 'Beneficiaries sign in using their mobile number and OTP.'
    },
    {
      title: 'Capture Evidence',
      desc: 'Take a geo-tagged, time-stamped photo or video of the asset.'
    },
    {
      title: 'Works Offline',
      desc: 'Save submissions offline and sync automatically when online.'
    },
    {
      title: 'AI Validation',
      desc: 'Automated checks flag anomalies and boost trust.'
    },
    {
      title: 'Remote Approval',
      desc: 'Officers review and approve from anywhere.'
    },
  ]

  return (
    <section id="how" className="bg-slate-950 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {steps.map((s, i) => (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="text-blue-400 font-semibold">Step {i + 1}</div>
              <div className="text-white text-xl mt-2">{s.title}</div>
              <p className="text-slate-300 mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks