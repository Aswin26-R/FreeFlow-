// api.js — stubbed service; swap with real backend later
export const api = {
  async get(url) {
    // Placeholder: replace with fetch(url)
    return { ok: true, data: [] };
  },
  async post(url, body) {
    // Placeholder
    return { ok: true, id: crypto.randomUUID(), ...body };
  }
};