// Live demo: runs the 3 tests against the code in the editor
(function () {
  const tests = [[[2, 3], 5], [[-1, 1], 0], [[10, 5], 15]];
  const out = document.getElementById('out');
  const show = (text, ok) => { out.textContent = text; out.className = 'out' + (ok === true ? ' ok' : ok === false ? ' bad' : ''); };

  document.getElementById('check').addEventListener('click', () => {
    let fn;
    try { fn = new Function(document.getElementById('code').value + '\n;return typeof add==="function"?add:null')(); }
    catch (e) { return show('Error: ' + e.message, false); }
    if (!fn) return show('Define a function named add.', false);

    let all = true;
    const lines = tests.map(([args, expected]) => {
      let got; try { got = fn(...args); } catch (e) { got = e.message; }
      const ok = got === expected; if (!ok) all = false;
      return (ok ? '✓ ' : '✗ ') + 'add(' + args.join(', ') + ') should give ' + expected + (ok ? '' : ', got ' + got);
    });
    show(lines.join('\n') + '\n\n' + (all ? 'Solved! 🎉 Every challenge in the app works like this.' : 'Not there yet. Fix the ✗ items and check again.'), all);
  });
})();