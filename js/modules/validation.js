// validation.js — simple helpers
export const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const strongPassword = v => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(v);
export function requireFields(form, names) {
  return names.every(n => form.elements[n] && form.elements[n].value.trim());
}