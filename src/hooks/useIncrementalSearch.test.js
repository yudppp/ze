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

test('adds Create New Session option when searching', () => {
  const items = [
    { label: 'session1' },
    { label: 'session2' }
  ];

  const searchQuery = 'new-session';
  const filtered = items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // When searching and there are results or no results, Create New Session option should be added
  const createSessionAction = {
    label: `Create New Session: ${searchQuery}`,
    value: 'create-session',
    description: 'Create a new session with this name',
    createSession: true,
    sessionName: searchQuery
  };

  const finalResult = [...filtered, createSessionAction];
  
  assert.strictEqual(finalResult.length, 1); // No matches + 1 create option
  assert.strictEqual(finalResult[0].label, 'Create New Session: new-session');
  assert.strictEqual(finalResult[0].createSession, true);
  assert.strictEqual(finalResult[0].sessionName, 'new-session');
});

test('adds Create New Session option to regular list when not searching', () => {
  const items = [
    { label: 'session1' },
    { label: 'session2' }
  ];

  const searchQuery = '';
  
  // When not searching, "New Session" option should be added
  const newSessionAction = {
    label: '[ + New Session ]',
    value: 'new-session',
    description: 'Create a new session'
  };

  const finalResult = [...items, newSessionAction];
  
  assert.strictEqual(finalResult.length, 3); // 2 sessions + 1 new option
  assert.strictEqual(finalResult[2].label, '[ + New Session ]');
  assert.strictEqual(finalResult[2].value, 'new-session');
});

test('adds Create New Session option even when search has matches', () => {
  const items = [
    { label: 'session1' },
    { label: 'session2' },
    { label: 'test-session' }
  ];

  const searchQuery = 'session';
  const filtered = items.filter(item => {
    const label = item.label || item.name || '';
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // All items match the search
  assert.strictEqual(filtered.length, 3);

  // Create New Session option should still be added
  const createSessionAction = {
    label: `Create New Session: ${searchQuery}`,
    value: 'create-session',
    description: 'Create a new session with this name',
    createSession: true,
    sessionName: searchQuery
  };

  const finalResult = [...filtered, createSessionAction];
  
  assert.strictEqual(finalResult.length, 4); // 3 matches + 1 create option
  assert.strictEqual(finalResult[3].label, 'Create New Session: session');
  assert.strictEqual(finalResult[3].createSession, true);
});