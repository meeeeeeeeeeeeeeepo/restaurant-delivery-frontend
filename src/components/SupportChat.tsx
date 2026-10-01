import { useEffect, useRef, useState } from 'react';

// REST base derived from the GraphQL URL (strip the trailing /graphql).
const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000/graphql').replace(/\/graphql\/?$/, '');
const TICKET_KEY = 'bf_support_ticket';
const NAME_KEY = 'bf_support_name';

type Msg = { id: number; sender: 'customer' | 'staff'; author: string; text: string; created_at: string };

/**
 * Customer support widget. Customers report from the app; messages are sent to
 * the backend, mirrored into Slack where staff answer in a thread, and staff
 * replies flow back here. The panel polls the conversation so answers appear.
 */
export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(() => {
    try { return localStorage.getItem(TICKET_KEY); } catch { return null; }
  });
  const [name, setName] = useState(() => {
    try { return localStorage.getItem(NAME_KEY) ?? ''; } catch { return ''; }
  });
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Poll the conversation while the panel is open and a ticket exists.
  useEffect(() => {
    if (!open || !ticketId) return;
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/support/${ticketId}`);
        if (!r.ok) return;
        const d = await r.json();
        if (alive) setMessages(d.messages ?? []);
      } catch { /* ignore transient */ }
    };
    load();
    const t = setInterval(load, 4000);
    return () => { alive = false; clearInterval(t); };
  }, [open, ticketId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, open]);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setSending(true); setErr('');
    try {
      const r = await fetch(`${API_BASE}/api/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: ticketId, name: name || 'Customer', message: text }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      setMessages(d.messages ?? []);
      setDraft('');
      if (!ticketId && d.ticket_id) {
        setTicketId(d.ticket_id);
        try { localStorage.setItem(TICKET_KEY, d.ticket_id); localStorage.setItem(NAME_KEY, name || 'Customer'); } catch { /* */ }
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not send');
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    try { localStorage.removeItem(TICKET_KEY); } catch { /* */ }
    setTicketId(null); setMessages([]); setDraft('');
  };

  return (
    <div className="support">
      {open && (
        <div className="support-panel">
          <div className="support-head">
            <strong>💬 Support</strong>
            <button className="link" onClick={() => setOpen(false)}>close</button>
          </div>

          {!ticketId && (
            <input
              className="support-name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <div className="support-log">
            {messages.length === 0 && (
              <p className="support-hint">Hi! Message us about your order and our team will reply right here.</p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`support-msg ${m.sender}`}>
                <span className="who">{m.sender === 'staff' ? 'Bella Forchetta' : (name || 'You')}</span>
                <span className="bubble">{m.text}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {err && <p className="error">{err}</p>}

          <div className="support-compose">
            <input
              placeholder="Type a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            />
            <button onClick={send} disabled={sending || !draft.trim()}>{sending ? '…' : 'Send'}</button>
          </div>
          {ticketId && (
            <div className="support-foot">
              <span>Ticket #{ticketId.slice(-5)}</span>
              <button className="link" onClick={reset}>new conversation</button>
            </div>
          )}
        </div>
      )}

      <button className="support-fab" onClick={() => setOpen((o) => !o)}>
        {open ? '✕' : '💬 Support'}
      </button>
    </div>
  );
}
