// ─── LocalStorage Database Layer ─────────────────────────────────────────────
// A typed, generic localStorage wrapper for client-side persistence.

const PREFIX = 'athletix_';

function getKey(collection: string): string {
  return `${PREFIX}${collection}`;
}

export function dbGet<T>(collection: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getKey(collection));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function dbSet<T>(collection: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getKey(collection), JSON.stringify(data));
  } catch (e) {
    console.error(`[db] Failed to write ${collection}:`, e);
  }
}

export function dbInsert<T extends { id: string }>(collection: string, item: T): T {
  const items = dbGet<T>(collection);
  items.push(item);
  dbSet(collection, items);
  return item;
}

export function dbFindById<T extends { id: string }>(collection: string, id: string): T | null {
  const items = dbGet<T>(collection);
  return items.find(item => item.id === id) || null;
}

export function dbFindOne<T>(collection: string, predicate: (item: T) => boolean): T | null {
  const items = dbGet<T>(collection);
  return items.find(predicate) || null;
}

export function dbFilter<T>(collection: string, predicate: (item: T) => boolean): T[] {
  const items = dbGet<T>(collection);
  return items.filter(predicate);
}

export function dbUpdate<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): T | null {
  const items = dbGet<T>(collection);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  dbSet(collection, items);
  return items[index];
}

export function dbDelete<T extends { id: string }>(collection: string, id: string): boolean {
  const items = dbGet<T>(collection);
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  dbSet(collection, filtered);
  return true;
}

// ─── Single-value store (for session, preferences, etc.) ─────────────────────

export function dbGetValue<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function dbSetValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`[db] Failed to write ${key}:`, e);
  }
}

export function dbRemoveValue(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${PREFIX}${key}`);
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function hashPassword(password: string): string {
  // Simple hash for localStorage demo. In production, use bcrypt on a server.
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit int
  }
  // Add salt-like prefix to make it non-trivial
  return `$ath$${Math.abs(hash).toString(36)}$${password.length}`;
}

export function verifyPassword(password: string, hashed: string): boolean {
  return hashPassword(password) === hashed;
}
