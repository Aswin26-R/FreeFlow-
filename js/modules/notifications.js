// notifications.js — toast + Web Notifications API
let toastHost;
export function toast(msg, type="info") {
  if (!toastHost) {
    toastHost = document.createElement("div");
    toastHost.className = "fixed z-50 bottom-4 right-4 space-y-2";
    document.body.appendChild(toastHost);
  }
  const el = document.createElement("div");
  el.className = `px-4 py-2 rounded-xl shadow-xl ${type==='error'?'bg-red-600 text-white': type==='success'?'bg-emerald-600 text-white':'bg-slate-800 text-white'}`;
  el.textContent = msg;
  toastHost.appendChild(el);
  setTimeout(()=> el.remove(), 3500);
}

export async function remind(title, options={}) {
  if (!("Notification" in window)) return toast("Notifications not supported", "error");
  let perm = Notification.permission;
  if (perm !== "granted") perm = await Notification.requestPermission();
  if (perm === "granted") new Notification(title, options);
  else toast("Notification permission denied", "error");
}