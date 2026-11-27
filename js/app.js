/* ==========================================================
   APP: router, button actions, quiz logic, start-up
   ========================================================== */

/* ---------- Home page typing animation ---------- */
let typingTimer;
function startTyping() {
  const el = $('#type');
  if (!el) return;
  const text = '// Welcome to CDKNOW\nconst goal = "learn to code";\n\nfunction study(topic) {\n  return `Practice ${topic}`;\n}\n\nconsole.log(study(goal));';

  if (matchMedia('(prefers-reduced-motion:reduce)').matches) { el.textContent = text; return; }

  let i = 0;
  clearInterval(typingTimer);
  typingTimer = setInterval(() => {
    if (!document.body.contains(el)) { clearInterval(typingTimer); return; }
    el.innerHTML = esc(text.slice(0, ++i)) + '<span class="cur"></span>';
    if (i >= text.length) clearInterval(typingTimer);
  }, 45);
}

/* ---------- Router (uses the #hash in the URL) ---------- */
const currentPage = () => {
  const name = (location.hash || '#home').slice(1);
  return views[name] ? name : 'home';
};

// Full page change: render + update nav + scroll to top
function route() {
  const page = currentPage();
  const app = $('#app');
  app.className = 'view';
  app.innerHTML = views[page]();
  void app.offsetWidth; // restart the fade-in animation

  document.querySelectorAll('#nav a').forEach(a => {
    const active = a.getAttribute('href') === '#' + page;
    a.classList.toggle('on', active);
    active ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });

  if (page === 'home') startTyping();
  scrollTo(0, 0);
}

// Re-render the current page without scrolling or animation
function redraw() {
  $('#app').innerHTML = views[currentPage()]();
}

/* ---------- Quiz logic ---------- */
function startQuiz() {
  const lang = quiz ? quiz.lang : quizSetup.lang;
  const level = quiz ? quiz.level : quizSetup.level;
  const list = QUIZ_BANK.filter(q => q.lang === lang && q.level === level).sort(() => Math.random() - 0.5);
  quiz = { lang, level, list, i: 0, score: 0 };
  redraw();
}

function answerQuestion(choice) {
  const q = quiz.list[quiz.i];
  const buttons = [...document.querySelectorAll('.opt')];
  const feedback = $('#qf');

  buttons.forEach((b, j) => { b.disabled = true; if (j === q.answer) b.classList.add('ok'); });

  if (choice === q.answer) {
    quiz.score++;
    feedback.className = 'fb ok';
    feedback.textContent = 'Correct!';
  } else {
    buttons[choice].classList.add('bad');
    feedback.className = 'fb bad';
    feedback.textContent = 'Not quite. The right answer is highlighted.';
  }

  const last = quiz.i + 1 >= quiz.list.length;
  feedback.insertAdjacentHTML('afterend',
    `<button class="btn p s" id="nx" data-act="next" style="margin-top:.8rem">${last ? 'See result' : 'Next question'}</button>`);
  $('#nx').focus();
}

function nextQuestion() {
  quiz.i++;
  if (quiz.i >= quiz.list.length) {
    const pct = Math.round(quiz.score / quiz.list.length * 100);
    addHistory('Quiz', `${quiz.lang} (${quiz.level}): ${quiz.score}/${quiz.list.length}`, pct);
  }
  redraw();
}

/* ---------- Button actions (data-act="...") ---------- */
const actions = {
  // Library
  lib(v) { libraryFilter.lang = v; redraw(); },

  // Coding area
  plang(v) { keepDraft(); state.lang = v; saveState(); redraw(); },
  pick(v) { keepDraft(); currentChallengeId = v; redraw(); },
  rst() { codeDrafts[currentChallengeId] = findChallenge().starter; redraw(); },
  sol() { $('#ed').value = findChallenge().solution; keepDraft(); showOutput('Solution loaded. Read it and try to explain each line.'); },
  run: runCode,
  check: checkCode,

  // Quiz
  ql(v) { quizSetup.lang = v; redraw(); },
  qv(v) { quizSetup.level = v; redraw(); },
  qstart: startQuiz,
  qnew() { quiz = null; redraw(); },
  ans(v) { answerQuestion(+v); },
  next: nextQuestion,

  // Profile + settings
  name(v, button) { state.name = $('#nm').value.trim() || 'Learner'; saveState(); button.textContent = 'Saved ✓'; },
  theme(v) { state.theme = v; saveState(); applySettings(); redraw(); },
  size(v) { state.size = +v; saveState(); applySettings(); redraw(); },
  reset() {
    if (!confirm('Reset all progress and settings?')) return;
    resetState();
    libraryFilter.lang = 'All';
    applySettings();
    redraw();
  }
};

/* ---------- Event listeners ---------- */
document.addEventListener('click', e => {
  const button = e.target.closest('[data-act]');
  if (button && actions[button.dataset.act]) actions[button.dataset.act](button.dataset.v, button);
});

// Live library search
document.addEventListener('input', e => {
  if (e.target.id === 'q') {
    libraryFilter.query = e.target.value;
    $('#libres').innerHTML = libraryCards(filteredLibrary());
  }
});

// Dropdowns
document.addEventListener('change', e => {
  if (e.target.id === 'lv') { libraryFilter.level = e.target.value; redraw(); }
  if (e.target.id === 'fl') { state.lang = e.target.value; libraryFilter.lang = state.lang; saveState(); }
});

// Code editor: Tab inserts spaces, Esc lets Tab leave the editor
document.addEventListener('keydown', e => {
  if (e.target.id !== 'ed') return;
  const editor = e.target;
  if (e.key === 'Escape') editor.dataset.free = '1';
  else if (e.key === 'Tab' && !e.shiftKey && !editor.dataset.free) {
    e.preventDefault();
    editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end');
  }
});
document.addEventListener('focusout', e => { if (e.target.id === 'ed') delete e.target.dataset.free; });

/* ---------- Start ---------- */
addEventListener('hashchange', route);
applySettings();
route();