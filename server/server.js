const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'db.json');

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Returns Sunday of the week containing the given date
function getWeekStart(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  return d;
}

function computeCurrentSlot(referenceDate) {
  const refSunday = getWeekStart(referenceDate);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDay = today.getDay();

  // If today IS Sunday → show this week's piket (happening today)
  // If today is Mon–Sat → the Sunday piket has passed; show NEXT Sunday's piket
  let targetSunday;
  if (todayDay === 0) {
    targetSunday = today;
  } else {
    targetSunday = new Date(today);
    targetSunday.setDate(today.getDate() + (7 - todayDay));
  }

  const weeksDiff = Math.round((targetSunday - refSunday) / msPerWeek);
  const slot = ((weeksDiff % 5) + 5) % 5 + 1;
  const isToday = todayDay === 0;
  return { slot, weekNumber: weeksDiff + 1, weekStart: targetSunday, isToday };
}

function formatSundayDate(weekStart) {
  const opts = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  return weekStart.toLocaleDateString('en-GB', opts);
}

// Check if a specific Sunday date has an override, return overridden names or defaults
function applyOverride(db, dateIso, defaultNames) {
  const ov = (db.overrides || []).find(o => o.date === dateIso);
  return ov
    ? { names: ov.names, isOverridden: true }
    : { names: defaultNames, isOverridden: false };
}

// GET /api/schedule/current
app.get('/api/schedule/current', (req, res) => {
  const db = readDB();
  const { slot, weekNumber, weekStart, isToday } = computeCurrentSlot(db.referenceDate);
  const entry = db.schedule.find(s => s.slot === slot);
  const dateIso = weekStart.toISOString().split('T')[0];
  const { names, isOverridden } = applyOverride(db, dateIso, entry.names);

  // Previous slot = who did duty last Sunday
  const prevSlot = ((slot - 2 + 5) % 5) + 1;
  const prevEntry = db.schedule.find(s => s.slot === prevSlot);

  res.json({
    slot,
    weekNumber,
    names,
    originalNames: entry.names,
    isOverridden,
    lastNames: prevEntry.names,
    dateRange: formatSundayDate(weekStart),
    isToday,
    weekStartIso: dateIso,
  });
});

// GET /api/schedule/all
app.get('/api/schedule/all', (req, res) => {
  const db = readDB();
  const { slot: currentSlot, weekStart: currentWeekStart } = computeCurrentSlot(db.referenceDate);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;

  const upcoming = [];
  for (let i = 1; i <= 4; i++) {
    const ws = new Date(currentWeekStart.getTime() + i * msPerWeek);
    const futureSlot = ((currentSlot - 1 + i) % 5) + 1;
    const entry = db.schedule.find(s => s.slot === futureSlot);
    const dateIso = ws.toISOString().split('T')[0];
    const { names, isOverridden } = applyOverride(db, dateIso, entry.names);
    upcoming.push({
      slot: futureSlot,
      names,
      originalNames: entry.names,
      isOverridden,
      dateRange: formatSundayDate(ws),
      weekStartIso: dateIso,
    });
  }

  res.json({
    schedule: db.schedule,
    currentSlot,
    upcoming,
  });
});

// PUT /api/override — set a one-time override for a specific Sunday
app.put('/api/override', (req, res) => {
  const { date, names } = req.body;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'date must be in YYYY-MM-DD format' });
  }
  if (!Array.isArray(names) || names.length !== 2 || names.some(n => typeof n !== 'string' || !n.trim())) {
    return res.status(400).json({ error: 'names must be an array of exactly 2 non-empty strings' });
  }
  const db = readDB();
  if (!db.overrides) db.overrides = [];
  const idx = db.overrides.findIndex(o => o.date === date);
  if (idx >= 0) {
    db.overrides[idx].names = names.map(n => n.trim());
  } else {
    db.overrides.push({ date, names: names.map(n => n.trim()) });
  }
  writeDB(db);
  res.json({ success: true });
});

// DELETE /api/override/:date — remove override, revert to normal rotation
app.delete('/api/override/:date', (req, res) => {
  const { date } = req.params;
  const db = readDB();
  if (!db.overrides) db.overrides = [];
  db.overrides = db.overrides.filter(o => o.date !== date);
  writeDB(db);
  res.json({ success: true });
});

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`   Run this to free it:  npx kill-port ${PORT}\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
