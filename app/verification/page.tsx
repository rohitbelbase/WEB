'use client';

import { FormEvent, useState } from 'react';

export default function VerificationPage() {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setMessage('');

    try {
      // ⚠️ For now we just send userId 1 as a demo.
      // In a real app this would come from the logged-in user.
      const res = await fetch('/api/verification/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          note,
        }),
      });

      if (!res.ok) {
        throw new Error('Server error');
      }

      setStatus('ok');
      setMessage(
        'Verification request sent. In the real system this would include ID upload or other checks.'
      );
      setNote('');
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '3rem 2rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        background: '#c6f6d5', // light green like your wireframe
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Verification</h1>

      <p style={{ maxWidth: '40rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
        Please submit your verification request. In the real system this would include ID upload
        or other checks, not just email confirmation.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '40rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <label style={{ fontWeight: 600 }}>
          Extra info for the team (optional)
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={6}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #999',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              resize: 'vertical',
            }}
            placeholder="For example: what kind of ID you can provide, or anything else the team should know."
          />
        </label>

        <button
          type="submit"
          disabled={status === 'sending'}
          style={{
            marginTop: '0.5rem',
            padding: '0.9rem 1.5rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#00bfff',
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: status === 'sending' ? 'default' : 'pointer',
            opacity: status === 'sending' ? 0.7 : 1,
          }}
        >
          {status === 'sending' ? 'Submitting…' : 'Submit verification'}
        </button>

        {message && (
          <p
            style={{
              marginTop: '0.5rem',
              color: status === 'ok' ? '#166534' : '#b91c1c',
              fontWeight: 500,
            }}
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
