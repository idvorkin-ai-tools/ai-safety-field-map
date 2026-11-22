// evals/metr.html#the-time-horizon-metric maths: project METR's 50% time horizon forward. No DOM.
// Inputs printed on the page: doubling about every 7 months; GPT-5 at ~2h17m against a
// 40-hour concern threshold (Technical AI Safety 3.4). A straight-line extrapolation, not a forecast.
(function (root) {
  var START_H = 2 + 17 / 60, DOUBLING_MO = 7, THRESHOLD_H = 40;
  function horizonAt(h0, months, doubling) { return h0 * Math.pow(2, months / doubling); }
  function monthsToReach(h0, target, doubling) {
    if (!(h0 > 0) || !(doubling > 0)) return null;
    return target <= h0 ? 0 : doubling * Math.log2(target / h0);
  }
  // 2.2833 -> "2h17m"; 40 -> "40h"; 1234 -> "1,234h"
  function fmtHours(h) {
    if (h === null || !isFinite(h)) return '—';
    if (h < 1) return Math.round(h * 60) + 'm';
    if (h < 100) { var t = Math.round(h * 60), hh = Math.floor(t / 60), mm = t % 60; return hh + 'h' + (mm ? (mm < 10 ? '0' : '') + mm + 'm' : ''); }
    return Math.round(h).toLocaleString('en-US') + 'h';
  }
  var api = { START_H: START_H, DOUBLING_MO: DOUBLING_MO, THRESHOLD_H: THRESHOLD_H, horizonAt: horizonAt, monthsToReach: monthsToReach, fmtHours: fmtHours };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.AISafetyLab = root.AISafetyLab || {}).metr = api;
})(this);
