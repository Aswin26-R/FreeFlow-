// app.js — common boot: theme+role, seed data, pwa
import { seedDemo } from "./modules/storage.js";
import { initThemeToggle, applyRoleControls } from "./modules/ui.js";

seedDemo();
initThemeToggle();
applyRoleControls();

// register service worker (PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").catch(()=>{});
}