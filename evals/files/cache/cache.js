// In-memory cache with optional TTL.
const store = new Map(); // key -> { value, expires }

function set(key, value, ttlMs = 0) {
  store.set(key, { value, expires: ttlMs ? Date.now() + ttlMs : Infinity });
}

function get(key) {
  const e = store.get(key);
  if (!e) return undefined;
  if (e.expires < Date.now()) {
    store.delete(key);
    return undefined;
  }
  return e.value;
}

function del(key) { store.delete(key); }
function _reset() { store.clear(); }

module.exports = { set, get, del, _reset };
