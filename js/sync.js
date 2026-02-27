const API = 'https://jsonblob.com/api/jsonBlob';
const BLOB_KEY = 'gcse-tracker-blob-id';

export function getBlobId() {
  // Check URL hash first, then localStorage
  const hash = window.location.hash.slice(1);
  if (hash) {
    localStorage.setItem(BLOB_KEY, hash);
    return hash;
  }
  return localStorage.getItem(BLOB_KEY) || '';
}

function storeBlobId(id) {
  localStorage.setItem(BLOB_KEY, id);
  window.location.hash = id;
}

export function hasBlobId() {
  return getBlobId().length > 0;
}

export async function cloudSave(progress) {
  const id = getBlobId();

  if (id) {
    // Update existing blob
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(progress),
    });
    if (!res.ok) throw new Error(`Save failed: ${res.status}`);
  } else {
    // Create new blob
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(progress),
    });
    if (!res.ok) throw new Error(`Create failed: ${res.status}`);
    const location = res.headers.get('Location');
    const newId = location.split('/').pop();
    storeBlobId(newId);
  }
}

export async function cloudLoad() {
  const id = getBlobId();
  if (!id) return null;

  const res = await fetch(`${API}/${id}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Load failed: ${res.status}`);
  return await res.json();
}
