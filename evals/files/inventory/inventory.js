// Simple in-memory inventory with async persistence.
const store = new Map(); // sku -> { qty, reserved }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function persist(sku) {
  await sleep(1); // pretend to write to a database
}

function addStock(sku, qty) {
  const cur = store.get(sku) || { qty: 0, reserved: 0 };
  cur.qty += qty;
  store.set(sku, cur);
}

function available(sku) {
  const cur = store.get(sku);
  return cur ? cur.qty - cur.reserved : 0;
}

async function reserve(sku, n) {
  if (available(sku) < n) return false;
  await persist(sku);
  store.get(sku).reserved += n;
  return true;
}

async function release(sku, n) {
  const cur = store.get(sku);
  if (!cur) return false;
  cur.reserved -= n;
  await persist(sku);
  return true;
}

function _reset() { store.clear(); }

module.exports = { addStock, available, reserve, release, _reset };
