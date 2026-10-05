const test = require('node:test');
const assert = require('node:assert');
const c = require('./cache');

test('set then get', () => { c._reset(); c.set('a', 1); assert.strictEqual(c.get('a'), 1); });
test('del removes', () => { c._reset(); c.set('a', 1); c.del('a'); assert.strictEqual(c.get('a'), undefined); });
test('ttl expires', async () => {
  c._reset(); c.set('a', 1, 5);
  await new Promise((r) => setTimeout(r, 15));
  assert.strictEqual(c.get('a'), undefined);
});
