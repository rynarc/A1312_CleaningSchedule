import { useState, useEffect, useRef } from 'react';
import './App.css';

const API = import.meta.env.VITE_API_URL || '/api';
const EDIT_PASSWORD = 'ferdiberak';

/* ─── Icons ──────────────────────────────────────────────────── */
function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function EyeIcon({ off }) {
  return off ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.07-2.43 2.93-4.45 5.27-5.71"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.11 11 7a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  );
}

/* ─── Password Modal ─────────────────────────────────────────── */
function PasswordModal({ onSuccess, onClose }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (pw === EDIT_PASSWORD) {
      setError('');
      onSuccess();
    } else {
      setError('Wrong password. Access denied.');
      setPw('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
    }
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className={`modal-card ${shake ? 'modal-card--shake' : ''}`}>
        <button className="modal-close" onClick={onClose} title="Close"><XIcon /></button>
        <div className="modal-lock-icon"><LockIcon /></div>
        <h2 className="modal-title">Admin Access Required</h2>
        <p className="modal-desc">Enter the password to edit this schedule.</p>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-input-wrap">
            <input
              ref={inputRef}
              type={showPw ? 'text' : 'password'}
              className={`modal-input ${error ? 'modal-input--error' : ''}`}
              value={pw}
              onChange={e => { setPw(e.target.value); setError(''); }}
              placeholder="Enter password"
              autoComplete="off"
            />
            <button type="button" className="modal-eye"
              onClick={() => setShowPw(v => !v)}
              title={showPw ? 'Hide password' : 'Show password'}>
              <EyeIcon off={showPw} />
            </button>
          </div>
          {error && <p className="modal-error">❌ {error}</p>}
          <div className="modal-actions">
            <button type="submit" className="btn-save modal-btn-confirm">
              <CheckIcon /> Confirm
            </button>
            <button type="button" className="btn-cancel modal-btn-cancel" onClick={onClose}>
              <XIcon /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main App ───────────────────────────────────────────────── */
export default function App() {
  const [current, setCurrent] = useState(null);
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Date-based edit state (for overrides)
  const [editingDate, setEditingDate] = useState(null); // weekStartIso string
  const [editNames, setEditNames] = useState(['', '']);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Password modal
  const [showPwModal, setShowPwModal] = useState(false);
  const [pendingDate, setPendingDate] = useState(null);
  const [pendingNames, setPendingNames] = useState(['', '']);

  async function fetchData() {
    try {
      const [curRes, allRes] = await Promise.all([
        fetch(`${API}/schedule/current`),
        fetch(`${API}/schedule/all`),
      ]);
      setCurrent(await curRes.json());
      setAllData(await allRes.json());
    } catch (e) {
      console.error('Failed to fetch data:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  // Step 1: click Edit on a date card → show password modal
  function requestEdit(date, names) {
    setPendingDate(date);
    setPendingNames([...names]);
    setShowPwModal(true);
  }

  // Step 2: password correct → open edit form for that date
  function onPasswordSuccess() {
    setShowPwModal(false);
    setEditingDate(pendingDate);
    setEditNames([...pendingNames]);
    setSaveError('');
  }

  function closeModal() {
    setShowPwModal(false);
    setPendingDate(null);
    setPendingNames(['', '']);
  }

  function cancelEdit() {
    setEditingDate(null);
    setEditNames(['', '']);
    setSaveError('');
  }

  // Save a one-time override for a specific Sunday date
  async function saveOverride(date) {
    if (editNames.some(n => !n.trim())) {
      setSaveError('Name cannot be empty.');
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch(`${API}/override`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, names: editNames }),
      });
      if (!res.ok) {
        const err = await res.json();
        setSaveError(err.error || 'Failed to save.');
        return;
      }
      await fetchData();
      setEditingDate(null);
    } catch (e) {
      setSaveError('Could not connect to server.');
    } finally {
      setSaving(false);
    }
  }

  // Remove override → revert to normal rotation for that date
  async function resetOverride(date) {
    try {
      await fetch(`${API}/override/${date}`, { method: 'DELETE' });
      await fetchData();
    } catch (e) {
      console.error('Reset failed:', e);
    }
  }

  const slotLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {showPwModal && (
        <PasswordModal onSuccess={onPasswordSuccess} onClose={closeModal} />
      )}

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-icon">🧹</div>
          <div>
            <h1 className="header-title">Duty Schedule</h1>
            <p className="header-sub">Weekly team rotation</p>
          </div>
        </div>
      </header>

      <main className="main">

        {/* ── Hero Card ── */}
        {current && (
          <section className={`hero-card ${current.isToday ? 'hero-card--today' : ''}`}>
            <div className="hero-badge">
              {current.isToday ? '🧹 On Duty Today' : '📅 Up Next Sunday'}
            </div>

            {editingDate === current.weekStartIso ? (
              /* Hero edit mode */
              <div className="hero-edit-form">
                <p className="hero-edit-label">Change duty for {current.dateRange}</p>
                <div className="edit-inputs hero-edit-inputs">
                  <input
                    className="edit-input hero-edit-input"
                    value={editNames[0]}
                    onChange={e => setEditNames([e.target.value, editNames[1]])}
                    placeholder="Name 1"
                    autoFocus
                  />
                  <span className="edit-sep hero-edit-sep">&amp;</span>
                  <input
                    className="edit-input hero-edit-input"
                    value={editNames[1]}
                    onChange={e => setEditNames([editNames[0], e.target.value])}
                    placeholder="Name 2"
                  />
                </div>
                {saveError && <p className="save-error hero-save-error">{saveError}</p>}
                <div className="edit-actions">
                  <button className="btn-save" onClick={() => saveOverride(current.weekStartIso)} disabled={saving}>
                    <CheckIcon /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button className="btn-cancel" onClick={cancelEdit} disabled={saving}>
                    <XIcon /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Hero normal mode */
              <>
                <div className="hero-names">
                  <span className="hero-name">{current.names[0]}</span>
                  <span className="hero-amp">&amp;</span>
                  <span className="hero-name">{current.names[1]}</span>
                </div>
                <div className="hero-meta">
                  <span className="hero-meta-item">
                    <CalendarIcon />
                    {current.isToday ? 'Today' : current.dateRange}
                  </span>
                  <span className="hero-meta-item hero-slot-badge">
                    Slot {current.slot} of 5
                  </span>
                </div>

                {/* Override info banner */}
                {current.isOverridden && (
                  <div className="override-banner">
                    ✏️ Temporarily changed — normally{' '}
                    <strong>{current.originalNames[0]} &amp; {current.originalNames[1]}</strong>
                    <button className="btn-reset-banner" onClick={() => resetOverride(current.weekStartIso)}>
                      <ResetIcon /> Reset to rotation
                    </button>
                  </div>
                )}

                {!current.isToday && current.lastNames && (
                  <p className="hero-note">
                    🙏 Thank you <strong>{current.lastNames[0]} &amp; {current.lastNames[1]}</strong> for this week's duty!
                  </p>
                )}

                {/* Edit button at bottom of hero */}
                <button
                  className="btn-hero-edit"
                  onClick={() => requestEdit(current.weekStartIso, current.names)}
                >
                  <PencilIcon /> Edit this Sunday
                </button>
              </>
            )}
          </section>
        )}

        {/* ── Rotation Table (read-only) ── */}
        {allData && (
          <section className="section">
            <h2 className="section-title">
              <UsersIcon /> Duty Rotation (5 Weeks)
            </h2>
            <div className="table-card">
              {allData.schedule.map((entry) => {
                const isCurrentSlot = entry.slot === allData.currentSlot;
                return (
                  <div key={entry.slot}
                    className={`table-row ${isCurrentSlot ? 'table-row--active' : ''}`}>
                    <div className="row-slot">
                      <span className={`slot-pill ${isCurrentSlot ? 'slot-pill--active' : ''}`}>
                        {slotLabels[entry.slot - 1]}
                      </span>
                      {isCurrentSlot && <span className="current-tag">Active</span>}
                    </div>
                    <div className="names-row">
                      <span className="names-text">
                        {entry.names[0]} <span className="names-amp">&amp;</span> {entry.names[1]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Upcoming Weeks ── */}
        {allData && allData.upcoming && (
          <section className="section">
            <h2 className="section-title">
              <CalendarIcon /> Next 4 Weeks
            </h2>
            <div className="upcoming-grid">
              {allData.upcoming.map((item, i) => (
                <div key={i}
                  className={`upcoming-card ${item.isOverridden ? 'upcoming-card--modified' : ''} ${editingDate === item.weekStartIso ? 'upcoming-card--editing' : ''}`}>

                  {editingDate === item.weekStartIso ? (
                    /* Upcoming edit mode */
                    <>
                      <div className="upcoming-week">Week {i + 2}</div>
                      <div className="edit-inputs-compact">
                        <input
                          className="edit-input-sm"
                          value={editNames[0]}
                          onChange={e => setEditNames([e.target.value, editNames[1]])}
                          placeholder="Name 1"
                          autoFocus
                        />
                        <span className="edit-sep-sm">&amp;</span>
                        <input
                          className="edit-input-sm"
                          value={editNames[1]}
                          onChange={e => setEditNames([editNames[0], e.target.value])}
                          placeholder="Name 2"
                        />
                      </div>
                      {saveError && <p className="save-error-sm">{saveError}</p>}
                      <div className="edit-actions-compact">
                        <button className="btn-save-sm" onClick={() => saveOverride(item.weekStartIso)} disabled={saving}>
                          <CheckIcon /> {saving ? '…' : 'Save'}
                        </button>
                        <button className="btn-cancel-sm" onClick={cancelEdit} disabled={saving}>
                          <XIcon />
                        </button>
                      </div>
                      <div className="upcoming-date">{item.dateRange}</div>
                    </>
                  ) : (
                    /* Upcoming normal mode */
                    <>
                      <div className="upcoming-week">Week {i + 2}</div>
                      <div className="upcoming-names">{item.names.join(' & ')}</div>
                      {item.isOverridden && (
                        <div className="override-pill">✏️ Modified</div>
                      )}
                      <div className="upcoming-date">{item.dateRange}</div>
                      <div className="upcoming-actions">
                        <button className="btn-edit-sm"
                          onClick={() => requestEdit(item.weekStartIso, item.names)}>
                          <PencilIcon /> Edit
                        </button>
                        {item.isOverridden && (
                          <button className="btn-reset-sm"
                            onClick={() => resetOverride(item.weekStartIso)}
                            title="Reset to rotation">
                            <ResetIcon /> Reset
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Duty Schedule &copy; {new Date().getFullYear()} — Auto-rotates every week</p>
      </footer>
    </div>
  );
}
