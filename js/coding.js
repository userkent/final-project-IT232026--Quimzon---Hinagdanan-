/* ==========================================================
   CODING AREA: run code, check answers, show output
   ========================================================== */

const findChallenge = () => CHALLENGES.find(c => c.id === currentChallengeId);

// Remember what the user typed (so switching challenges does not lose it)
function keepDraft() {
  const editor = $('#ed');
  if (editor && currentChallengeId) codeDrafts[currentChallengeId] = editor.value;
}

// Show text in the output box. ok: true = green, false = red, undefined = neutral
function showOutput(text, ok) {
  const box = $('#out');
  box.textContent = text;
  box.className = 'out' + (ok === true ? ' ok' : ok === false ? ' bad' : '');
}

// Run JavaScript and capture console.log output
function executeJS(code, extra = '') {
  const logs = [];
  const fakeConsole = {
    log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
  };
  try {
    const result = new Function('console', code + extra)(fakeConsole);
    return { logs, error: null, result };
  } catch (e) {
    return { logs, error: e.message, result: null };
  }
}

// "Run" button
function runCode() {
  const c = findChallenge();
  const code = $('#ed').value;
  keepDraft();

  if (c.preview) { $('#pv').srcdoc = code; showOutput('Preview updated.'); return; }
  if (c.lang === 'Python') {
    showOutput('Python can’t run in the browser here. Press Check answer to see if your code meets the task.');
    return;
  }
  const r = executeJS(code);
  const text = r.logs.join('\n') + (r.error ? '\nError: ' + r.error : '');
  showOutput(text || 'Ran with no output. Use console.log() to print something.', r.error ? false : undefined);
}

// "Check answer" button
function checkCode() {
  const c = findChallenge();
  const code = $('#ed').value;
  keepDraft();
  let passed = false, message = '';

  if (c.tests) {
    // JavaScript: call the user's function with each test case
    const r = executeJS(code, `\n;return typeof ${c.fn}==="function"?${c.fn}:null`);
    if (r.error) message = 'Error: ' + r.error;
    else if (!r.result) message = 'Define a function named ' + c.fn + '.';
    else {
      const results = c.tests.map(([args, expected]) => {
        try {
          const got = r.result(...args);
          return { ok: JSON.stringify(got) === JSON.stringify(expected), args, expected, got };
        } catch (e) {
          return { ok: false, args, expected, got: e.message };
        }
      });
      passed = results.every(t => t.ok);
      message = results.map(t =>
        (t.ok ? '✓ ' : '✗ ') + c.fn + '(' + t.args.map(a => JSON.stringify(a)).join(', ') + ') should give ' +
        JSON.stringify(t.expected) + (t.ok ? '' : ', got ' + JSON.stringify(t.got))
      ).join('\n');
    }
  } else {
    // Python / HTML / CSS: look for required patterns
    passed = c.checks.every(([regex]) => regex.test(code));
    message = c.checks.map(([regex, label]) => (regex.test(code) ? '✓ ' : '✗ ') + label).join('\n');
  }

  if (c.preview) $('#pv').srcdoc = code;

  if (passed) {
    message += '\n\nSolved! 🎉';
    if (!state.solved.includes(c.id)) {
      state.solved.push(c.id);
      addHistory('Practice', 'Solved: ' + c.title);
    }
  } else {
    message += '\n\nNot there yet. Fix the ✗ items and check again.';
  }
  showOutput(message, passed);
}