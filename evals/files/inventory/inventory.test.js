const test = require('node:test');
const assert = require('node:assert');
const inv = require('./inventory');

test.beforeEach(() => inv._reset());

test('reserve succeeds when stock is available', async () => {
  inv.addStock('A', 5);
  assert.equal(await inv.reserve('A', 3), true);
  assert.equal(inv.available('A'), 2);
});

test('reserve fails when not enough stock', async () => {
  inv.addStock('A', 2);
  assert.equal(await inv.reserve('A', 3), false);
  assert.equal(inv.available('A'), 2);
});

test('release returns stock', async () => {
  inv.addStock('A', 5);
  await inv.reserve('A', 3);
  await inv.release('A', 3);
  assert.equal(inv.available('A'), 5);
});
