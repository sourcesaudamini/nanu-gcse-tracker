import { describe, it, expect, beforeEach } from 'vitest';
import { getSubjectProgress, getTotalProgress } from '../js/progress.js';
import { subjects } from '../js/data.js';
import { saveProgress, clearProgress } from '../js/storage.js';

describe('progress.js — per-subject progress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns 0% when no topics are completed', () => {
    const pct = getSubjectProgress('biology');
    expect(pct).toBe(0);
  });

  it('returns correct % when some topics are completed', () => {
    const bio = subjects.find((s) => s.id === 'biology');
    const total = bio.topics.length;
    // Mark first 2 topics
    const progress = {
      biology: {
        [bio.topics[0].id]: true,
        [bio.topics[1].id]: true,
      },
    };
    saveProgress(progress);
    const pct = getSubjectProgress('biology');
    expect(pct).toBeCloseTo((2 / total) * 100, 1);
  });

  it('returns 100% when all topics are completed', () => {
    const bio = subjects.find((s) => s.id === 'biology');
    const progress = {
      biology: Object.fromEntries(bio.topics.map((t) => [t.id, true])),
    };
    saveProgress(progress);
    expect(getSubjectProgress('biology')).toBe(100);
  });

  it('returns 0 for unknown subject id', () => {
    expect(getSubjectProgress('nonexistent')).toBe(0);
  });
});

describe('progress.js — total progress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns 0% when nothing is completed', () => {
    expect(getTotalProgress()).toBe(0);
  });

  it('returns 100% when everything is completed', () => {
    const progress = {};
    subjects.forEach((s) => {
      progress[s.id] = Object.fromEntries(s.topics.map((t) => [t.id, true]));
    });
    saveProgress(progress);
    expect(getTotalProgress()).toBe(100);
  });

  it('calculates weighted average across subjects', () => {
    // Complete all topics in one subject only
    const bio = subjects.find((s) => s.id === 'biology');
    const progress = {
      biology: Object.fromEntries(bio.topics.map((t) => [t.id, true])),
    };
    saveProgress(progress);

    const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0);
    const expected = (bio.topics.length / totalTopics) * 100;
    expect(getTotalProgress()).toBeCloseTo(expected, 1);
  });
});
