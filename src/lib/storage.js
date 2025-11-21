// Simple localStorage-based offline queue and history
const QUEUE_KEY = 'offline_queue_v1'
const HISTORY_KEY = 'upload_history_v1'

export function loadQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveQueue(items) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items))
}

export function enqueue(item) {
  const q = loadQueue()
  q.push(item)
  saveQueue(q)
}

export function clearQueue() {
  saveQueue([])
}

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

export function addHistory(entry) {
  const h = loadHistory()
  h.unshift(entry)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 50)))
}
