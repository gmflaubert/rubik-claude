const test = require('node:test');
const assert = require('node:assert');
const { escapeCell, toCsv } = require('./csv');

test('plain cell is unchanged', () => assert.strictEqual(escapeCell('abc'), 'abc'));
test('comma cell is quoted', () => assert.strictEqual(escapeCell('a,b'), '"a,b"'));
test('toCsv writes header and rows', () => {
  assert.strictEqual(toCsv([{ a: 1, b: 'x' }], ['a', 'b']), 'a,b\n1,x');
});
