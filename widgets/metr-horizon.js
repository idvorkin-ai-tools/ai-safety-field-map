// evals/metr.html#the-time-horizon-metric: project the 50% time horizon forward.
// Maths in lab/metr-horizon.js (tested in tools/tests/metr-horizon.test.js).
(function () {
  var H = window.AIToolsWidgets, L = window.AISafetyLab && window.AISafetyLab.metr;
  if (!H || !L) return;
  var W0 = 360, X0 = 44, X1 = 344, Y0 = 18, Y1 = 158, MAXMO = 48, LOG_LO = 0, LOG_HI = 3; // 1h .. 1000h
  function x(mo) { return X0 + (X1 - X0) * mo / MAXMO; }
  function y(h) { var v = Math.log10(Math.max(h, 1)); v = Math.min(Math.max(v, LOG_LO), LOG_HI); return Y1 - (Y1 - Y0) * (v - LOG_LO) / (LOG_HI - LOG_LO); }
  H.register('metr-horizon', function (el) {
    var p = 'mh' + H.uid();
    el.innerHTML = H.presets([['now', 'The GPT-5 measurement'], ['one', 'One doubling'], ['cross', 'Reaches 40 hours']]) +
      '<div class="lab-ctl">' + H.slider(p + '-m', 'Months after the GPT-5 measurement', 0, MAXMO, 1, 12) +
      H.slider(p + '-d', 'Doubling time in months (the page says about 7)', 4, 12, 1, L.DOUBLING_MO) + '</div>' +
      '<svg viewBox="0 0 ' + W0 + ' 186" role="img" aria-labelledby="' + p + '-sum"><g id="' + p + '-g"></g></svg>' +
      '<div class="statgrid">' + H.stat('projected horizon', p + '-h') + H.stat('share of 40 hours', p + '-r') + H.stat('months to 40 hours', p + '-c') + '</div>' +
      H.sum(p + '-sum') + '<p class="lab-note">A straight-line extrapolation of a trend on METR\'s own task suite, as the page warns, not a forecast.</p>';
    var m = H.$(el, p + '-m'), d = H.$(el, p + '-d');
    function draw() {
      var mo = +m.value, dbl = +d.value, h = L.horizonAt(L.START_H, mo, dbl), cross = L.monthsToReach(L.START_H, L.THRESHOLD_H, dbl);
      H.$(el, p + '-m-o').textContent = mo + ' mo';
      H.$(el, p + '-d-o').textContent = dbl + ' mo';
      var g = '';
      [1, 10, 100, 1000].forEach(function (t) { g += '<line class="lab-grid" x1="' + X0 + '" x2="' + X1 + '" y1="' + y(t) + '" y2="' + y(t) + '"/>' + H.t(X0 - 6, y(t) + 3, L.fmtHours(t), 'lab-ax', 'text-anchor="end"'); });
      [0, 12, 24, 36, 48].forEach(function (t) { g += H.t(x(t), Y1 + 14, t + ' mo', 'lab-ax', 'text-anchor="middle"'); });
      g += '<line class="lab-thr" x1="' + X0 + '" x2="' + X1 + '" y1="' + y(40) + '" y2="' + y(40) + '"/>' + H.t(X1, y(40) - 4, '40h concern threshold', 'lab-ax lab-ax-off', 'text-anchor="end"');
      var pts = []; for (var k = 0; k <= MAXMO; k++) pts.push(x(k).toFixed(1) + ',' + y(L.horizonAt(L.START_H, k, dbl)).toFixed(1));
      g += '<polyline class="lab-line" points="' + pts.join(' ') + '"/>';
      if (cross !== null && cross <= MAXMO) g += '<line class="lab-grid lab-cross" x1="' + x(cross) + '" x2="' + x(cross) + '" y1="' + Y0 + '" y2="' + Y1 + '"/>';
      g += '<circle class="lab-dot" cx="' + x(mo) + '" cy="' + y(h) + '" r="4.5"/>';
      g += H.t(X0, Y1 + 28, 'months after GPT-5 · hours on a log scale', 'lab-ax');
      H.$(el, p + '-g').innerHTML = g;
      H.$(el, p + '-h').textContent = L.fmtHours(h);
      H.$(el, p + '-r').textContent = H.pct(h / L.THRESHOLD_H);
      H.$(el, p + '-c').textContent = cross === null ? '—' : cross.toFixed(1);
      H.$(el, p + '-sum').textContent = 'If the horizon kept doubling every ' + dbl + ' months, ' + mo + ' months after GPT-5\'s 2h17m it would be ' + L.fmtHours(h) +
        (h >= L.THRESHOLD_H ? ', past' : ', under') + ' the 40-hour threshold, which this trend line crosses after ' + cross.toFixed(1) + ' months.';
    }
    function preset(k) {
      var dbl = +d.value;
      m.value = k === 'now' ? 0 : k === 'one' ? dbl : Math.min(MAXMO, Math.ceil(L.monthsToReach(L.START_H, L.THRESHOLD_H, dbl)));
      draw();
    }
    el.labPreset = preset;
    el.querySelectorAll('.lab-pre [data-p]').forEach(function (b) { b.addEventListener('click', function () { preset(b.getAttribute('data-p')); }); });
    m.addEventListener('input', draw); d.addEventListener('input', draw);
    draw();
  });
})();
