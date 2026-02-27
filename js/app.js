import { subjects } from './data.js';
import { loadProgress, toggleTopic, exportJSON, importJSON, clearProgress } from './storage.js';
import { getSubjectProgress, getTotalProgress } from './progress.js';

// --- DOM refs ---
const app = document.getElementById('app');
const totalPct = document.getElementById('total-pct');
const totalBar = document.getElementById('total-bar');
const btnSave = document.getElementById('btn-save');
const btnExport = document.getElementById('btn-export');
const btnImport = document.getElementById('btn-import');
const btnClear = document.getElementById('btn-clear');
const fileInput = document.getElementById('file-input');
const overlay = document.getElementById('overlay');
const overlaySubject = document.getElementById('overlay-subject');
const btnDismiss = document.getElementById('btn-dismiss');
const syncStatus = document.getElementById('sync-status');

// --- Status flash ---
function flashStatus(text) {
  syncStatus.textContent = text;
  syncStatus.classList.add('visible');
  clearTimeout(syncStatus._timer);
  syncStatus._timer = setTimeout(() => {
    syncStatus.classList.remove('visible');
  }, 2000);
}

// --- Render ---
function render() {
  app.innerHTML = '';
  const progress = loadProgress();

  subjects.forEach((subject) => {
    const pct = getSubjectProgress(subject.id);
    const completed = progress[subject.id] || {};
    const doneCount = Object.keys(completed).length;

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <div class="subject-header" data-subject="${subject.id}">
        <div class="subject-info">
          <span class="subject-icon">${subject.icon}</span>
          <span class="subject-name">${subject.name}</span>
        </div>
        <div class="subject-stats">
          <span class="subject-count">${doneCount}/${subject.topics.length}</span>
          <span class="subject-chevron">&#9660;</span>
        </div>
      </div>
      <div class="subject-progress">
        <div class="progress-bar progress-bar--subject">
          <div class="progress-bar__fill" style="width: ${pct}%"></div>
        </div>
      </div>
      <ul class="topic-list">
        ${subject.topics.map((topic) => {
          const isDone = completed[topic.id];
          return `
            <li class="topic-item${isDone ? ' done' : ''}" data-subject="${subject.id}" data-topic="${topic.id}">
              <div class="topic-check">
                <span class="topic-check-mark">&#10003;</span>
              </div>
              <span class="topic-name">${topic.name}</span>
            </li>
          `;
        }).join('')}
      </ul>
    `;

    app.appendChild(card);
  });

  updateTotalProgress();
}

function updateTotalProgress() {
  const pct = getTotalProgress();
  totalPct.textContent = `${Math.round(pct)}%`;
  totalBar.style.width = `${pct}%`;
}

// --- Event: toggle subject card open/close ---
app.addEventListener('click', (e) => {
  const header = e.target.closest('.subject-header');
  if (header) {
    header.closest('.subject-card').classList.toggle('open');
    return;
  }

  const item = e.target.closest('.topic-item');
  if (item) {
    const subjectId = item.dataset.subject;
    const topicId = item.dataset.topic;
    const wasComplete = item.classList.contains('done');
    const nowComplete = toggleTopic(subjectId, topicId);

    // Update this item
    item.classList.toggle('done', nowComplete);

    // Burst animation
    if (nowComplete) {
      item.classList.add('burst');
      item.addEventListener('animationend', () => {
        item.classList.remove('burst');
      }, { once: true });
    }

    // Update subject stats
    const card = item.closest('.subject-card');
    const subject = subjects.find((s) => s.id === subjectId);
    const pct = getSubjectProgress(subjectId);
    const progress = loadProgress();
    const doneCount = Object.keys(progress[subjectId] || {}).length;

    card.querySelector('.subject-count').textContent = `${doneCount}/${subject.topics.length}`;
    card.querySelector('.progress-bar__fill').style.width = `${pct}%`;

    updateTotalProgress();

    // All Out Attack check
    if (pct === 100 && !wasComplete) {
      showAllOutAttack(subject.name);
    }
  }
});

// --- All Out Attack overlay ---
function showAllOutAttack(subjectName) {
  overlaySubject.textContent = subjectName.toUpperCase();
  overlay.hidden = false;
}

btnDismiss.addEventListener('click', () => {
  overlay.hidden = true;
});

// --- Save button ---
btnSave.addEventListener('click', () => {
  btnSave.textContent = 'SAVED!';
  btnSave.classList.add('saved');
  flashStatus('PROGRESS SAVED');
  setTimeout(() => {
    btnSave.textContent = 'SAVE';
    btnSave.classList.remove('saved');
  }, 1500);
});

// --- Export ---
btnExport.addEventListener('click', () => {
  const json = exportJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gcse-tracker-backup.json';
  a.click();
  URL.revokeObjectURL(url);
});

// --- Import ---
btnImport.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      importJSON(ev.target.result);
      render();
      flashStatus('PROGRESS IMPORTED');
    } catch (err) {
      alert('Invalid backup file. Please select a valid JSON export.');
    }
  };
  reader.readAsText(file);
  fileInput.value = '';
});

// --- Clear ---
btnClear.addEventListener('click', () => {
  if (confirm('Clear ALL progress? This cannot be undone.')) {
    clearProgress();
    render();
  }
});

// --- Init ---
render();
