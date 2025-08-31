// charts.js — Chart.js dashboard
import { storage } from "./storage.js";

export function initDashboard() {
  const invoices = storage.get("invoices", []);
  const ctx1 = document.getElementById("invoicesByMonth");
  if (ctx1 && window.Chart) {
    const byMonth = Array.from({length:12}, (_,i)=>({m:i+1,total:0}));
    invoices.forEach(inv=>{ const m = new Date(inv.date).getMonth(); byMonth[m].total += inv.total; });
    new Chart(ctx1, {
      type: "line",
      data: { labels: byMonth.map(x=>x.m), datasets: [{ label: "Invoice Total", data: byMonth.map(x=>x.total) }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}