'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log('Form data:', formData)
  }

  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>
        
        <form onSubmit={handleSubmit} className="max-w-lg">
          <div className="mb-4">
            <label htmlFor="name" className="block text-white/80 mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-white/80 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-white/80 mb-2">Message</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-amber-400 text-white px-8 py-3 rounded-lg hover:bg-amber-500 transition-colors text-xl font-medium"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  )
} 