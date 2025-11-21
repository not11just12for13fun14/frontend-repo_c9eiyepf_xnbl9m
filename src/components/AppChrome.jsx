import { useEffect, useState } from 'react'

export default function AppChrome({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    const onAppInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') setInstalled(true)
    setDeferredPrompt(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-white font-semibold">LoanTracker</div>
          {!installed && deferredPrompt && (
            <button onClick={handleInstall} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">Install App</button>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <nav className="sticky bottom-0 z-40 bg-slate-950/80 backdrop-blur border-t border-white/10">
        <div className="max-w-4xl mx-auto grid grid-cols-3 text-center text-slate-300">
          <a href="#login" className="py-3 hover:text-white">Home</a>
          <a href="#upload" className="py-3 hover:text-white">Upload</a>
          <a href="#how" className="py-3 hover:text-white">Help</a>
        </div>
      </nav>
    </div>
  )
}
