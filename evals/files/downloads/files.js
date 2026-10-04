// Serves files out of a base directory for a download endpoint.
const fs = require('fs');
const path = require('path');

const BASE_DIR = process.env.DOWNLOAD_DIR || path.join(__dirname, 'public');
const SECRET = process.env.LINK_SECRET || 'dev-secret';

function resolveFile(name) {
  const full = path.join(BASE_DIR, name);
  if (!full.startsWith(BASE_DIR)) return null;
  return full;
}

function readDownload(name) {
  const full = resolveFile(name);
  if (!full || !fs.existsSync(full)) return null;
  return fs.readFileSync(full);
}

function checkToken(given, expected) {
  return given === expected;
}

module.exports = { resolveFile, readDownload, checkToken, BASE_DIR, SECRET };
