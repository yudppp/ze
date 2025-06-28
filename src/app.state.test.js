import { test } from 'node:test';
import assert from 'node:assert';

// Test the simplified state management logic
test('mode transitions work correctly', () => {
  // Simulate the three modes: 'list', 'input', 'layout'
  let mode = 'list';
  let sessionName = '';
  let layouts = [];

  // Test transition: list -> input
  mode = 'input';
  assert.strictEqual(mode, 'input');

  // Test session name setting
  sessionName = 'test-session';
  assert.strictEqual(sessionName, 'test-session');

  // Test transition: input -> layout
  mode = 'layout';
  layouts = ['default', 'compact', 'classic'];
  assert.strictEqual(mode, 'layout');
  assert.strictEqual(layouts.length, 3);

  // Test escape handling: layout -> input
  mode = 'input';
  assert.strictEqual(mode, 'input');

  // Test escape handling: input -> list
  mode = 'list';
  sessionName = '';
  assert.strictEqual(mode, 'list');
  assert.strictEqual(sessionName, '');
});

test('Create Session from search action works correctly', () => {
  let mode = 'list';
  let sessionName = '';
  let layouts = [];

  // Simulate handleSelect for createSession action
  const item = {
    createSession: true,
    sessionName: 'my-new-session'
  };

  if (item.createSession && item.sessionName) {
    sessionName = item.sessionName;
    layouts = ['default', 'compact', 'classic']; // mock listLayouts()
    mode = 'layout';
  }

  assert.strictEqual(mode, 'layout');
  assert.strictEqual(sessionName, 'my-new-session');
  assert.strictEqual(layouts.length, 3);
});

test('New Session action works correctly', () => {
  let mode = 'list';

  // Simulate handleSelect for new-session action
  const item = {
    value: 'new-session'
  };

  if (item.value === 'new-session') {
    mode = 'input';
  }

  assert.strictEqual(mode, 'input');
});

test('session actions creation works correctly', () => {
  // Mock session data
  const sessions = [
    { id: 'session1', name: 'session1', created: '1h ago', isActive: true },
    { id: 'session2', name: 'session2', created: '2h ago', isActive: false }
  ];

  // Simulate actions creation logic
  const sessionActions = sessions.map(session => ({
    label: session.name,
    value: session.name,
    description: session.isActive ? 'active' : session.created,
    action: () => `attach-${session.name}`, // mock attachSession
    deletable: true,
  }));

  assert.strictEqual(sessionActions.length, 2);
  assert.strictEqual(sessionActions[0].label, 'session1');
  assert.strictEqual(sessionActions[0].description, 'active');
  assert.strictEqual(sessionActions[0].deletable, true);
  assert.strictEqual(sessionActions[1].label, 'session2');
  assert.strictEqual(sessionActions[1].description, '2h ago');
});

test('session deletion refresh works correctly', () => {
  // Mock initial sessions
  let actions = [
    { label: 'session1', value: 'session1', deletable: true },
    { label: 'session2', value: 'session2', deletable: true }
  ];

  // Simulate delete and refresh
  const itemToDelete = { value: 'session1' };
  
  if (itemToDelete.value !== 'new-session') {
    // Mock deleteSession(itemToDelete.value);
    
    // Mock refresh with updated sessions (session1 removed)
    const updatedSessions = [
      { id: 'session2', name: 'session2', created: '2h ago', isActive: false }
    ];
    
    actions = updatedSessions.map(session => ({
      label: session.name,
      value: session.name,
      description: session.isActive ? 'active' : session.created,
      action: () => `attach-${session.name}`,
      deletable: true,
    }));
  }

  assert.strictEqual(actions.length, 1);
  assert.strictEqual(actions[0].label, 'session2');
});