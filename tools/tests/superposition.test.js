// node --test tools/tests/  — interp/superposition.html toy runs.
// The page claims: dense features get dedicated orthogonal dimensions (no superposition);
// past a sparsity threshold the model packs more features than dimensions, e.g. in antipodal pairs.
const test = require('node:test');
const assert = require('node:assert');
const runs = require('../../lab/superposition-data.js');
const L = require('../../lab/superposition.js');
const at = S => runs.find(r => r.S === S).W;

test('seven sparsity levels, 5x20 weights each', () => {
  assert.deepEqual(runs.map(r => r.S), [0, 0.7, 0.9, 0.97, 0.99, 0.997, 0.999]);
  runs.forEach(r => assert.equal(r.W.length, 100));
});
test('dense: exactly 5 features, one per dimension, no interference', () => {
  const W = at(0);
  assert.equal(L.represented(W), 5);
  const g = L.gram(W), n = L.norms(W);
  for (let i = 0; i < 20; i++) for (let k = 0; k < 20; k++)
    if (i !== k && n[i] > 0.5 && n[k] > 0.5) assert.ok(Math.abs(g[i][k]) < 0.05, `g[${i}][${k}] = ${g[i][k]}`);
  assert.equal(L.antipodalPairs(W), 0);
});
test('sparse: more features than dimensions, packed as antipodal pairs', () => {
  assert.equal(L.represented(at(0.9)), 10);
  assert.equal(L.antipodalPairs(at(0.9)), 5);
  assert.ok(L.represented(at(0.999)) > 10);
});
test('represented features never shrink as sparsity rises', () => {
  const c = runs.map(r => L.represented(r.W));
  for (let i = 1; i < c.length; i++) assert.ok(c[i] >= c[i - 1], c.join(','));
});
