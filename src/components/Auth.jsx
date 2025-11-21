import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Auth({ onLoggedIn }) {
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const requestOtp = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      if (!res.ok) throw new Error('Failed to request OTP')
      setOtpSent(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp })
      })
      if (!res.ok) throw new Error('Invalid OTP')
      const data = await res.json()
      onLoggedIn({ token: data.token, phone: data.phone })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="login" className="relative py-12 bg-slate-950">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">Mobile Login</h2>
          <p className="text-slate-300 mt-1">Enter your mobile number to receive an OTP.</p>

          {!otpSent ? (
            <div className="mt-6 grid sm:flex gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="flex-1 rounded-xl bg-slate-900 border border-white/10 text-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={requestOtp} disabled={loading || phone.length < 10}
                className="rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-3 font-semibold">
                {loading ? 'Sending…' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div className="mt-6 grid sm:flex gap-3">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="flex-1 rounded-xl bg-slate-900 border border-white/10 text-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={verifyOtp} disabled={loading || otp.length < 4}
                className="rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-6 py-3 font-semibold">
                {loading ? 'Verifying…' : 'Verify'}
              </button>
            </div>
          )}

          {error && <p className="mt-3 text-red-400">{error}</p>}
        </div>
      </div>
    </section>
  )
}

export default Auth