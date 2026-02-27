const STORAGE_KEY = 'gcse-tracker-progress';

export function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

export function toggleTopic(subjectId, topicId) {
  const data = loadProgress();
  if (!data[subjectId]) {
    data[subjectId] = {};
  }

  if (data[subjectId][topicId]) {
    delete data[subjectId][topicId];
    // Clean up empty subject objects
    if (Object.keys(data[subjectId]).length === 0) {
      delete data[subjectId];
    }
    saveProgress(data);
    return false;
  } else {
    data[subjectId][topicId] = true;
    saveProgress(data);
    return true;
  }
}

export function exportJSON() {
  return JSON.stringify(loadProgress());
}

export function importJSON(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    throw new Error('Invalid JSON string');
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('JSON must be an object');
  }

  saveProgress(parsed);
}
