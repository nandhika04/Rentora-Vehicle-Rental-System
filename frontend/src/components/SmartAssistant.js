import React, { useState, useMemo, useEffect, useRef } from 'react';
import '../bike.css';
import { parseCarQuery, carMatches, parseBikeQuery, bikeMatches } from '../utils/smartSearch';

const faqPairs = [
  // Greetings & general
  { k: ['hello', 'hi', 'hey'], a: 'Hi! I can help you find the right vehicle or answer questions about pricing, booking, and policies.' },
  { k: ['help', 'assist', 'support'], a: 'Tell me what you need—vehicle type, seats, fuel, budget, or any policy questions.' },

  // Hours & locations
  { k: ['hours', 'timing', 'open', 'close'], a: 'We operate 24/7 for online bookings. Pickup and drop slots are shown during checkout.' },
  { k: ['location', 'where', 'branch', 'store'], a: 'We offer multiple pickup points across the city. Select your preferred location during booking.' },

  // Documents & eligibility
  { k: ['license', 'driving license', 'dl', 'document', 'id', 'kyc'], a: 'Bring a valid driving license and a government ID. International travelers should carry their passport.' },
  { k: ['age', 'minimum age'], a: 'The minimum age to rent is 18 for bikes and 21 for cars (may vary by location).' },

  // Payments & deposits
  { k: ['payment', 'pay', 'upi', 'card', 'net banking'], a: 'We accept UPI, cards, and net banking. Pay on confirmation to secure your booking.' },
  { k: ['deposit', 'security'], a: 'A refundable security deposit may apply for certain vehicles. It’s shown at checkout and refunded after return checks.' },
  { k: ['refund', 'money back'], a: 'Refunds (including deposit) are typically processed within 3–7 business days to the original payment method.' },

  // Cancellation & reschedule
  { k: ['cancel', 'cancellation'], a: 'Free cancellation up to 24 hours before pickup. Within 24 hours, partial charges may apply.' },
  { k: ['reschedule', 'change time', 'modify booking'], a: 'You can reschedule from your booking details page, subject to availability and any fare difference.' },

  // Pickup/Drop & delivery
  { k: ['delivery', 'home', 'doorstep'], a: 'Doorstep delivery is available in select areas for an extra fee. Enter your address during checkout to check availability.' },
  { k: ['pickup', 'drop', 'return'], a: 'Arrive on time with your documents. Late returns may incur additional hourly charges.' },

  // Fuel, km, fines
  { k: ['fuel policy', 'fuel', 'mileage', 'petrol', 'diesel', 'electric'], a: 'Fuel policy varies by vehicle. Please return the vehicle with similar fuel level to avoid refueling charges.' },
  { k: ['limit', 'kilometer', 'km', 'kms'], a: 'Each booking includes a daily km limit. Extra kilometers are chargeable—rates are shown at checkout.' },
  { k: ['toll', 'fine', 'penalty', 'challan'], a: 'Tolls and government fines are the renter’s responsibility and may be billed after the trip if applicable.' },

  // Insurance & damage
  { k: ['insurance', 'damage', 'protection', 'accident'], a: 'Basic damage protection is included. Enhanced coverage is available at checkout. In case of an incident, contact support immediately.' },
  { k: ['scratch', 'dent', 'inspection', 'check'], a: 'We perform pre- and post-trip inspections. New damage may incur charges per the damage matrix.' },

  // Breakdown & emergency
  { k: ['breakdown', 'emergency', 'roadside'], a: '24/7 roadside assistance is available for mechanical issues. Call the support number in your booking details.' },

  // Cleanliness & rules
  { k: ['clean', 'cleanliness', 'smoking', 'pets'], a: 'Please keep the vehicle clean. Smoking is not allowed. Pets are allowed only in carriers; cleaning fees may apply if returned dirty.' },

  // Extensions & overage
  { k: ['extend', 'extension', 'extra day', 'extra hour'], a: 'You can extend your trip from the booking page subject to availability and revised pricing.' },

  // Bike-specific
  { k: ['helmet', 'helmets'], a: 'One standard helmet is usually provided per bike. Extra helmets may be available on request and subject to charges.' },
  { k: ['gear', 'riding gear'], a: 'Riding gear availability varies by location. Please ask at pickup or contact support in advance.' },

  // Car-specific
  { k: ['child seat', 'booster'], a: 'Child seats may be available as an add-on for select cars. Please check add-ons during checkout.' },
];

