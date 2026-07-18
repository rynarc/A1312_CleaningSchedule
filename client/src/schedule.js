// Rotation math only — team data now lives in Supabase (table `teams`),
// fetched at runtime so the rotation length can grow/shrink (add/remove team).

// Sunday used as the anchor: the first team (by position) is on duty during
// the week containing this date.
export const REFERENCE_DATE = '2026-06-07';

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

// Returns Sunday of the week containing the given date
function getWeekStart(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  return d;
}

function computeCurrentSlot(referenceDate, teamCount) {
  const refSunday = getWeekStart(referenceDate);

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

  const weeksDiff = Math.round((targetSunday - refSunday) / MS_PER_WEEK);
  const index = ((weeksDiff % teamCount) + teamCount) % teamCount;
  const isToday = todayDay === 0;
  return { index, weekNumber: weeksDiff + 1, weekStart: targetSunday, isToday };
}

function formatSundayDate(weekStart) {
  const opts = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  return weekStart.toLocaleDateString('en-GB', opts);
}

// Local-date ISO string (YYYY-MM-DD) — not toISOString(), which converts to
// UTC and shifts the date back a day in timezones ahead of UTC (e.g. WIB).
function toIso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// `teams` must be ordered by `position` ascending.
export function getCurrentSchedule(teams) {
  const n = teams.length;
  if (n === 0) return null;

  const { index, weekNumber, weekStart, isToday } = computeCurrentSlot(REFERENCE_DATE, n);
  const entry = teams[index];
  const prevIndex = ((index - 1) % n + n) % n;
  const prevEntry = teams[prevIndex];

  return {
    index,
    weekNumber,
    teamId: entry.id,
    names: [entry.name1, entry.name2],
    lastNames: [prevEntry.name1, prevEntry.name2],
    dateRange: formatSundayDate(weekStart),
    isToday,
    weekStartIso: toIso(weekStart),
  };
}

export function getAllSchedule(teams) {
  const n = teams.length;
  if (n === 0) return { teams, currentIndex: -1, upcoming: [] };

  const { index: currentIndex, weekStart: currentWeekStart } = computeCurrentSlot(REFERENCE_DATE, n);

  const upcoming = [];
  for (let i = 1; i <= 4; i++) {
    const ws = new Date(currentWeekStart.getTime() + i * MS_PER_WEEK);
    const idx = ((currentIndex + i) % n + n) % n;
    const entry = teams[idx];
    upcoming.push({
      index: idx,
      teamId: entry.id,
      names: [entry.name1, entry.name2],
      dateRange: formatSundayDate(ws),
      weekStartIso: toIso(ws),
    });
  }

  return { teams, currentIndex, upcoming };
}
