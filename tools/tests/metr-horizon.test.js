// node --test tools/tests/  — evals/metr.html projection.
const test = require('node:test');
const assert = require('node:assert');
const L = require('../../lab/metr-horizon.js');
const near = (got, want, tol = 0.01) => assert.ok(Math.abs(got - want) <= tol, `got ${got}, want ${want}`);

test('starts at the printed GPT-5 horizon, 2h17m', () => {
  assert.equal(L.fmtHours(L.horizonAt(L.START_H, 0, L.DOUBLING_MO)), '2h17m');
});
test('one 7-month doubling gives 4h34m', () => {
  assert.equal(L.fmtHours(L.horizonAt(L.START_H, 7, 7)), '4h34m');
});
test('40 hours is about 4.13 doublings, ~28.9 months at 7 months each', () => {
  near(L.monthsToReach(L.START_H, 40, 7), 28.92, 0.01);
  near(L.horizonAt(L.START_H, L.monthsToReach(L.START_H, 40, 7), 7), 40, 1e-9);
  assert.equal(L.monthsToReach(L.START_H, 1, 7), 0);
  assert.equal(L.monthsToReach(L.START_H, 40, 0), null);
});
test('formats', () => {
  assert.equal(L.fmtHours(40), '40h');
  assert.equal(L.fmtHours(1234.4), '1,234h');
  assert.equal(L.fmtHours(NaN), '—');
});
