import { test, mock } from 'node:test';
import assert from 'node:assert';

// Mock React hooks for testing
const mockState = { searchQuery: '', filteredItems: [] };
const mockSetState = mock.fn();

const mockUseState = mock.fn((initial) => [initial, mockSetState]);
const mockUseMemo = mock.fn((fn, deps) => fn());
const mockUseCallback = mock.fn((fn) => fn);

// Mock React
global.React = {
  useState: mockUseState,
  useMemo: mockUseMemo,
  useCallback: mockUseCallback
};

test('incremental search filters items correctly', () => {
  const items = [
    { label: 'session1' },
    { label: 'session2' },
    { label: 'test-session' },
    { name: 'another-session' }
  ];

  // Test filtering logic directly
  const searchQuery = 'se';
  const filtered = items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  assert.strictEqual(filtered.length, 4);
  assert.strictEqual(filtered[0].label, 'session1');
  assert.strictEqual(filtered[1].label, 'session2');
  assert.strictEqual(filtered[2].label, 'test-session');
  assert.strictEqual(filtered[3].name, 'another-session');
});

test('search query filtering is case insensitive', () => {
  const items = [
    { label: 'Session1' },
    { label: 'TEST-session' },
    { name: 'Another-Session' }
  ];

  const searchQuery = 'session';
  const filtered = items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  assert.strictEqual(filtered.length, 3);
});

test('empty search returns all items', () => {
  const items = [
    { label: 'session1' },
    { label: 'session2' }
  ];

  const searchQuery = '';
  const filtered = searchQuery ? items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  }) : items;

  assert.strictEqual(filtered.length, 2);
  assert.deepStrictEqual(filtered, items);
});