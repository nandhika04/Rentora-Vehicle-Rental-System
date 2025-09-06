// Lightweight natural language-ish parser for vehicle filtering

const fuelKeywords = ['petrol', 'diesel', 'electric', 'hybrid'];
const carTypeKeywords = ['suv', 'sedan', 'hatchback', 'muv', 'luxury'];
const transmissionKeywords = ['automatic', 'manual', 'cvt'];

function extractNumberTokens(tokens) {
  return tokens.map(t => t.replace(/[^0-9]/g, '')).filter(t => t).map(Number);
}

export function parseCarQuery(query) {
  const q = (query || '').toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  const numbers = extractNumberTokens(tokens);

  const has = (kwList) => kwList.find(kw => q.includes(kw));
  const fuel = has(fuelKeywords);
  const type = has(carTypeKeywords);
  const transmission = has(transmissionKeywords);

  let seats = null;
  const seatToken = tokens.find(t => /seat|seats/.test(t));
  if (seatToken && numbers.length) seats = numbers[0];
  else if (numbers.length && !q.includes('between') && !q.includes('under') && !q.includes('over')) seats = numbers[0];

  // price intent
  let minPrice = null, maxPrice = null;
  if (q.includes('under') || q.includes('less than') || q.includes('<')) {
    maxPrice = numbers[numbers.length - 1] || null;
  } else if (q.includes('over') || q.includes('above') || q.includes('>')) {
    minPrice = numbers[numbers.length - 1] || null;
  } else if (q.includes('between')) {
    if (numbers.length >= 2) {
      minPrice = Math.min(numbers[0], numbers[1]);
      maxPrice = Math.max(numbers[0], numbers[1]);
    }
  }

  return { fuel, type, transmission, seats, minPrice, maxPrice };
}

export function carMatches(car, criteria) {
  if (!car) return false;
  const { fuel, type, transmission, seats, minPrice, maxPrice } = criteria;
  if (fuel && String(car.fuel).toLowerCase() !== fuel) return false;
  if (type && String(car.type).toLowerCase() !== type) return false;
  if (transmission && String(car.transmission).toLowerCase() !== transmission) return false;
  if (seats && Number(car.seats) !== Number(seats)) return false;
  const price = Number(car.price) || 0;
  if (minPrice !== null && price < minPrice) return false;
  if (maxPrice !== null && price > maxPrice) return false;
  return true;
}

export function parseBikeQuery(query) {
  const q = (query || '').toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  const numbers = extractNumberTokens(tokens);
  const fuel = fuelKeywords.find(f => q.includes(f));
  let seats = null;
  const seatToken = tokens.find(t => /seat|seats/.test(t));
  if (seatToken && numbers.length) {
    seats = numbers[0];
  } else if (numbers.length && !q.includes('between') && !q.includes('under') && !q.includes('over') && !q.includes('<') && !q.includes('>') && !q.includes('less than') && !q.includes('above') ) {
    // Only infer seats from numbers when no price intent keywords are present
    seats = numbers[0];
  }

  let minPrice = null, maxPrice = null;
  if (q.includes('under') || q.includes('less than') || q.includes('<')) {
    maxPrice = numbers[numbers.length - 1] || null;
  } else if (q.includes('over') || q.includes('above') || q.includes('>')) {
    minPrice = numbers[numbers.length - 1] || null;
  } else if (q.includes('between')) {
    if (numbers.length >= 2) {
      minPrice = Math.min(numbers[0], numbers[1]);
      maxPrice = Math.max(numbers[0], numbers[1]);
    }
  }

  return { fuel, seats, minPrice, maxPrice };
}

export function bikeMatches(bike, criteria) {
  if (!bike) return false;
  const { fuel, seats, minPrice, maxPrice } = criteria;
  if (fuel && String(bike.fuel).toLowerCase() !== fuel) return false;
  if (seats && Number(bike.seats) !== Number(seats)) return false;
  const price = Number(bike.price) || 0;
  if (minPrice !== null && price < minPrice) return false;
  if (maxPrice !== null && price > maxPrice) return false;
  return true;
}


