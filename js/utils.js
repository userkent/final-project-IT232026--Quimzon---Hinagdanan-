/* ==========================================================
   UTILS: small helper functions used everywhere
   ========================================================== */

// Shortcut for document.querySelector
const $ = selector => document.querySelector(selector);

// Escape text so it is safe to place inside HTML
const esc = text => String(text).replace(/[&<>"]/g, ch => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
}[ch]));

// Format a timestamp, e.g. "Nov 27, 3:05 PM"
const formatDate = time => new Date(time).toLocaleString([], {
  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
});