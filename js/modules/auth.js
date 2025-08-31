// auth.js — mock auth with role persistence
import { storage } from "./storage.js";

export function getRole() { return storage.get("role", "freelancer"); }
export function setRole(role) { storage.set("role", role); }
export function isAuthorized(requiredRoles=[]) {
  if (!requiredRoles.length) return true;
  return requiredRoles.includes(getRole());
}