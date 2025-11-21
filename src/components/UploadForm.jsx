import { useEffect, useMemo, useState } from 'react'
import { enqueue, loadQueue, saveQueue, addHistory, loadHistory } from '../lib/storage'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function UploadForm({ session }) {
  const [coords, setCoords] = useState(null)
  const [file, setFile] = useState(null)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [syncing, setSyncing] = useState(false)
  const queue = useMemo(() => loadQueue(), [status])
  const history = useMemo(() => loadHistory(), [status])

  useEffect(() => {
    if (!('geolocation' in navigator)) return
    const watch = navigator.geolocation.watchPosition(
      (pos) => setCoords({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        acc: pos.coords.accuracy
      }),
      (err) => console.warn(err),
      { enableHighAccuracy: true }
    )
    return () => navigator.geolocation.clearWatch(watch)
  }, [])

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  async function tryOnlineUpload(payload) {
    const res = await fetch(`${API_BASE}/uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.detail || 'Upload failed')
    }
    return res.json()
  }

  const handleUpload = async () => {
    if (!file || !coords) {
      setStatus('Please select a file and allow location access.')
      return
    }
    setStatus('Preparing...')
    try {
      const b64 = await toBase64(file)
      const payload = {
        beneficiary_phone: session.phone,
        loan_id: '',
        file_name: file.name,
        mime_type: file.type,
        data_base64: b64,
        latitude: coords.lat,
        longitude: coords.lng,
        accuracy: coords.acc,
        captured_at: new Date().toISOString(),
        notes
      }

      setStatus('Uploading...')
      try {
        const data = await tryOnlineUpload(payload)
        setStatus(`Uploaded ✓ (id: ${data.id})`)
        addHistory({ id: data.id, notes, created_at: new Date().toISOString() })
      } catch (e) {
        enqueue({ ...payload, queued_at: new Date().toISOString() })
        setStatus('Offline: saved locally. Will sync when online.')
      }

      setFile(null)
      setNotes('')
    } catch (e) {
      setStatus(`Error: ${e.message}`)
    }
  }

  const trySync = async () => {
    const q = loadQueue()
    if (!q.length) {
      setStatus('Nothing to sync')
      return
    }
    setSyncing(true)
    setStatus('Syncing...')
    try {
      const res = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploads: q })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Sync failed')

      // on success, clear queue and add to history
      saveQueue([])
      const success = data.accepted || []
      success.forEach((u) => addHistory({ id: u.id, notes: u.notes, created_at: u.created_at }))
      setStatus(`Synced ${success.length} item(s) ✓`)
    } catch (e) {
      setStatus(`Sync error: ${e.message}`)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <section className="py-12 bg-slate-950">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">Submit Evidence</h2>
          <p className="text-slate-300 mt-1">Geo-tagged, time-stamped photo or short video.</p>

          <div className="mt-6 grid gap-4">
            <div className="text-slate-300 text-sm">
              Location: {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} (±${Math.round(coords.acc)}m)` : 'Detecting...'}
            </div>
            <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0])}
              className="rounded-xl bg-slate-900 border border-white/10 text-white px-4 py-3" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the asset"
              className="rounded-xl bg-slate-900 border border-white/10 text-white px-4 py-3 min-h-[100px]" />

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleUpload}
                className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 font-semibold w-full sm:w-auto">
                Upload
              </button>
              <button onClick={trySync} disabled={syncing}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-3 font-semibold w-full sm:w-auto">
                {syncing ? 'Syncing…' : 'Sync Offline Items'}
              </button>
            </div>

            {status && <p className="text-slate-300">{status}</p>}

            {history.length > 0 && (
              <div className="mt-6">
                <div className="text-white font-semibold mb-2">Recent submissions</div>
                <ul className="space-y-2">
                  {history.map((h, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                      <span className="truncate">{h.notes || 'No notes'}</span>
                      <span className="text-slate-400">{new Date(h.created_at).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {queue.length > 0 && (
              <div className="mt-4 text-amber-300 text-sm">
                {queue.length} item(s) waiting to sync
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default UploadForm
