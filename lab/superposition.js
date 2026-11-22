// interp/superposition.html#why-it-happens maths: read the precomputed toy runs. No DOM.
// W is 5x20 row-major (lab/superposition-data.js). Feature i's direction is column i.
(function (root) {
  var N = 20, M = 5;
  function col(W, i) { var c = []; for (var j = 0; j < M; j++) c.push(W[j * N + i]); return c; }
  function dot(a, b) { var s = 0; for (var j = 0; j < a.length; j++) s += a[j] * b[j]; return s; }
  // Gram matrix W^T W: entry [i][k] is how much feature k leaks into feature i's read-out.
  function gram(W) { var g = []; for (var i = 0; i < N; i++) { g.push([]); for (var k = 0; k < N; k++) g[i].push(dot(col(W, i), col(W, k))); } return g; }
  function norms(W) { var n = []; for (var i = 0; i < N; i++) n.push(Math.sqrt(dot(col(W, i), col(W, i)))); return n; }
  // Elhage et al.'s superposition measure: sum over other features of (unit W_i . W_k)^2.
  function interference(W) {
    var n = norms(W), out = [];
    for (var i = 0; i < N; i++) { var s = 0; for (var k = 0; k < N; k++) if (k !== i && n[i] > 0) s += Math.pow(dot(col(W, i), col(W, k)) / n[i], 2); out.push(s); }
    return out;
  }
  function represented(W, thr) { return norms(W).filter(function (v) { return v > (thr || 0.5); }).length; }
  // Pairs of represented features pointing in nearly opposite directions (cosine < -0.8).
  function antipodalPairs(W) {
    var n = norms(W), c = 0;
    for (var i = 0; i < N; i++) for (var k = i + 1; k < N; k++) if (n[i] > 0.5 && n[k] > 0.5 && dot(col(W, i), col(W, k)) / (n[i] * n[k]) < -0.8) c++;
    return c;
  }
  var api = { N: N, M: M, gram: gram, norms: norms, interference: interference, represented: represented, antipodalPairs: antipodalPairs };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.AISafetyLab = root.AISafetyLab || {}).superposition = api;
})(this);
