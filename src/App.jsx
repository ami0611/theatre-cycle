import { useState, useRef } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const EMOJIS = ['⭐', '🌟', '🦄', '🐶', '🐱', '🐸', '🦊', '🐼', '🐨', '🦁', '🐯', '🐰', '🐻', '🦋', '🌈', '🚀', '🎮', '🎨', '🎵', '⚽']
const SCREEN_EMOJIS = ['📱', '🎮', '📺', '💻', '🎬', '🎧', '📸', '🕹️']

const COLORS = {
  primary: '#7c3aed',
  primaryLight: '#ede9fe',
  secondary: '#ec4899',
  secondaryLight: '#fce7f3',
  accent: '#f59e0b',
  accentLight: '#fef3c7',
  green: '#10b981',
  greenLight: '#d1fae5',
  blue: '#3b82f6',
  blueLight: '#dbeafe',
  bg: '#faf5ff',
  card: '#ffffff',
  text: '#1e1b4b',
  muted: '#6b7280',
  border: '#e5e7eb',
}

function genId() {
  return Math.random().toString(36).slice(2)
}

const defaultChores = [
  { id: genId(), name: 'Make bed', allowance: 0.25, screenTime: 10, emoji: '🛏️' },
  { id: genId(), name: 'Clean room', allowance: 0.50, screenTime: 15, emoji: '🧹' },
  { id: genId(), name: 'Do homework', allowance: 1.00, screenTime: 20, emoji: '📚' },
]

const defaultActivities = [
  { id: genId(), name: 'YouTube', emoji: '📺' },
  { id: genId(), name: 'Video Games', emoji: '🎮' },
  { id: genId(), name: 'Tablet / iPad', emoji: '📱' },
]

