// Tiny CSV writer used by the admin exports.
function escapeCell(v) {
  const s = String(v);
  return s.includes(',') ? '"' + s + '"' : s;
}

function toCsv(rows, cols) {
  const header = cols.join(',');
  const lines = rows.map((r) => cols.map((c) => escapeCell(r[c])).join(','));
  return [header, ...lines].join('\n');
}

module.exports = { escapeCell, toCsv };
