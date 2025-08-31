// export.js — CSV export and print-PDF support
export function tableToCSV(tableSelector, filename="export.csv") {
  const rows = [...document.querySelectorAll(`${tableSelector} tr`)].map(tr =>
    [...tr.children].map(td => '"' + (td.innerText ?? '').replace(/"/g,'""') + '"').join(",")
  ).join("\n");
  const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
}