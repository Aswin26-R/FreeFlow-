// storage.js — thin wrapper over localStorage with namespacing
const NS = "freeflowcrm:";
export const storage = {
  get(key, fallback=null) {
    try { const v = localStorage.getItem(NS+key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(NS+key, JSON.stringify(value)); },
  remove(key) { localStorage.removeItem(NS+key); }
};

// seed demo data if not present
export function seedDemo() {
  if (!storage.get("clients")) {
    storage.set("clients", [
      { id: "c1", name: "Acme Corp", email: "ops@acme.com", phone: "+1 555-1001" },
      { id: "c2", name: "Zen Labs", email: "hello@zenlabs.io", phone: "+1 555-1002" },
    ]);
  }
  if (!storage.get("invoices")) {
    storage.set("invoices", [
      { id: "inv-001", clientId: "c1", status: "paid", total: 1200, date: "2025-07-15" },
      { id: "inv-002", clientId: "c2", status: "pending", total: 800, date: "2025-08-02" },
    ]);
  }
  if (!storage.get("role")) storage.set("role", "freelancer");
}