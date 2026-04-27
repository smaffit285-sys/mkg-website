import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Lock, Eye, EyeOff, Plus } from 'lucide-react'

const ADMIN_PASSWORD = 'MKGsharp2026' // Change this
const STORAGE_KEY = 'mkg_before_after_gallery'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [gallery, setGallery] = useState([])
  const [uploading, setUploading] = useState(false)
  const [newEntry, setNewEntry] = useState({ title: '', notes: '', beforeFile: null, afterFile: null })
  const beforeRef = useRef()
  const afterRef = useRef()

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setGallery(JSON.parse(saved))
  }, [])

  const saveGallery = (data) => {
    setGallery(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password.')
    }
  }

  const handleFileToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(file)
    })
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!newEntry.beforeFile || !newEntry.afterFile) {
      setError('Both before and after photos are required.')
      return
    }
    setUploading(true)
    setError('')
    try {
      const beforeData = await handleFileToBase64(newEntry.beforeFile)
      const afterData = await handleFileToBase64(newEntry.afterFile)
      const entry = {
        id: Date.now(),
        title: newEntry.title || `Knife #${gallery.length + 1}`,
        notes: newEntry.notes,
        before: beforeData,
        after: afterData,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      }
      const updated = [entry, ...gallery]
      saveGallery(updated)
      setNewEntry({ title: '', notes: '', beforeFile: null, afterFile: null })
      beforeRef.current.value = ''
      afterRef.current.value = ''
    } catch (err) {
      setError('Upload failed. Try again.')
    }
    setUploading(false)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this entry?')) {
      saveGallery(gallery.filter(e => e.id !== id))
    }
  }

  if (!authed) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="card-dark rounded-sm p-8">
            <Lock className="text-neon-pink mx-auto mb-4" size={32} />
            <h1 className="font-heading font-bold text-xl text-center text-light mb-6">Admin Access</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-midnight border border-neon-cyan/20 rounded-sm px-4 py-3 font-body text-light text-sm focus:border-neon-cyan outline-none pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-neon-cyan">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && <p className="font-mono text-xs text-neon-pink">{error}</p>}
              <button type="submit" className="btn-primary w-full text-center">Enter</button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-20 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="font-heading font-bold text-3xl neon-cyan mb-2">Gallery Admin</h1>
          <p className="font-body text-muted text-sm">Upload before & after photos. They appear immediately on the public gallery.</p>
        </div>

        {/* Upload Form */}
        <div className="card-dark rounded-sm p-6 mb-10">
          <h2 className="font-heading font-bold text-lg text-light mb-6 flex items-center gap-2">
            <Plus size={20} className="text-neon-cyan" /> Add New Entry
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-neon-cyan uppercase tracking-wider block mb-2">Title (optional)</label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={e => setNewEntry({...newEntry, title: e.target.value})}
                  placeholder="e.g. Yanagiba restoration"
                  className="w-full bg-midnight border border-neon-cyan/20 rounded-sm px-4 py-3 font-body text-light text-sm focus:border-neon-cyan outline-none"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-neon-cyan uppercase tracking-wider block mb-2">Notes (optional)</label>
                <input
                  type="text"
                  value={newEntry.notes}
                  onChange={e => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder="e.g. Chip removal + full reprofile"
                  className="w-full bg-midnight border border-neon-cyan/20 rounded-sm px-4 py-3 font-body text-light text-sm focus:border-neon-cyan outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-neon-pink uppercase tracking-wider block mb-2">Before Photo *</label>
                <input
                  ref={beforeRef}
                  type="file"
                  accept="image/*"
                  onChange={e => setNewEntry({...newEntry, beforeFile: e.target.files[0]})}
                  className="w-full bg-midnight border border-neon-pink/20 rounded-sm px-4 py-3 font-body text-light text-sm focus:border-neon-pink outline-none file:mr-3 file:bg-neon-pink/20 file:text-neon-pink file:border-0 file:px-3 file:py-1 file:font-mono file:text-xs"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-neon-cyan uppercase tracking-wider block mb-2">After Photo *</label>
                <input
                  ref={afterRef}
                  type="file"
                  accept="image/*"
                  onChange={e => setNewEntry({...newEntry, afterFile: e.target.files[0]})}
                  className="w-full bg-midnight border border-neon-cyan/20 rounded-sm px-4 py-3 font-body text-light text-sm focus:border-neon-cyan outline-none file:mr-3 file:bg-neon-cyan/20 file:text-neon-cyan file:border-0 file:px-3 file:py-1 file:font-mono file:text-xs"
                />
              </div>
            </div>
            {error && <p className="font-mono text-xs text-neon-pink">{error}</p>}
            <button
              type="submit"
              disabled={uploading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Upload size={16} />
              {uploading ? 'Uploading...' : 'Add to Gallery'}
            </button>
          </form>
        </div>

        {/* Gallery Management */}
        <h2 className="font-heading font-bold text-lg text-light mb-4">
          Gallery ({gallery.length} entries)
        </h2>
        {gallery.length === 0 ? (
          <div className="card-dark rounded-sm p-12 text-center">
            <p className="font-body text-muted">No entries yet. Upload your first before & after above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((entry) => (
              <div key={entry.id} className="card-dark rounded-sm overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img src={entry.before} alt="Before" className="w-full h-32 object-cover" />
                    <span className="absolute bottom-1 left-1 font-mono text-xs bg-neon-pink/90 text-midnight px-2 py-0.5">BEFORE</span>
                  </div>
                  <div className="relative">
                    <img src={entry.after} alt="After" className="w-full h-32 object-cover" />
                    <span className="absolute bottom-1 right-1 font-mono text-xs bg-neon-cyan/90 text-midnight px-2 py-0.5">AFTER</span>
                  </div>
                </div>
                <div className="p-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-heading text-sm font-bold text-light">{entry.title}</p>
                    {entry.notes && <p className="font-body text-xs text-muted mt-0.5">{entry.notes}</p>}
                    <p className="font-mono text-xs text-muted/50 mt-1">{entry.date}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-muted hover:text-neon-pink transition-colors flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
