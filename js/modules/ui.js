// ui.js — theme toggle + role-based UI helpers
import { storage } from "./storage.js";
import { getRole } from "./auth.js";

export function initThemeToggle() {
  const btn = document.querySelector("#themeToggle");
  const saved = storage.get("theme", "light");
  if (saved === "dark") document.documentElement.classList.add("dark");
  btn?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    storage.set("theme", isDark ? "dark" : "light");
  });
}

export function applyRoleControls() {
  const role = getRole();
  document.querySelectorAll("[data-role]").forEach(el => {
    const allow = el.dataset.role.split(",").includes(role);
    if (!allow) {
      el.setAttribute("disabled", "true");
      el.classList.add("opacity-50", "pointer-events-none");
    }
  });
}