import { subjects } from './data.js';
import { loadProgress } from './storage.js';

export function getSubjectProgress(subjectId) {
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return 0;

  const data = loadProgress();
  const completed = data[subjectId] || {};
  const count = Object.keys(completed).length;

  return (count / subject.topics.length) * 100;
}

export function getTotalProgress() {
  const data = loadProgress();
  let totalTopics = 0;
  let completedTopics = 0;

  subjects.forEach((s) => {
    totalTopics += s.topics.length;
    const completed = data[s.id] || {};
    completedTopics += Object.keys(completed).length;
  });

  if (totalTopics === 0) return 0;
  return (completedTopics / totalTopics) * 100;
}
