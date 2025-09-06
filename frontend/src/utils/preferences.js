// Simple localStorage-based preference tracking and scoring

const STORAGE_KEY = 'rentora_prefs_v1';

export function getPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function updatePreferences(update) {
  const prefs = getPreferences();
  const next = { ...prefs };
  Object.entries(update).forEach(([key, value]) => {
    if (!value) return;
    const bucket = (next[key] ||= {});
    const v = String(value);
    bucket[v] = (bucket[v] || 0) + 1;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function pickTop(prefsBucket) {
  if (!prefsBucket) return null;
  return Object.entries(prefsBucket).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

export function getTopSignals() {
  const p = getPreferences();
  return {
    fuel: pickTop(p.fuel),
    transmission: pickTop(p.transmission),
    type: pickTop(p.type),
    seats: pickTop(p.seats),
  };
}

export function scoreCar(car) {
  const signals = getTopSignals();
  let score = 0;
  if (signals.fuel && car.fuel === signals.fuel) score += 3;
  if (signals.transmission && car.transmission === signals.transmission) score += 3;
  if (signals.type && car.type === signals.type) score += 2;
  if (signals.seats && String(car.seats) === String(signals.seats)) score += 1;
  return score;
}

export function scoreBike(bike) {
  const signals = getTopSignals();
  let score = 0;
  if (signals.fuel && bike.fuel === signals.fuel) score += 2;
  if (signals.seats && String(bike.seats) === String(signals.seats)) score += 1;
  return score;
}


