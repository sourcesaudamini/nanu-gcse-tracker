import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveProgress,
  loadProgress,
  clearProgress,
  toggleTopic,
  exportJSON,
  importJSON,
} from '../js/storage.js';

describe('storage.js — localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loadProgress returns empty object when nothing saved', () => {
    const data = loadProgress();
    expect(data).toEqual({});
  });

  it('saveProgress + loadProgress round-trips data', () => {
    const progress = { 'biology': { 'cells': true, 'dna': true } };
    saveProgress(progress);
    expect(loadProgress()).toEqual(progress);
  });

  it('clearProgress removes all saved data', () => {
    saveProgress({ 'biology': { 'cells': true } });
    clearProgress();
    expect(loadProgress()).toEqual({});
  });

  it('toggleTopic marks a topic as complete', () => {
    const result = toggleTopic('biology', 'cells');
    expect(result).toBe(true);
    const data = loadProgress();
    expect(data['biology']['cells']).toBe(true);
  });

  it('toggleTopic unmarks a completed topic', () => {
    toggleTopic('biology', 'cells'); // mark
    const result = toggleTopic('biology', 'cells'); // unmark
    expect(result).toBe(false);
    const data = loadProgress();
    // Empty subject objects get cleaned up
    expect(data['biology']).toBeUndefined();
  });

  it('toggleTopic handles multiple subjects independently', () => {
    toggleTopic('biology', 'cells');
    toggleTopic('history', 'cold-war');
    const data = loadProgress();
    expect(data['biology']['cells']).toBe(true);
    expect(data['history']['cold-war']).toBe(true);
  });
});

describe('storage.js — JSON export/import', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exportJSON returns a valid JSON string of current progress', () => {
    const progress = { 'biology': { 'cells': true } };
    saveProgress(progress);
    const json = exportJSON();
    expect(JSON.parse(json)).toEqual(progress);
  });

  it('importJSON restores progress from a JSON string', () => {
    const progress = { 're': { 'christianity-beliefs': true } };
    importJSON(JSON.stringify(progress));
    expect(loadProgress()).toEqual(progress);
  });

  it('importJSON throws on invalid JSON', () => {
    expect(() => importJSON('not json')).toThrow();
  });

  it('importJSON throws on non-object JSON', () => {
    expect(() => importJSON('"hello"')).toThrow();
  });

  it('export then import preserves full state', () => {
    toggleTopic('biology', 'cells');
    toggleTopic('biology', 'dna');
    toggleTopic('history', 'cold-war');
    const exported = exportJSON();
    clearProgress();
    expect(loadProgress()).toEqual({});
    importJSON(exported);
    const restored = loadProgress();
    expect(restored['biology']['cells']).toBe(true);
    expect(restored['biology']['dna']).toBe(true);
    expect(restored['history']['cold-war']).toBe(true);
  });
});
