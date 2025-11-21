import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function UploadForm({ session }) {
  const [coords, setCoords] = useState(null)
  const [file, setFile] = useState(null)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')

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

  const handleUpload = async () => {
    if (!file || !coords) {
      setStatus('Please select a file and allow location access.')
      return
    }
    setStatus('Uploading...')
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
      const res = await fetch(`${API_BASE}/uploads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Upload failed')
      setStatus(`Uploaded ✓ (id: ${data.id})`)
    } catch (e) {
      setStatus(`Error: ${e.message}`)
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
            <button onClick={handleUpload}
              className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 font-semibold w-fit">
              Upload
            </button>
            {status && <p className="text-slate-300">{status}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default UploadForm