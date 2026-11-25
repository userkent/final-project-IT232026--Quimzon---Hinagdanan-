// ---------- Mobile menu ----------
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  }
});

// ---------- Active nav link on scroll ----------
const links = [...nav.querySelectorAll('a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));

sections.forEach(section => {
  if (!section) return;
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.hash === '#' + section.id));
    }
  }, { rootMargin: '-45% 0px -50% 0px' }).observe(section);
});

// ---------- Run button demo ----------
const runBtn = document.getElementById('runBtn');
const output = document.getElementById('output');
const text = 'Hello, Developer!';

runBtn.addEventListener('click', () => {
  output.textContent = '';
  [...text].forEach((ch, i) => setTimeout(() => (output.textContent += ch), i * 40));
});

// ---------- Animated stat counters ----------
const counters = document.querySelectorAll('[data-count]');
const format = n => (n >= 1000 && n % 1000 === 0 && n >= 10000) ? n / 1000 + 'K' : n;

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count, suffix = el.dataset.suffix || '';
    const start = performance.now(), duration = 1200;
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = format(Math.round(target * p)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  counters.forEach(c => counterObserver.observe(c));
}

// ---------- Login / logout (demo only, saved in this browser) ----------
const loginDialog = document.getElementById('loginDialog');
const infoDialog = document.getElementById('infoDialog');
const userName = document.getElementById('userName');
const toast = document.getElementById('toast');
let user = null;
try { user = JSON.parse(localStorage.getItem('knw-user')); } catch {}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function renderAuth() {
  document.querySelectorAll('[data-auth]').forEach(el => (el.textContent = user ? 'Logout' : 'Login'));
  userName.hidden = !user;
  userName.textContent = user ? '👤 ' + user.name : '';
}

document.querySelectorAll('[data-auth]').forEach(el =>
  el.addEventListener('click', e => {
    e.preventDefault();
    if (user) {
      user = null;
      try { localStorage.removeItem('knw-user'); } catch {}
      renderAuth();
      showToast('You have logged out.');
    } else {
      loginDialog.showModal();
    }
  })
);

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  user = { name: document.getElementById('nameInput').value.trim() || 'Learner' };
  try { localStorage.setItem('knw-user', JSON.stringify(user)); } catch {}
  loginDialog.close();
  e.target.reset();
  renderAuth();
  showToast('Welcome, ' + user.name + '!');
});

document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

document.querySelector('[data-quiz]').addEventListener('click', () => {
  if (user) showToast('Quizzes are coming soon.');
  else { showToast('Please login to take a quiz.'); loginDialog.showModal(); }
});

// ---------- Tap a feature, path or language ----------
document.querySelectorAll('[data-feature], .path, .lang').forEach(el =>
  el.addEventListener('click', e => {
    e.preventDefault();
    const title = el.querySelector('h3')?.textContent ?? el.lastChild.textContent.trim();
    const text = el.querySelector('p')?.textContent ?? 'Lessons, exercises and quizzes for ' + title + '.';
    const extra = document.getElementById('infoExtra');
    document.getElementById('infoTitle').textContent = title;
    document.getElementById('infoText').textContent = text;

    if (el.dataset.feature === 'editor') {
      extra.innerHTML = '<textarea id="ed" rows="5" spellcheck="false">console.log("Hello, World!");</textarea>' +
        '<button class="btn btn-solid btn-sm" id="edRun">Run ▶</button><pre class="edout" id="edOut"></pre>';
      document.getElementById('edRun').onclick = () => {
        const logs = [];
        const fake = { log: (...a) => logs.push(a.join(' ')) };
        try { new Function('console', document.getElementById('ed').value)(fake); }
        catch (err) { logs.push('Error: ' + err.message); }
        document.getElementById('edOut').textContent = logs.join('\n') || '(no output)';
      };
    } else {
      extra.innerHTML = '<p class="hint">' + (user ? 'Lessons for this are coming soon.' : 'Login to save your progress.') + '</p>';
    }
    infoDialog.showModal();
  })
);

// ---------- Show / hide password ----------
const pwInput = document.getElementById('pwInput');
const pwToggle = document.getElementById('pwToggle');
pwToggle.addEventListener('click', () => {
  const show = pwInput.type === 'password';
  pwInput.type = show ? 'text' : 'password';
  pwToggle.textContent = show ? 'Hide' : 'Show';
  pwToggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});

renderAuth();