function matchFAQ(text) {
  const q = (text || '').toLowerCase();
  for (const { k, a } of faqPairs) {
    if (k.some(token => q.includes(token))) return a;
  }
  return null;
}

function buildVehicleSuggestions(text, items, kind) {
  const parser = kind === 'car' ? parseCarQuery : parseBikeQuery;
  const matcher = kind === 'car' ? carMatches : bikeMatches;
  const base = parser(text);
  const q = (text || '').toLowerCase();

  // Special intent: cheapest / lowest price
  if (q.includes('cheapest') || q.includes('lowest') || q.includes('low price') || q.includes('budget')) {
    const sorted = [...items].sort((a, b) => (Number(a.price) || Infinity) - (Number(b.price) || Infinity));
    return sorted.slice(0, 3);
  }

  let out = items.filter((i) => matcher(i, base));
  if (out.length > 0) return out.slice(0, 5);

  if (base.maxPrice != null) {
    const widened = { ...base, maxPrice: Math.round(base.maxPrice * 1.25) };
    out = items.filter((i) => matcher(i, widened));
    if (out.length > 0) return out.slice(0, 5);
  }

  const noPrice = { ...base, minPrice: null, maxPrice: null };
  out = items.filter((i) => matcher(i, noPrice));
  if (out.length > 0) return out.slice(0, 5);

  // If user asked for "under X" but nothing found, still show the absolute cheapest few
  if (base.maxPrice != null) {
    const sorted = [...items].sort((a, b) => (Number(a.price) || Infinity) - (Number(b.price) || Infinity));
    return sorted.slice(0, 3);
  }

  return [];
}

const SmartAssistant = ({ items, kind, onBook }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', text: 'Hi! Ask me anything or say what you need: “automatic suv under 2000” or “petrol 2 seats”.' }]);
    }
  }, [open]);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;
    const next = [...messages, { role: 'user', text: q }];
    setMessages(next);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let out = [...next];

      // 1) Try FAQ
      const faq = matchFAQ(q);
      if (faq) {
        out.push({ role: 'assistant', text: faq });
        setMessages(out);
        setIsTyping(false);
        return;
      }

      // 2) Try vehicle suggestions
      const suggestions = buildVehicleSuggestions(q, items, kind);
      if (suggestions.length > 0) {
        out.push({ role: 'assistant', text: 'Here are some matches I found:' });
        suggestions.forEach(s => {
          out.push({ role: 'suggestion', item: s });
        });
        setMessages(out);
        setIsTyping(false);
        return;
      }

      // 3) Fallback
      out.push({ role: 'assistant', text: 'I didn’t find an exact answer. Could you rephrase or try different terms?' });
      setMessages(out);
      setIsTyping(false);
    }, 450);
  };

  return (
    <>
      <button className="assistant-fab" onClick={() => setOpen(true)}>
        🤖
      </button>
      {open && (
        <div className="assistant-overlay" onClick={() => setOpen(false)}>
          <div className="assistant-panel" onClick={(e) => e.stopPropagation()}>
            <div className="assistant-header">
              <span>Smart Assistant</span>
              <button className="assistant-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="assistant-chat" ref={scrollerRef}>
              {messages.map((m, idx) => (
                m.role === 'suggestion' ? (
                  <div key={idx} className="assistant-result-card">
                    <img src={m.item.image} alt={m.item.name} />
                    <div className="assistant-result-info">
                      <div className="assistant-result-title">{m.item.name}</div>
                      <div className="assistant-result-sub">₹{m.item.price}/day</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => onBook(m.item)}>Book</button>
                  </div>
                ) : (
                  <div key={idx} className={`assistant-row ${m.role}`}>
                    <div className="assistant-avatar">{m.role === 'assistant' ? '🤖' : '🧑'}</div>
                    <div className={`assistant-bubble ${m.role}`}>{m.text}</div>
                  </div>
                )
              ))}
              {isTyping && (
                <div className="assistant-row assistant">
                  <div className="assistant-avatar">🤖</div>
                  <div className="assistant-bubble assistant typing">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="assistant-input-row">
              <input
                type="text"
                className="assistant-input"
                placeholder={kind === 'car' ? 'Ask anything… e.g., automatic suv under 2000' : 'Ask anything… e.g., petrol 2 seats'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' ? handleSend() : null}
              />
              <button className="btn btn-primary" onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartAssistant;


