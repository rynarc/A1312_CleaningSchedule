import { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import { supabase } from './supabaseClient';
import { getCurrentSchedule, getAllSchedule } from './schedule';

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
function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
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

/* ─── Confirm Delete Modal ───────────────────────────────────── */
function ConfirmDeleteModal({ team, error, onConfirm, onCancel }) {
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onCancel();
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-card">
        <button className="modal-close" onClick={onCancel} title="Close"><XIcon /></button>
        <div className="modal-lock-icon"><TrashIcon /></div>
        <h2 className="modal-title">Remove this team?</h2>
        <p className="modal-desc">
          <strong>{team.name1} &amp; {team.name2}</strong> will be removed from the rotation.
          This applies immediately for everyone.
        </p>
        {error && <p className="modal-error">❌ {error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn-cancel modal-btn-cancel" onClick={onConfirm}>
            <TrashIcon /> Remove
          </button>
          <button type="button" className="btn-save modal-btn-confirm" onClick={onCancel}>
            <XIcon /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ───────────────────────────────────────────────── */
export default function App() {
  // Base rotation, shared by everyone via Supabase — no more per-date overrides.
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Inline edit state for an existing team's names
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editNames, setEditNames] = useState(['', '']);
  const [saveError, setSaveError] = useState('');

  // Inline "add team" form
  const [addingNew, setAddingNew] = useState(false);
  const [newNames, setNewNames] = useState(['', '']);

  // Password modal — gates edit / add / delete alike
  const [showPwModal, setShowPwModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Confirm-delete modal (shown after the password gate, for the delete action)
  const [confirmDeleteTeam, setConfirmDeleteTeam] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  async function loadTeams() {
    setLoading(true);
    setLoadError('');
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('position', { ascending: true });
    if (error) {
      setLoadError(error.message);
    } else {
      setTeams(data || []);
    }
    setLoading(false);
  }

  useEffect(() => { loadTeams(); }, []);

  const current = useMemo(() => (teams.length ? getCurrentSchedule(teams) : null), [teams]);
  const allData = useMemo(() => getAllSchedule(teams), [teams]);

  // Step 1: click Edit/Delete/Add → show password modal
  function requestEdit(team) {
    setPendingAction({ type: 'edit', teamId: team.id, names: [team.name1, team.name2] });
    setShowPwModal(true);
  }
  function requestAdd() {
    setPendingAction({ type: 'add' });
    setShowPwModal(true);
  }
  function requestDelete(team) {
    if (teams.length <= 1) return; // guarded in the UI too — button is hidden
    setPendingAction({ type: 'delete', teamId: team.id, name1: team.name1, name2: team.name2 });
    setShowPwModal(true);
  }

  // Step 2: password correct → carry out the pending action
  function onPasswordSuccess() {
    setShowPwModal(false);
    const action = pendingAction;
    setPendingAction(null);
    if (!action) return;

    if (action.type === 'edit') {
      setEditingTeamId(action.teamId);
      setEditNames([...action.names]);
      setSaveError('');
    } else if (action.type === 'add') {
      setAddingNew(true);
      setNewNames(['', '']);
      setSaveError('');
    } else if (action.type === 'delete') {
      setDeleteError('');
      setConfirmDeleteTeam({ id: action.teamId, name1: action.name1, name2: action.name2 });
    }
  }

  function closeModal() {
    setShowPwModal(false);
    setPendingAction(null);
  }

  function cancelEdit() {
    setEditingTeamId(null);
    setEditNames(['', '']);
    setSaveError('');
  }

  function cancelAdd() {
    setAddingNew(false);
    setNewNames(['', '']);
    setSaveError('');
  }

  // Edit an existing team's names — persists to Supabase, visible to everyone
  async function saveEditedTeam(teamId) {
    if (editNames.some(n => !n.trim())) {
      setSaveError('Name cannot be empty.');
      return;
    }
    const [name1, name2] = editNames.map(n => n.trim());
    const { error } = await supabase.from('teams').update({ name1, name2 }).eq('id', teamId);
    if (error) {
      setSaveError(`Failed to save: ${error.message}`);
      return;
    }
    setTeams(prev => prev.map(t => (t.id === teamId ? { ...t, name1, name2 } : t)));
    setEditingTeamId(null);
  }

  // Add a new team at the end of the rotation (week 6, 7, ...)
  async function addTeam() {
    if (newNames.some(n => !n.trim())) {
      setSaveError('Name cannot be empty.');
      return;
    }
    const [name1, name2] = newNames.map(n => n.trim());
    const position = teams.length ? Math.max(...teams.map(t => t.position)) + 1 : 1;
    const { data, error } = await supabase
      .from('teams')
      .insert({ name1, name2, position })
      .select()
      .single();
    if (error) {
      setSaveError(`Failed to add team: ${error.message}`);
      return;
    }
    setTeams(prev => [...prev, data].sort((a, b) => a.position - b.position));
    setAddingNew(false);
    setNewNames(['', '']);
  }

  // Remove a team from the rotation — shortens the cycle for everyone.
  // Called from the confirm-delete modal, after the password gate.
  async function confirmDelete() {
    if (!confirmDeleteTeam) return;
    const { error } = await supabase.from('teams').delete().eq('id', confirmDeleteTeam.id);
    if (error) {
      setDeleteError(`Failed to remove team: ${error.message}`);
      return;
    }
    setTeams(prev => prev.filter(t => t.id !== confirmDeleteTeam.id));
    setConfirmDeleteTeam(null);
    setDeleteError('');
  }

  function cancelDelete() {
    setConfirmDeleteTeam(null);
    setDeleteError('');
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading schedule...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="loading-screen">
        <p>⚠️ Could not load schedule: {loadError}</p>
        <p>Check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in client/.env.</p>
      </div>
    );
  }

  return (
    <div className="app">
      {showPwModal && (
        <PasswordModal onSuccess={onPasswordSuccess} onClose={closeModal} />
      )}
      {confirmDeleteTeam && (
        <ConfirmDeleteModal
          team={confirmDeleteTeam}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
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

            {editingTeamId === current.teamId ? (
              /* Hero edit mode */
              <div className="hero-edit-form">
                <p className="hero-edit-label">Change this team's names</p>
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
                  <button className="btn-save" onClick={() => saveEditedTeam(current.teamId)}>
                    <CheckIcon /> Save
                  </button>
                  <button className="btn-cancel" onClick={cancelEdit}>
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
                    Slot {current.index + 1} of {teams.length}
                  </span>
                </div>

                {!current.isToday && current.lastNames && (
                  <p className="hero-note">
                    🙏 Thank you <strong>{current.lastNames[0]} &amp; {current.lastNames[1]}</strong> for this week's duty!
                  </p>
                )}

                {/* Edit button at bottom of hero */}
                <button
                  className="btn-hero-edit"
                  onClick={() => requestEdit({ id: current.teamId, name1: current.names[0], name2: current.names[1] })}
                >
                  <PencilIcon /> Edit this team
                </button>
              </>
            )}
          </section>
        )}

        {/* ── Rotation Table (the base data — editable) ── */}
        <section className="section">
          <h2 className="section-title">
            <UsersIcon /> Duty Rotation ({teams.length} {teams.length === 1 ? 'Week' : 'Weeks'})
          </h2>
          <div className="table-card">
            {teams.map((team, idx) => {
              const isCurrentSlot = idx === allData.currentIndex;
              return (
                <div key={team.id}
                  className={`table-row ${isCurrentSlot ? 'table-row--active' : ''}`}>
                  <div className="row-slot">
                    <span className={`slot-pill ${isCurrentSlot ? 'slot-pill--active' : ''}`}>
                      Week {idx + 1}
                    </span>
                    {isCurrentSlot && <span className="current-tag">Active</span>}
                  </div>

                  {editingTeamId === team.id ? (
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
                      {saveError && <p className="save-error-sm">{saveError}</p>}
                      <div className="edit-actions-compact">
                        <button className="btn-save-sm" onClick={() => saveEditedTeam(team.id)}>
                          <CheckIcon /> Save
                        </button>
                        <button className="btn-cancel-sm" onClick={cancelEdit}>
                          <XIcon />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="names-row">
                      <span className="names-text">
                        {team.name1} <span className="names-amp">&amp;</span> {team.name2}
                      </span>
                      <div className="upcoming-actions">
                        <button className="btn-edit-sm" onClick={() => requestEdit(team)}>
                          <PencilIcon /> Edit
                        </button>
                        {teams.length > 1 && (
                          <button className="btn-delete-sm" onClick={() => requestDelete(team)}>
                            <TrashIcon /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add new team row */}
            <div className="table-row table-row--add">
              {addingNew ? (
                <div className="edit-inputs-compact">
                  <input
                    className="edit-input-sm"
                    value={newNames[0]}
                    onChange={e => setNewNames([e.target.value, newNames[1]])}
                    placeholder="Name 1"
                    autoFocus
                  />
                  <span className="edit-sep-sm">&amp;</span>
                  <input
                    className="edit-input-sm"
                    value={newNames[1]}
                    onChange={e => setNewNames([newNames[0], e.target.value])}
                    placeholder="Name 2"
                  />
                  {saveError && <p className="save-error-sm">{saveError}</p>}
                  <div className="edit-actions-compact">
                    <button className="btn-save-sm" onClick={addTeam}>
                      <CheckIcon /> Save
                    </button>
                    <button className="btn-cancel-sm" onClick={cancelAdd}>
                      <XIcon />
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn-add-team" onClick={requestAdd}>
                  <PlusIcon /> Add Team (Week {teams.length + 1})
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Upcoming Weeks ── */}
        {allData && allData.upcoming.length > 0 && (
          <section className="section">
            <h2 className="section-title">
              <CalendarIcon /> Next 4 Weeks
            </h2>
            <div className="upcoming-grid">
              {allData.upcoming.map((item, i) => (
                <div key={i}
                  className={`upcoming-card ${editingTeamId === item.teamId ? 'upcoming-card--editing' : ''}`}>

                  {editingTeamId === item.teamId ? (
                    /* Upcoming edit mode */
                    <>
                      <div className="upcoming-week">Week {item.index + 1}</div>
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
                        <button className="btn-save-sm" onClick={() => saveEditedTeam(item.teamId)}>
                          <CheckIcon /> Save
                        </button>
                        <button className="btn-cancel-sm" onClick={cancelEdit}>
                          <XIcon />
                        </button>
                      </div>
                      <div className="upcoming-date">{item.dateRange}</div>
                    </>
                  ) : (
                    /* Upcoming normal mode */
                    <>
                      <div className="upcoming-week">Week {item.index + 1}</div>
                      <div className="upcoming-names">{item.names.join(' & ')}</div>
                      <div className="upcoming-date">{item.dateRange}</div>
                      <div className="upcoming-actions">
                        <button className="btn-edit-sm"
                          onClick={() => requestEdit({ id: item.teamId, name1: item.names[0], name2: item.names[1] })}>
                          <PencilIcon /> Edit
                        </button>
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
