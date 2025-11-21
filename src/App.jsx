import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import UploadForm from './components/UploadForm'
import HowItWorks from './components/HowItWorks'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('session_v1') || 'null')
      if (saved) setSession(saved)
    } catch {}
  }, [])

  useEffect(() => {
    if (session) localStorage.setItem('session_v1', JSON.stringify(session))
    else localStorage.removeItem('session_v1')
  }, [session])

  const logout = () => setSession(null)

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero />

      <div className="max-w-4xl mx-auto px-6">
        {session && (
          <div className="mb-4 mt-6 flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-slate-200">
            <div>
              Signed in as <span className="font-semibold">{session.phone}</span>
            </div>
            <button onClick={logout} className="text-sm rounded-lg px-3 py-2 bg-white/10 hover:bg-white/20">Log out</button>
          </div>
        )}
      </div>

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
