/* ==========================================================
   STATE: saved data (LocalStorage) and temporary page state
   ========================================================== */

const STORAGE_KEY = 'cdknow';

/* ---------- Saved data (kept in this browser) ---------- */
const defaultState = () => ({
  theme: 'system',   // system | light | dark
  size: 16,          // text size in px
  lang: 'All',       // favorite language filter
  name: 'Learner',
  history: [],       // activity history: { time, type, text, pct }
  solved: []         // ids of solved challenges
});

let state = defaultState();

function loadState() {
  try { Object.assign(state, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); } catch (e) {}
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

function resetState() {
  state = defaultState();
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

// Apply theme and text size to the page
function applySettings() {
  const root = document.documentElement;
  if (state.theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', state.theme);
  root.style.fontSize = state.size + 'px';
}

// Add an entry to the activity history
function addHistory(type, text, pct) {
  state.history.unshift({ time: Date.now(), type, text, pct });
  state.history = state.history.slice(0, 40);
  saveState();
}

loadState();

/* ---------- Temporary state (lost on refresh) ---------- */
let currentChallengeId = null;                              // selected challenge in Coding Area
let codeDrafts = {};                                        // unsaved code per challenge
let quiz = null;                                            // running quiz { lang, level, list, i, score }
let quizSetup = { lang: 'JavaScript', level: 'Beginner' };  // quiz picker choices
let libraryFilter = { query: '', lang: state.lang, level: 'All' };