export default function App() {
  const [tab, setTab] = useState('setup')
  const [kid, setKid] = useState({ name: '', age: '', emoji: '⭐', weeklyBudget: 10, dailyScreenLimit: 120 })
  const [chores, setChores] = useState(defaultChores)
  const [activities, setActivities] = useState(defaultActivities)
  const [checks, setChecks] = useState({}) // { choreId_day: true }
  const [newChore, setNewChore] = useState({ name: '', allowance: '', screenTime: '', emoji: '⭐' })
  const [newActivity, setNewActivity] = useState({ name: '', emoji: '📺' })
  const printRef = useRef()

  // ── helpers ──────────────────────────────────────────────
  const toggleCheck = (choreId, day) => {
    const key = `${choreId}_${day}`
    setChecks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const earnedToday = (day) =>
    chores.reduce((sum, c) => sum + (checks[`${c.id}_${day}`] ? parseFloat(c.allowance) : 0), 0)

  const screenTimeToday = (day) =>
    chores.reduce((sum, c) => sum + (checks[`${c.id}_${day}`] ? parseInt(c.screenTime) : 0), 0)

  const totalEarned = () => DAYS.reduce((sum, d) => sum + earnedToday(d), 0)
  const totalScreen = () => DAYS.reduce((sum, d) => sum + screenTimeToday(d), 0)

  const addChore = () => {
    if (!newChore.name.trim()) return
    setChores(prev => [...prev, { id: genId(), ...newChore, allowance: parseFloat(newChore.allowance) || 0, screenTime: parseInt(newChore.screenTime) || 0 }])
    setNewChore({ name: '', allowance: '', screenTime: '', emoji: '⭐' })
  }

  const removeChore = (id) => setChores(prev => prev.filter(c => c.id !== id))

  const addActivity = () => {
    if (!newActivity.name.trim()) return
    setActivities(prev => [...prev, { id: genId(), ...newActivity }])
    setActivity({ name: '', emoji: '📺' })
  }

  const setActivity = (v) => setNewActivity(v)
  const removeActivity = (id) => setActivities(prev => prev.filter(a => a.id !== id))

  const handlePrint = () => window.print()

  // ── shared styles ────────────────────────────────────────
  const card = {
    background: COLORS.card,
    borderRadius: 16,
    padding: '24px',
    boxShadow: '0 2px 12px rgba(124,58,237,0.08)',
    border: `1px solid ${COLORS.border}`,
    marginBottom: 20,
  }

  const btn = (color = COLORS.primary, bg = COLORS.primaryLight) => ({
    background: bg,
    color: color,
    border: 'none',
    borderRadius: 10,
    padding: '8px 18px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'opacity .15s',
  })

  const input = {
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 14,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const tabStyle = (active) => ({
    padding: '10px 20px',
    border: 'none',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    background: active ? COLORS.primary : 'transparent',
    color: active ? '#fff' : COLORS.muted,
    transition: 'all .2s',
  })

  const label = { fontSize: 13, fontWeight: 600, color: COLORS.muted, marginBottom: 4, display: 'block' }

  // ── SETUP TAB ─────────────────────────────────────────────
  const SetupTab = () => (
    <div>
      <div style={{ ...card, background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)', color: '#fff', border: 'none' }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>👋 Welcome, Mom!</h2>
        <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: 15 }}>
          Build a fun allowance & screen time chart your kids will love.
        </p>
      </div>

      <div style={card}>
        <h3 style={{ margin: '0 0 18px', color: COLORS.text }}>🧒 Kid's Profile</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: 160 }}>
            <span style={label}>Child's Name</span>
            <input
              style={input}
              placeholder="e.g. Emma"
              value={kid.name}
              onChange={e => setKid(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <span style={label}>Age</span>
            <input
              style={input}
              placeholder="e.g. 8"
              type="number"
              min={1}
              max={18}
              value={kid.age}
              onChange={e => setKid(p => ({ ...p, age: e.target.value }))}
            />
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <span style={label}>Pick an emoji for {kid.name || 'your child'}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
            {EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setKid(p => ({ ...p, emoji: e }))}
                style={{
                  fontSize: 24,
                  background: kid.emoji === e ? COLORS.primaryLight : '#f9fafb',
                  border: kid.emoji === e ? `2px solid ${COLORS.primary}` : '2px solid transparent',
                  borderRadius: 10,
                  padding: 6,
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={card}>
        <h3 style={{ margin: '0 0 18px', color: COLORS.text }}>💰 Allowance & Screen Time Goals</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <span style={label}>Weekly Allowance Budget ($)</span>
            <input
              style={input}
              type="number"
              min={0}
              step={0.5}
              placeholder="e.g. 10.00"
              value={kid.weeklyBudget}
              onChange={e => setKid(p => ({ ...p, weeklyBudget: parseFloat(e.target.value) || 0 }))}
            />
            <span style={{ fontSize: 12, color: COLORS.muted, marginTop: 4, display: 'block' }}>
              Max they can earn per week
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <span style={label}>Daily Screen Time Limit (minutes)</span>
            <input
              style={input}
              type="number"
              min={0}
              step={15}
              placeholder="e.g. 120"
              value={kid.dailyScreenLimit}
              onChange={e => setKid(p => ({ ...p, dailyScreenLimit: parseInt(e.target.value) || 0 }))}
            />
            <span style={{ fontSize: 12, color: COLORS.muted, marginTop: 4, display: 'block' }}>
              Max screen time per day
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setTab('chores')}
        style={{ ...btn('#fff', COLORS.primary), padding: '12px 32px', fontSize: 15, borderRadius: 12 }}
      >
        Next: Add Chores →
      </button>
    </div>
  )

  // ── CHORES TAB ────────────────────────────────────────────
  const ChoresTab = () => (
    <div>
      <div style={card}>
        <h3 style={{ margin: '0 0 6px', color: COLORS.text }}>🧹 What {kid.name || 'your child'} needs to work on</h3>
        <p style={{ margin: '0 0 18px', color: COLORS.muted, fontSize: 14 }}>
          Add chores or tasks. Set how much allowance and screen time each one earns.
        </p>

        {chores.map((c, i) => (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            background: i % 2 === 0 ? '#faf5ff' : '#fff',
            borderRadius: 10, marginBottom: 8, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 22 }}>{c.emoji}</span>
            <span style={{ flex: 2, minWidth: 100, fontWeight: 600, fontSize: 15, color: COLORS.text }}>{c.name}</span>
            <span style={{ background: COLORS.greenLight, color: COLORS.green, borderRadius: 8, padding: '3px 10px', fontSize: 13, fontWeight: 700 }}>
              ${parseFloat(c.allowance).toFixed(2)}
            </span>
            <span style={{ background: COLORS.blueLight, color: COLORS.blue, borderRadius: 8, padding: '3px 10px', fontSize: 13, fontWeight: 700 }}>
              {c.screenTime} min
            </span>
            <button onClick={() => removeChore(c.id)} style={{ ...btn('#ef4444', '#fee2e2'), padding: '4px 10px', fontSize: 13 }}>✕</button>
          </div>
        ))}
      </div>

      <div style={card}>
        <h4 style={{ margin: '0 0 14px', color: COLORS.text }}>➕ Add a New Chore</h4>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          <div style={{ flex: 3, minWidth: 160 }}>
            <span style={label}>Chore / Task Name</span>
            <input
              style={input}
              placeholder="e.g. Set the table"
              value={newChore.name}
              onChange={e => setNewChore(p => ({ ...p, name: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addChore()}
            />
          </div>
          <div style={{ flex: 1, minWidth: 110 }}>
            <span style={label}>Allowance ($)</span>
            <input
              style={input}
              type="number"
              min={0}
              step={0.25}
              placeholder="0.50"
              value={newChore.allowance}
              onChange={e => setNewChore(p => ({ ...p, allowance: e.target.value }))}
            />
          </div>
          <div style={{ flex: 1, minWidth: 110 }}>
            <span style={label}>Screen Time (min)</span>
            <input
              style={input}
              type="number"
              min={0}
              step={5}
              placeholder="15"
              value={newChore.screenTime}
              onChange={e => setNewChore(p => ({ ...p, screenTime: e.target.value }))}
            />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <span style={label}>Emoji</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['🛏️','🧹','📚','🍽️','🐾','🌿','🗑️','🧺','🚿','🧼','🍎','🥦','🏃','🎨','🎵','🐕','🌸','🌟','✏️','📦'].map(e => (
              <button
                key={e}
                onClick={() => setNewChore(p => ({ ...p, emoji: e }))}
                style={{
                  fontSize: 20,
                  background: newChore.emoji === e ? COLORS.primaryLight : '#f9fafb',
                  border: newChore.emoji === e ? `2px solid ${COLORS.primary}` : '2px solid transparent',
                  borderRadius: 8, padding: 4, cursor: 'pointer', lineHeight: 1,
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <button onClick={addChore} style={{ ...btn('#fff', COLORS.primary), padding: '10px 24px' }}>
          + Add Chore
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => setTab('setup')} style={{ ...btn(COLORS.muted, '#f3f4f6'), padding: '12px 24px' }}>← Back</button>
        <button onClick={() => setTab('activities')} style={{ ...btn('#fff', COLORS.primary), padding: '12px 24px' }}>Next: Favorites →</button>
      </div>
    </div>
  )

  // ── ACTIVITIES TAB ────────────────────────────────────────
  const ActivitiesTab = () => (
    <div>
      <div style={card}>
        <h3 style={{ margin: '0 0 6px', color: COLORS.text }}>🎮 What {kid.name || 'your child'} loves to do</h3>
        <p style={{ margin: '0 0 18px', color: COLORS.muted, fontSize: 14 }}>
          Add screen time activities or things they enjoy as motivation.
        </p>

        {activities.map((a, i) => (
          <div key={a.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            background: i % 2 === 0 ? '#fdf2f8' : '#fff',
            borderRadius: 10, marginBottom: 8,
          }}>
            <span style={{ fontSize: 22 }}>{a.emoji}</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15, color: COLORS.text }}>{a.name}</span>
            <button onClick={() => removeActivity(a.id)} style={{ ...btn('#ef4444', '#fee2e2'), padding: '4px 10px', fontSize: 13 }}>✕</button>
          </div>
        ))}
      </div>

      <div style={card}>
        <h4 style={{ margin: '0 0 14px', color: COLORS.text }}>➕ Add a Favorite Activity</h4>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <span style={label}>Activity Name</span>
            <input
              style={input}
              placeholder="e.g. Minecraft, YouTube, TV"
              value={newActivity.name}
              onChange={e => setActivity({ ...newActivity, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addActivity()}
            />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <span style={label}>Emoji</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {SCREEN_EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setActivity({ ...newActivity, emoji: e })}
                style={{
                  fontSize: 22,
                  background: newActivity.emoji === e ? COLORS.secondaryLight : '#f9fafb',
                  border: newActivity.emoji === e ? `2px solid ${COLORS.secondary}` : '2px solid transparent',
                  borderRadius: 8, padding: 5, cursor: 'pointer', lineHeight: 1,
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <button onClick={addActivity} style={{ ...btn('#fff', COLORS.secondary), padding: '10px 24px' }}>
          + Add Activity
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => setTab('chores')} style={{ ...btn(COLORS.muted, '#f3f4f6'), padding: '12px 24px' }}>← Back</button>
        <button onClick={() => setTab('chart')} style={{ ...btn('#fff', COLORS.primary), padding: '12px 24px' }}>Build Chart →</button>
      </div>
    </div>
  )

  // ── CHART TAB ─────────────────────────────────────────────
  const ChartTab = () => {
    const weekEarned = totalEarned()
    const weekScreen = totalScreen()
    return (
      <div>
        {/* Summary cards */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Week Earned', value: `$${weekEarned.toFixed(2)}`, max: `/ $${kid.weeklyBudget.toFixed(2)}`, color: COLORS.green, bg: COLORS.greenLight, emoji: '💰' },
            { label: 'Screen Time Earned', value: `${weekScreen} min`, max: `/ ${kid.dailyScreenLimit * 7} min max`, color: COLORS.blue, bg: COLORS.blueLight, emoji: '⏱️' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, minWidth: 160, background: s.bg, borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ fontSize: 22 }}>{s.emoji}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: s.color, opacity: 0.8 }}>{s.max}</div>
              <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Weekly chore chart */}
        <div style={{ ...card, overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ margin: 0, color: COLORS.text }}>
              {kid.emoji} {kid.name || 'My'}'s Weekly Chart
            </h3>
            <button
              onClick={() => setChecks({})}
              style={{ ...btn('#ef4444', '#fee2e2'), fontSize: 13 }}
            >
              Reset Week
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: COLORS.muted, fontWeight: 600, minWidth: 130 }}>Chore</th>
                <th style={{ textAlign: 'center', padding: '6px 4px', color: COLORS.muted, fontWeight: 600, minWidth: 28 }}>💰</th>
                {DAYS.map(d => (
                  <th key={d} style={{ textAlign: 'center', padding: '8px 6px', color: COLORS.primary, fontWeight: 700, minWidth: 44 }}>{d}</th>
                ))}
                <th style={{ textAlign: 'center', padding: '8px 6px', color: COLORS.muted, fontWeight: 600, minWidth: 50 }}>Done</th>
              </tr>
            </thead>
            <tbody>
              {chores.map((c, i) => {
                const doneCount = DAYS.filter(d => checks[`${c.id}_${d}`]).length
                return (
                  <tr key={c.id} style={{ background: i % 2 === 0 ? '#faf5ff' : '#fff' }}>
                    <td style={{ padding: '10px 10px', fontWeight: 600, color: COLORS.text }}>
                      <span style={{ marginRight: 6 }}>{c.emoji}</span>{c.name}
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px 4px', color: COLORS.green, fontWeight: 700, fontSize: 13 }}>
                      ${parseFloat(c.allowance).toFixed(2)}
                    </td>
                    {DAYS.map(d => {
                      const checked = !!checks[`${c.id}_${d}`]
                      return (
                        <td key={d} style={{ textAlign: 'center', padding: '8px 4px' }}>
                          <button
                            onClick={() => toggleCheck(c.id, d)}
                            style={{
                              width: 32, height: 32, borderRadius: 8,
                              border: `2px solid ${checked ? COLORS.primary : COLORS.border}`,
                              background: checked ? COLORS.primary : '#fff',
                              cursor: 'pointer', fontSize: 16, color: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              margin: '0 auto',
                            }}
                          >
                            {checked ? '✓' : ''}
                          </button>
                        </td>
                      )
                    })}
                    <td style={{ textAlign: 'center', padding: '10px 6px' }}>
                      <span style={{
                        background: doneCount === 7 ? COLORS.greenLight : COLORS.primaryLight,
                        color: doneCount === 7 ? COLORS.green : COLORS.primary,
                        borderRadius: 8, padding: '3px 10px', fontWeight: 700, fontSize: 13,
                      }}>
                        {doneCount}/7
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: `2px solid ${COLORS.border}` }}>
                <td colSpan={2} style={{ padding: '10px 10px', fontWeight: 700, color: COLORS.text }}>💰 Earned</td>
                {DAYS.map(d => (
                  <td key={d} style={{ textAlign: 'center', padding: '10px 4px', fontWeight: 700, color: COLORS.green, fontSize: 13 }}>
                    ${earnedToday(d).toFixed(2)}
                  </td>
                ))}
                <td style={{ textAlign: 'center', fontWeight: 800, color: COLORS.green }}>${weekEarned.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ padding: '6px 10px', fontWeight: 700, color: COLORS.text }}>📱 Screen Time</td>
                {DAYS.map(d => {
                  const st = screenTimeToday(d)
                  const over = st > kid.dailyScreenLimit
                  return (
                    <td key={d} style={{ textAlign: 'center', padding: '6px 4px', fontWeight: 700, color: over ? '#ef4444' : COLORS.blue, fontSize: 13 }}>
                      {st}m
                    </td>
                  )
                })}
                <td style={{ textAlign: 'center', fontWeight: 800, color: COLORS.blue }}>{weekScreen}m</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Favorites list */}
        {activities.length > 0 && (
          <div style={card}>
            <h4 style={{ margin: '0 0 12px', color: COLORS.text }}>🌟 Favorite Screen Time Activities</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {activities.map(a => (
                <div key={a.id} style={{
                  background: COLORS.secondaryLight, borderRadius: 12, padding: '8px 16px',
                  display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: COLORS.secondary,
                }}>
                  <span style={{ fontSize: 18 }}>{a.emoji}</span>
                  <span>{a.name}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 13, color: COLORS.muted }}>
              Daily limit: <strong>{kid.dailyScreenLimit} min</strong> for these activities
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => setTab('activities')} style={{ ...btn(COLORS.muted, '#f3f4f6'), padding: '12px 24px' }}>← Back</button>
          <button onClick={() => setTab('print')} style={{ ...btn('#fff', COLORS.secondary), padding: '12px 28px' }}>
            🖨️ Preview & Print
          </button>
        </div>
      </div>
    )
  }

  // ── PRINT TAB ─────────────────────────────────────────────
  const PrintTab = () => {
    const weekEarned = totalEarned()
    const weekScreen = totalScreen()
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ margin: 0, color: COLORS.text }}>Print Preview</h3>
          <button
            onClick={handlePrint}
            style={{ ...btn('#fff', COLORS.primary), padding: '12px 28px', fontSize: 15 }}
          >
            🖨️ Print Chart
          </button>
        </div>

        <div
          ref={printRef}
          className="print-area"
          style={{ background: '#fff', borderRadius: 16, padding: '24px 16px', border: `2px solid ${COLORS.border}`, overflowX: 'auto', width: '100%', boxSizing: 'border-box' }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: `3px dashed ${COLORS.primary}`, paddingBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{kid.emoji}</div>
            <h1 style={{ margin: 0, fontSize: 28, color: COLORS.primary, fontFamily: 'inherit' }}>
              {kid.name ? `${kid.name}'s` : 'My'} Allowance & Screen Time Chart
            </h1>
            {kid.age && (
              <p style={{ margin: '6px 0 0', color: COLORS.muted, fontSize: 15 }}>Age {kid.age} · Week of _______________</p>
            )}
          </div>

          {/* Allowance chart */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: COLORS.primary, fontSize: 18, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              💰 Allowance Chart
              <span style={{ fontSize: 13, background: COLORS.greenLight, color: COLORS.green, borderRadius: 8, padding: '3px 10px', fontWeight: 700 }}>
                Goal: ${kid.weeklyBudget.toFixed(2)} / week
              </span>
            </h2>
            <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: COLORS.primaryLight }}>
                  <th style={{ textAlign: 'left', padding: '9px 10px', color: COLORS.primary, borderRadius: '8px 0 0 0' }}>Chore</th>
                  <th style={{ textAlign: 'center', padding: '9px 6px', color: COLORS.primary }}>Earns</th>
                  {DAYS.map(d => (
                    <th key={d} style={{ textAlign: 'center', padding: '9px 6px', color: COLORS.primary, minWidth: 40 }}>{d}</th>
                  ))}
                  <th style={{ textAlign: 'center', padding: '9px 6px', color: COLORS.primary }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {chores.map((c, i) => (
                  <tr key={c.id} style={{ background: i % 2 === 0 ? '#faf5ff' : '#fff', borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '10px 10px', fontWeight: 600 }}>
                      {c.emoji} {c.name}
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px 6px', color: COLORS.green, fontWeight: 700 }}>
                      ${parseFloat(c.allowance).toFixed(2)}
                    </td>
                    {DAYS.map(d => (
                      <td key={d} style={{ textAlign: 'center', padding: '10px 6px' }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 6,
                          border: `2px solid ${checks[`${c.id}_${d}`] ? COLORS.primary : '#d1d5db'}`,
                          background: checks[`${c.id}_${d}`] ? COLORS.primary : '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto', color: '#fff', fontSize: 15, fontWeight: 700,
                        }}>
                          {checks[`${c.id}_${d}`] ? '✓' : ''}
                        </div>
                      </td>
                    ))}
                    <td style={{ textAlign: 'center', padding: '10px 6px', fontWeight: 700, color: COLORS.green }}>
                      ${(DAYS.filter(d => checks[`${c.id}_${d}`]).length * parseFloat(c.allowance)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: COLORS.greenLight, borderTop: `2px solid ${COLORS.green}` }}>
                  <td colSpan={2} style={{ padding: '10px 10px', fontWeight: 800, color: COLORS.green }}>💰 Daily Total</td>
                  {DAYS.map(d => (
                    <td key={d} style={{ textAlign: 'center', padding: '10px 6px', fontWeight: 800, color: COLORS.green }}>
                      ${earnedToday(d).toFixed(2)}
                    </td>
                  ))}
                  <td style={{ textAlign: 'center', fontWeight: 800, color: COLORS.green }}>${weekEarned.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            </div>
          </section>

          {/* Screen Time chart */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: COLORS.secondary, fontSize: 18, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              📱 Screen Time Chart
              <span style={{ fontSize: 13, background: COLORS.blueLight, color: COLORS.blue, borderRadius: 8, padding: '3px 10px', fontWeight: 700 }}>
                Limit: {kid.dailyScreenLimit} min / day
              </span>
            </h2>
            <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#fdf2f8' }}>
                  <th style={{ textAlign: 'left', padding: '9px 10px', color: COLORS.secondary }}>Chore</th>
                  <th style={{ textAlign: 'center', padding: '9px 6px', color: COLORS.secondary }}>Earns</th>
                  {DAYS.map(d => (
                    <th key={d} style={{ textAlign: 'center', padding: '9px 6px', color: COLORS.secondary, minWidth: 40 }}>{d}</th>
                  ))}
                  <th style={{ textAlign: 'center', padding: '9px 6px', color: COLORS.secondary }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {chores.map((c, i) => (
                  <tr key={c.id} style={{ background: i % 2 === 0 ? '#fdf2f8' : '#fff', borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '10px 10px', fontWeight: 600 }}>{c.emoji} {c.name}</td>
                    <td style={{ textAlign: 'center', padding: '10px 6px', color: COLORS.blue, fontWeight: 700 }}>
                      {c.screenTime}m
                    </td>
                    {DAYS.map(d => (
                      <td key={d} style={{ textAlign: 'center', padding: '10px 6px' }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 6,
                          border: `2px solid ${checks[`${c.id}_${d}`] ? COLORS.secondary : '#d1d5db'}`,
                          background: checks[`${c.id}_${d}`] ? COLORS.secondary : '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto', color: '#fff', fontSize: 15, fontWeight: 700,
                        }}>
                          {checks[`${c.id}_${d}`] ? '✓' : ''}
                        </div>
                      </td>
                    ))}
                    <td style={{ textAlign: 'center', padding: '10px 6px', fontWeight: 700, color: COLORS.blue }}>
                      {DAYS.filter(d => checks[`${c.id}_${d}`]).length * parseInt(c.screenTime)}m
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: COLORS.blueLight, borderTop: `2px solid ${COLORS.blue}` }}>
                  <td colSpan={2} style={{ padding: '10px 10px', fontWeight: 800, color: COLORS.blue }}>📱 Daily Total</td>
                  {DAYS.map(d => {
                    const st = screenTimeToday(d)
                    const over = st > kid.dailyScreenLimit
                    return (
                      <td key={d} style={{ textAlign: 'center', padding: '10px 6px', fontWeight: 800, color: over ? '#ef4444' : COLORS.blue }}>
                        {st}m
                      </td>
                    )
                  })}
                  <td style={{ textAlign: 'center', fontWeight: 800, color: COLORS.blue }}>{weekScreen}m</td>
                </tr>
              </tfoot>
            </table>
            </div>

            {/* Favorites */}
            {activities.length > 0 && (
              <div style={{ background: '#fdf2f8', borderRadius: 12, padding: '14px 16px' }}>
                <strong style={{ color: COLORS.secondary, fontSize: 14 }}>🌟 Favorite Screen Time Activities: </strong>
                <span style={{ color: COLORS.text, fontSize: 14 }}>
                  {activities.map(a => `${a.emoji} ${a.name}`).join('  ·  ')}
                </span>
              </div>
            )}
          </section>

          {/* Rules section */}
          <section style={{ border: `2px dashed ${COLORS.accent}`, borderRadius: 14, padding: '16px 20px', background: COLORS.accentLight }}>
            <h3 style={{ margin: '0 0 10px', color: '#92400e', fontSize: 16 }}>📋 The Rules</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#78350f', fontSize: 14, lineHeight: 1.8 }}>
              <li>Complete a chore to earn the allowance amount and screen time.</li>
              <li>Screen time is earned each day — it doesn't carry over.</li>
              <li>Maximum screen time per day: <strong>{kid.dailyScreenLimit} minutes</strong>.</li>
              <li>Maximum weekly allowance: <strong>${kid.weeklyBudget.toFixed(2)}</strong>.</li>
              <li>Mom or Dad checks off each chore when it's done!</li>
            </ul>
          </section>

          {/* Signature line */}
          <div style={{ marginTop: 28, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ borderBottom: '2px solid #d1d5db', paddingBottom: 4, marginBottom: 6 }}></div>
              <span style={{ fontSize: 13, color: COLORS.muted }}>Parent Signature</span>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ borderBottom: '2px solid #d1d5db', paddingBottom: 4, marginBottom: 6 }}></div>
              <span style={{ fontSize: 13, color: COLORS.muted }}>{kid.name ? `${kid.name}'s` : "Kid's"} Signature</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <button onClick={() => setTab('chart')} style={{ ...btn(COLORS.muted, '#f3f4f6'), padding: '12px 24px' }}>← Back to Chart</button>
          <button onClick={handlePrint} style={{ ...btn('#fff', COLORS.primary), padding: '12px 28px', fontSize: 15 }}>
            🖨️ Print Now
          </button>
        </div>
      </div>
    )
  }

  // ── LAYOUT ────────────────────────────────────────────────
  const tabs = [
    { id: 'setup', label: '1. Setup' },
    { id: 'chores', label: '2. Chores' },
    { id: 'activities', label: '3. Favorites' },
    { id: 'chart', label: '4. Chart' },
    { id: 'print', label: '5. Print' },
  ]

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; overflow-x: hidden; font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; background: ${COLORS.bg}; }
        button:hover { opacity: 0.85; }
        .table-scroll { overflow-x: auto; width: 100%; }
        .table-scroll table { min-width: 520px; }
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: fixed; left: 0; top: 0; width: 100%; padding: 20px; }
          nav, .no-print { display: none !important; }
        }
        @media (max-width: 600px) {
          table { font-size: 11px; }
          th, td { padding: 6px 3px !important; }
        }
      `}</style>

      {/* Top bar */}
      <header style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 2px 12px rgba(124,58,237,0.25)',
      }}>
        <span style={{ fontSize: 28 }}>⭐</span>
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px' }}>
            KidChart
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
            Allowance & Screen Time Builder
          </div>
        </div>
        {kid.name && (
          <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 14px', color: '#fff', fontSize: 14, fontWeight: 600 }}>
            {kid.emoji} {kid.name}
          </div>
        )}
      </header>

      {/* Nav tabs */}
      <nav className="no-print" style={{
        background: '#fff',
        borderBottom: `1px solid ${COLORS.border}`,
        padding: '8px 20px',
        display: 'flex',
        gap: 4,
        overflowX: 'auto',
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={tabStyle(tab === t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px' }}>
        {tab === 'setup' && SetupTab()}
        {tab === 'chores' && ChoresTab()}
        {tab === 'activities' && ActivitiesTab()}
        {tab === 'chart' && ChartTab()}
        {tab === 'print' && PrintTab()}
      </main>
    </>
  )
}
