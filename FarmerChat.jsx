import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
import clsx from 'clsx'

export default function FarmerChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! I am your AgriAI assistant. How can I help you today?' }
  ])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/advisory/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg,
          crop: 'general',
          location: 'India'
        })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'bot', text: data.answer || 'Sorry, I could not process that.' }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Network error. Please ensure the backend is running.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ── Chat Window ─────────────────────────────────────────────────── */}
      {isOpen && (
        <div 
          className="mb-4 w-80 sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-fade-in"
          style={{ boxShadow: '0 20px 50px rgba(26,61,31,0.15)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-medium leading-none">AgriAI Expert</h3>
                <p className="text-green-100 text-[10px] mt-1 uppercase tracking-widest font-bold">Always Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="text-white w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50"
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={clsx(
                  "flex items-start gap-2 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={clsx(
                  "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  msg.role === 'user' ? "bg-green-600" : "bg-stone-200"
                )}>
                  {msg.role === 'user' ? <User className="text-white w-4 h-4" /> : <Bot className="text-stone-600 w-4 h-4" />}
                </div>
                <div className={clsx(
                  "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-green-600 text-white rounded-tr-none shadow-md" 
                    : "bg-white text-stone-700 rounded-tl-none border border-stone-200 shadow-sm"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-2 mr-auto max-w-[85%]">
                <div className="shrink-0 w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                  <Bot className="text-stone-600 w-4 h-4" />
                </div>
                <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none border border-stone-200 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  <span className="text-xs text-stone-400">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-stone-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask your question..."
                className="w-full pl-4 pr-12 py-3 bg-stone-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all border-none"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-green-600 text-white rounded-xl flex items-center justify-center hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 mt-2 text-center">
              Powered by AgriAI Intelligence · Llama 3.3
            </p>
          </div>
        </div>
      )}

      {/* ── Chat Toggle Button ────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative",
          isOpen ? "bg-stone-800 rotate-90" : "bg-green-600"
        )}
      >
        {isOpen ? (
          <X className="text-white w-7 h-7" />
        ) : (
          <>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-4 border-white animate-bounce" />
            <MessageCircle className="text-white w-7 h-7" />
          </>
        )}
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-20 bg-stone-800 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            Need agricultural advice?
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-stone-800" />
          </div>
        )}
      </button>
    </div>
  )
}
