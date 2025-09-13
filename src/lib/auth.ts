export const TOKEN_KEY = 'token';

export function loadToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function saveToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}
export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
}
