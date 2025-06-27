import { test } from 'node:test';
import assert from 'node:assert';

test('search handles special characters correctly', () => {
  const items = [
    { label: 'session-1' },
    { label: 'session_2' },
    { label: 'session.3' },
    { label: 'session@4' },
    { label: 'session(5)' }
  ];

  const searchQuery = 'session-';
  const filtered = items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].label, 'session-1');
});

test('search handles unicode characters', () => {
  const items = [
    { label: 'セッション1' },
    { label: 'session2' },
    { label: 'сессия3' }, // Cyrillic
    { label: 'sesión4' }   // Spanish
  ];

  const searchQuery = 'セッション';
  const filtered = items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].label, 'セッション1');
});

test('search handles very long strings', () => {
  const longLabel = 'a'.repeat(1000) + 'session' + 'b'.repeat(1000);
  const items = [
    { label: longLabel },
    { label: 'short' }
  ];

  const searchQuery = 'session';
  const filtered = items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].label, longLabel);
});

test('search handles empty and whitespace-only queries', () => {
  const items = [
    { label: 'session1' },
    { label: 'session2' }
  ];

  // Empty string
  let searchQuery = '';
  let filtered = searchQuery ? items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  }) : items;
  assert.strictEqual(filtered.length, 2);

  // Whitespace only
  searchQuery = '   ';
  filtered = items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });
  assert.strictEqual(filtered.length, 0);

  // Tab character
  searchQuery = '\t';
  filtered = items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });
  assert.strictEqual(filtered.length, 0);
});

test('search handles mixed case correctly', () => {
  const items = [
    { label: 'SessionOne' },
    { label: 'SESSION_TWO' },
    { label: 'session-three' },
    { label: 'Session.Four' }
  ];

  const searchQuery = 'SESSION';
  const filtered = items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  assert.strictEqual(filtered.length, 4);
});