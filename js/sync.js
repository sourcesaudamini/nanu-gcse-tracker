const SYNC_URL_KEY = 'gcse-tracker-sync-url';

export function getSyncUrl() {
  return localStorage.getItem(SYNC_URL_KEY) || '';
}

export function setSyncUrl(url) {
  // Ensure trailing slash removed, add .json path
  localStorage.setItem(SYNC_URL_KEY, url.replace(/\/+$/, ''));
}

export function clearSyncUrl() {
  localStorage.removeItem(SYNC_URL_KEY);
}

export function isSyncEnabled() {
  return getSyncUrl().length > 0;
}

export async function cloudSave(progress) {
  const base = getSyncUrl();
  if (!base) return;

  const res = await fetch(`${base}/progress.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(progress),
  });

  if (!res.ok) throw new Error(`Sync save failed: ${res.status}`);
}

export async function cloudLoad() {
  const base = getSyncUrl();
  if (!base) return null;

  const res = await fetch(`${base}/progress.json`);
  if (!res.ok) throw new Error(`Sync load failed: ${res.status}`);

  const data = await res.json();
  return data || {};
}
