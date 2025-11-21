import { useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import UploadForm from './components/UploadForm'
import HowItWorks from './components/HowItWorks'

function App() {
  const [session, setSession] = useState(null)

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero />
      {!session ? (
        <Auth onLoggedIn={setSession} />
      ) : (
        <UploadForm session={session} />
      )}
      <HowItWorks />
      <footer className="bg-slate-950 border-t border-white/10 py-8 text-center text-slate-400">
        Built for MoSJE • Loan Utilization Tracking • Offline-first, AI-validated
      </footer>
    </div>
  )
}

export default App