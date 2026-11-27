/* ==========================================================
   VIEWS: each function returns the HTML of one page
   ========================================================== */

// Row of filter buttons
const chips = (items, current, action) => items.map(v =>
  `<button class="chip${v === current ? ' on' : ''}" data-act="${action}" data-v="${v}" aria-pressed="${v === current}">${v}</button>`
).join('');

/* ---------- Library helpers ---------- */
function filteredLibrary() {
  const f = libraryFilter;
  return LIBRARY.filter(g =>
    (f.lang === 'All' || g.lang === f.lang) &&
    (f.level === 'All' || g.level === f.level) &&
    (g.title + g.text + g.lang).toLowerCase().includes(f.query.toLowerCase())
  );
}

function libraryCards(list) {
  if (!list.length) return '<p class="empty">No topics match. Try a different word or clear the filters.</p>';
  return list.map(g => `
    <details class="card">
      <summary>${g.title}<br><span class="tag l">${g.lang}</span><span class="tag">${g.level}</span></summary>
      <p>${g.text}</p>
      <pre class="c">${esc(g.code)}</pre>
    </details>`).join('');
}

const solvedCount = () => CHALLENGES.filter(c => state.solved.includes(c.id)).length;

/* ---------- Pages ---------- */
const views = {

  home() {
    const quizzes = state.history.filter(h => h.type === 'Quiz').length;
    return `
    <section class="hero">
      <div>
        <h1>Learn it. Try it. <span class="hl">Know it.</span></h1>
        <p>One place to read coding references, solve short exercises and take quizzes in JavaScript, Python, HTML and CSS. No sign-up needed.</p>
        <div class="cta"><a class="btn p" href="#library">Start learning</a><a class="btn" href="#quiz">Take a quiz</a></div>
      </div>
      <div class="win" aria-hidden="true">
        <div class="tb"><i></i><i></i><i></i><span>hello.js</span></div>
        <pre id="type"></pre>
      </div>
    </section>

    <div class="stats">
      <div class="card"><strong>${LIBRARY.length}</strong><span>reference guides</span></div>
      <div class="card"><strong>${CHALLENGES.length}</strong><span>coding challenges</span></div>
      <div class="card"><strong>${QUIZ_BANK.length}</strong><span>quiz questions</span></div>
      <div class="card"><strong>${quizzes}</strong><span>quizzes you finished</span></div>
    </div>

    <h2>What you can do here</h2>
    <div class="grid">
      <a class="card feat" href="#library"><span class="ico">📚</span><h3>Coding Library</h3><p>Short guides with working examples.</p></a>
      <a class="card feat" href="#practice"><span class="ico">✍️</span><h3>Coding Area</h3><p>Write real code, run it and check your answer.</p></a>
      <a class="card feat" href="#quiz"><span class="ico">🎯</span><h3>Quizzes</h3><p>Pick a language and difficulty level.</p></a>
      <a class="card feat" href="#profile"><span class="ico">📈</span><h3>Your progress</h3><p>See your scores and activity history.</p></a>
    </div>`;
  },

  library() {
    const f = libraryFilter;
    return `
    <h2>Coding Library</h2>
    <div class="tools">
      <input type="search" id="q" placeholder="Search topics, e.g. loops" value="${esc(f.query)}" aria-label="Search library">
      <select id="lv" aria-label="Level">${['All', ...LEVELS].map(v => `<option${v === f.level ? ' selected' : ''}>${v}</option>`).join('')}</select>
    </div>
    <div class="tools">${chips(['All', ...LANGUAGES], f.lang, 'lib')}</div>
    <div class="grid" id="libres">${libraryCards(filteredLibrary())}</div>`;
  },

  practice() {
    const list = CHALLENGES.filter(c => state.lang === 'All' || c.lang === state.lang);
    if (!list.find(c => c.id === currentChallengeId)) currentChallengeId = list[0].id;
    const c = CHALLENGES.find(x => x.id === currentChallengeId);
    const code = codeDrafts[c.id] ?? c.starter;

    return `
    <h2>Practice Coding Area</h2>
    <p style="color:var(--mute)">Write code, run it, then check your answer. Solved ${solvedCount()} of ${CHALLENGES.length}.</p>
    <div class="tools">${chips(['All', ...LANGUAGES], state.lang, 'plang')}</div>

    <div class="lab">
      <div class="clist">${list.map(x => `
        <button class="ci${x.id === currentChallengeId ? ' on' : ''}" data-act="pick" data-v="${x.id}">
          <b>${esc(x.title)}</b>${state.solved.includes(x.id) ? ' ✓' : ''}<br>
          <span class="tag l">${x.lang}</span><span class="tag">${x.level}</span>
        </button>`).join('')}
      </div>

      <div class="card">
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.description)}</p>
        <textarea class="ed" id="ed" spellcheck="false" aria-label="Code editor">${esc(code)}</textarea>
        <small style="color:var(--mute)">Tab inserts spaces. Press Esc, then Tab, to leave the editor.</small>
        <div class="row" style="margin-top:.8rem">
          <button class="btn p s" data-act="run">▶ Run</button>
          ${c.free ? '' : '<button class="btn s" data-act="check">Check answer</button><button class="btn s" data-act="sol">Show solution</button>'}
          <button class="btn s" data-act="rst">Reset</button>
        </div>
        ${c.preview ? `<iframe class="prev" id="pv" sandbox="" title="Live preview" srcdoc="${esc(code)}"></iframe>` : ''}
        <pre class="out" id="out" role="status">Output appears here.</pre>
      </div>
    </div>`;
  },

  quiz() {
    // 1) Picker
    if (!quiz) return `
    <h2>Quiz</h2>
    <div class="card" style="max-width:560px">
      <h3>Language</h3><div class="tools">${chips(LANGUAGES, quizSetup.lang, 'ql')}</div>
      <h3>Difficulty</h3><div class="tools">${chips(LEVELS, quizSetup.level, 'qv')}</div>
      <button class="btn p" data-act="qstart">Start quiz</button>
    </div>`;

    // 2) Result
    if (quiz.i >= quiz.list.length) {
      const pct = Math.round(quiz.score / quiz.list.length * 100);
      const msg = pct >= 80 ? 'Great work!' : pct >= 50 ? 'Good start, review the library and try again.' : 'Read the library guides, then retry.';
      return `
      <div class="card" style="max-width:560px;text-align:center">
        <p>${quiz.lang} · ${quiz.level}</p>
        <div class="big">${pct}%</div>
        <p>You got ${quiz.score} of ${quiz.list.length} correct. ${msg}</p>
        <div class="row" style="justify-content:center">
          <button class="btn p" data-act="qstart">Try again</button>
          <button class="btn" data-act="qnew">Change quiz</button>
        </div>
      </div>`;
    }

    // 3) Question
    const q = quiz.list[quiz.i];
    return `
    <h2>${quiz.lang} quiz <span class="tag">${quiz.level}</span></h2>
    <div class="card" style="max-width:640px">
      <small>Question ${quiz.i + 1} of ${quiz.list.length}</small>
      <div class="prog"><div style="width:${quiz.i / quiz.list.length * 100}%"></div></div>
      <h3>${esc(q.question)}</h3>
      ${q.options.map((o, k) => `<button class="opt" data-act="ans" data-v="${k}">${esc(o)}</button>`).join('')}
      <p class="fb" id="qf" role="status"></p>
    </div>`;
  },

  profile() {
    const quizzes = state.history.filter(h => h.type === 'Quiz');
    const best = quizzes.length ? Math.max(...quizzes.map(h => h.pct)) + '%' : '–';
    const history = state.history.length
      ? `<ul class="h">${state.history.map(h => `
          <li><span><span class="tag l">${h.type}</span> ${esc(h.text)}</span><small>${formatDate(h.time)}</small></li>`).join('')}</ul>`
      : '<p class="empty">Nothing yet. Try a <a href="#quiz">quiz</a> or a <a href="#practice">practice exercise</a>.</p>';

    return `
    <h2>Profile</h2>
    <div class="card" style="margin-bottom:1rem">
      <label for="nm">Display name</label>
      <div class="row"><input type="text" id="nm" value="${esc(state.name)}" maxlength="24"><button class="btn s" data-act="name">Save</button></div>
    </div>
    <div class="stats">
      <div class="card"><strong>${quizzes.length}</strong><span>quizzes taken</span></div>
      <div class="card"><strong>${best}</strong><span>best score</span></div>
      <div class="card"><strong>${solvedCount()}/${CHALLENGES.length}</strong><span>challenges solved</span></div>
    </div>
    <h3>Activity history</h3>
    <div class="card">${history}</div>`;
  },

  settings() {
    const themes = ['system', 'light', 'dark'].map(v =>
      `<button class="chip${state.theme === v ? ' on' : ''}" data-act="theme" data-v="${v}">${v[0].toUpperCase() + v.slice(1)}</button>`).join('');
    const sizes = [[14, 'Small'], [16, 'Medium'], [19, 'Large']].map(([n, label]) =>
      `<button class="chip${state.size === n ? ' on' : ''}" data-act="size" data-v="${n}">${label}</button>`).join('');
    const langs = ['All', ...LANGUAGES].map(v => `<option${v === state.lang ? ' selected' : ''}>${v}</option>`).join('');

    return `
    <h2>Settings</h2>
    <div class="card" style="max-width:640px">
      <div class="set"><span>Theme</span><div class="tools" style="margin:0">${themes}</div></div>
      <div class="set"><span>Text size</span><div class="tools" style="margin:0">${sizes}</div></div>
      <div class="set"><label for="fl">Favorite language</label><select id="fl">${langs}</select></div>
      <div class="set"><span>Reset all progress and settings</span><button class="btn s" data-act="reset">Reset</button></div>
    </div>`;
  }
};