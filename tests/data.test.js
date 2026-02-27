import { describe, it, expect } from 'vitest';
import { subjects } from '../js/data.js';

describe('data.js — subject data', () => {
  it('exports a subjects array', () => {
    expect(Array.isArray(subjects)).toBe(true);
  });

  it('contains exactly 5 subjects', () => {
    expect(subjects).toHaveLength(5);
  });

  const expectedSubjects = [
    'Functional Maths (Level 2)',
    'Advanced Maths (GCSE Higher)',
    'Biology',
    'History',
    'RE (Religious Studies)',
  ];

  expectedSubjects.forEach((name) => {
    it(`includes "${name}"`, () => {
      const found = subjects.find((s) => s.name === name);
      expect(found).toBeDefined();
    });
  });

  it('every subject has a non-empty id string', () => {
    subjects.forEach((s) => {
      expect(typeof s.id).toBe('string');
      expect(s.id.length).toBeGreaterThan(0);
    });
  });

  it('every subject has unique ids', () => {
    const ids = subjects.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every subject has a non-empty topics array', () => {
    subjects.forEach((s) => {
      expect(Array.isArray(s.topics)).toBe(true);
      expect(s.topics.length).toBeGreaterThan(0);
    });
  });

  it('every topic has an id and name', () => {
    subjects.forEach((s) => {
      s.topics.forEach((t) => {
        expect(typeof t.id).toBe('string');
        expect(t.id.length).toBeGreaterThan(0);
        expect(typeof t.name).toBe('string');
        expect(t.name.length).toBeGreaterThan(0);
      });
    });
  });

  it('topic ids are unique within each subject', () => {
    subjects.forEach((s) => {
      const ids = s.topics.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  it('Functional Maths has at least 15 topics', () => {
    const fm = subjects.find((s) => s.id === 'functional-maths');
    expect(fm.topics.length).toBeGreaterThanOrEqual(15);
  });

  it('Advanced Maths has at least 30 topics', () => {
    const am = subjects.find((s) => s.id === 'advanced-maths');
    expect(am.topics.length).toBeGreaterThanOrEqual(30);
  });

  it('Biology has at least 18 topics', () => {
    const bio = subjects.find((s) => s.id === 'biology');
    expect(bio.topics.length).toBeGreaterThanOrEqual(18);
  });

  it('History has at least 20 topics', () => {
    const hist = subjects.find((s) => s.id === 'history');
    expect(hist.topics.length).toBeGreaterThanOrEqual(20);
  });

  it('RE has at least 20 topics', () => {
    const re = subjects.find((s) => s.id === 're');
    expect(re.topics.length).toBeGreaterThanOrEqual(20);
  });
});
