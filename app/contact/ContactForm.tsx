'use client'

import { useState } from 'react'

type FormState = 'idle' | 'sending' | 'success' | 'error'

type FormData = {
  name: string
  email: string
  subject: string
  message: string
  type: string
}

const subjectTypes = [
  { value: 'azure-problem', label: '🔧 Azure problem I want covered' },
  { value: 'bug', label: '🐛 Found an error in a post' },
  { value: 'collaboration', label: '🤝 Collaboration / guest post' },
  { value: 'advertising', label: '📢 Advertising inquiry' },
  { value: 'other', label: '💬 Something else' },
]

export function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', subject: '', message: '', type: '',
  })
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Partial<FormData>>({})

  function validate(): boolean {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email'
    if (!form.type) e.type = 'Please select a topic'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 20)
      e.message = 'Please write at least 20 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setState('success')
      setForm({ name: '', email: '', subject: '', message: '', type: '' })
    } catch {
      setState('error')
    }
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(5,13,26,0.8)',
    border: `1px solid ${hasError ? 'rgba(239,68,68,0.5)' : 'rgba(200,134,10,0.25)'}`,
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '13px',
    color: '#ffeaa0',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color .15s',
    boxSizing: 'border-box',
  })

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: '#8a7a5a',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '6px',
  }

  const errorStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#f87171',
    marginTop: '4px',
  }

  if (state === 'success') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(15,31,56,0.97), rgba(10,22,40,0.98))',
          border: '1px solid rgba(200,134,10,0.3)',
          borderRadius: '16px', padding: '48px 40px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffeaa0', marginBottom: '8px' }}>
            Message sent!
          </h2>
          <p style={{ fontSize: '13px', color: '#8a7a5a', lineHeight: 1.7, marginBottom: '24px' }}>
            Thanks for reaching out. I read every message and
            will get back to you within 1–2 business days.
          </p>
          <button
            onClick={() => setState('idle')}
            style={{
              background: 'linear-gradient(135deg, #c8860a, #f0a500)',
              border: 'none', borderRadius: '8px',
              padding: '10px 24px', fontSize: '13px',
              fontWeight: 600, color: '#fff', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Send another message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(200,134,10,0.1)',
          border: '0.5px solid rgba(200,134,10,0.3)',
          borderRadius: '20px', padding: '3px 12px',
          fontSize: '11px', color: '#f0a500', marginBottom: '14px',
        }}>
          ✉️ Get in touch
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffeaa0', marginBottom: '8px' }}>
          Send me a message
        </h1>
        <p style={{ fontSize: '13px', color: '#8a7a5a', lineHeight: 1.7 }}>
          Got an Azure problem you want me to cover? Found a bug in a post?
          Want to collaborate? Fill out the form and I&apos;ll get back to you.
        </p>
      </div>

      {/* Form card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,31,56,0.97), rgba(10,22,40,0.98))',
        border: '1px solid rgba(200,134,10,0.3)',
        borderRadius: '16px', padding: '32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, #c8860a, #f0a500, transparent)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Name + Email row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label htmlFor="contact-name" style={labelStyle}>Name *</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#f0a500'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(240,165,0,0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.name
                    ? 'rgba(239,68,68,0.5)' : 'rgba(200,134,10,0.25)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                style={inputStyle(!!errors.name)}
              />
              {errors.name && <div style={errorStyle}>{errors.name}</div>}
            </div>
            <div>
              <label htmlFor="contact-email" style={labelStyle}>Email *</label>
              <input
                id="contact-email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#f0a500'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(240,165,0,0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.email
                    ? 'rgba(239,68,68,0.5)' : 'rgba(200,134,10,0.25)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                style={inputStyle(!!errors.email)}
              />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>
          </div>

          {/* Topic selector */}
          <div role="group" aria-label="What's this about?">
            <div style={labelStyle}>What&apos;s this about? *</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {subjectTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm({ ...form, type: t.value })}
                  style={{
                    background: form.type === t.value
                      ? 'rgba(200,134,10,0.15)' : 'rgba(5,13,26,0.6)',
                    border: `1px solid ${form.type === t.value
                      ? '#f0a500' : 'rgba(200,134,10,0.2)'}`,
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    color: form.type === t.value ? '#f0a500' : '#8a7a5a',
                    cursor: 'pointer',
                    transition: 'all .15s',
                    fontFamily: 'inherit',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {errors.type && <div style={errorStyle}>{errors.type}</div>}
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="contact-subject" style={labelStyle}>Subject</label>
            <input
              id="contact-subject"
              type="text"
              placeholder="Brief subject line (optional)"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#f0a500'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(240,165,0,0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,134,10,0.25)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              style={inputStyle(false)}
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="contact-message" style={labelStyle}>Message *</label>
            <textarea
              id="contact-message"
              placeholder="Describe the Azure problem, post error, or what you'd like to discuss..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#f0a500'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(240,165,0,0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.message
                  ? 'rgba(239,68,68,0.5)' : 'rgba(200,134,10,0.25)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              style={{
                ...inputStyle(!!errors.message),
                resize: 'vertical',
                minHeight: '140px',
                lineHeight: 1.6,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginTop: '4px' }}>
              {errors.message
                ? <div style={errorStyle}>{errors.message}</div>
                : <div />}
              <div style={{ fontSize: '11px', color: '#6a5a3a' }}>
                {form.message.length} chars
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={state === 'sending'}
            style={{
              background: state === 'sending'
                ? 'rgba(200,134,10,0.4)'
                : 'linear-gradient(135deg, #c8860a, #f0a500)',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 28px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              cursor: state === 'sending' ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'all .2s',
              fontFamily: 'inherit',
              boxShadow: state === 'sending'
                ? 'none' : '0 4px 16px rgba(200,134,10,0.3)',
            }}
          >
            {state === 'sending' ? '⏳ Sending...' : 'Send message →'}
          </button>

          {state === 'error' && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '0.5px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '12px 16px',
              fontSize: '12px', color: '#f87171', textAlign: 'center',
            }}>
              Something went wrong. Please try again or email directly.
            </div>
          )}

        </div>
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#6a5a3a' }}>
        ⏱ I typically respond within 1–2 business days.
        No spam — your email is only used to reply.
      </div>
    </div>
  )
}
