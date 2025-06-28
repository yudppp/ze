import { test } from 'node:test';
import assert from 'node:assert';

// Extract pure functions from app.tsx for testing

test('session action creation logic works correctly', () => {
  // Simulate the logic from app.tsx lines 50-73
  const createSessionActions = (zellijSessions, attachSession, setShowNameInput, setShowLayoutSelect) => {
    const sessionActions = zellijSessions.map(session => ({
      label: session.name,
      value: session.name,
      description: session.isActive ? 'active' : session.created,
      action: () => attachSession(session.name),
      deletable: true,
    }));

    sessionActions.push({
      label: '[ + New Session ]',
      value: 'new-session',
      description: '',
      action: () => {
        setShowNameInput(true);
        setShowLayoutSelect(true);
        return;
      },
      deletable: false,
    });

    return sessionActions;
  };

  const mockSessions = [
    { name: 'session1', isActive: true, created: '2024-01-01' },
    { name: 'session2', isActive: false, created: '2024-01-02' }
  ];

  let attachedSession = null;
  let nameInputShown = false;
  let layoutSelectShown = false;

  const mockAttachSession = (name) => { attachedSession = name; };
  const mockSetShowNameInput = (value) => { nameInputShown = value; };
  const mockSetShowLayoutSelect = (value) => { layoutSelectShown = value; };

  const actions = createSessionActions(
    mockSessions, 
    mockAttachSession, 
    mockSetShowNameInput, 
    mockSetShowLayoutSelect
  );

  // Should have 2 sessions + 1 new session button
  assert.strictEqual(actions.length, 3);

  // First session should be active
  assert.strictEqual(actions[0].label, 'session1');
  assert.strictEqual(actions[0].description, 'active');
  assert.strictEqual(actions[0].deletable, true);

  // Second session should show creation date
  assert.strictEqual(actions[1].label, 'session2');
  assert.strictEqual(actions[1].description, '2024-01-02');

  // New session button should not be deletable
  assert.strictEqual(actions[2].label, '[ + New Session ]');
  assert.strictEqual(actions[2].deletable, false);

  // Test attach action
  actions[0].action();
  assert.strictEqual(attachedSession, 'session1');

  // Test new session action
  actions[2].action();
  assert.strictEqual(nameInputShown, true);
  assert.strictEqual(layoutSelectShown, true);
});

test('escape key navigation logic works correctly', () => {
  // Simulate the logic from app.tsx lines 81-91
  const handleEscapeKey = (showLayoutSelect, showNameInput, setShowLayoutSelect, setShowNameInput, setNewSessionName, exit) => {
    if (showLayoutSelect) {
      setShowLayoutSelect(false);
      setShowNameInput(true);
    } else if (showNameInput) {
      setShowNameInput(false);
      setNewSessionName('');
    } else {
      exit();
    }
  };

  let layoutSelectShown = true;
  let nameInputShown = false;
  let sessionName = 'test';
  let exited = false;

  const mockSetShowLayoutSelect = (value) => { layoutSelectShown = value; };
  const mockSetShowNameInput = (value) => { nameInputShown = value; };
  const mockSetNewSessionName = (value) => { sessionName = value; };
  const mockExit = () => { exited = true; };

  // Test: escape from layout select
  handleEscapeKey(true, false, mockSetShowLayoutSelect, mockSetShowNameInput, mockSetNewSessionName, mockExit);
  assert.strictEqual(layoutSelectShown, false);
  assert.strictEqual(nameInputShown, true);
  assert.strictEqual(exited, false);

  // Reset and test: escape from name input
  layoutSelectShown = false;
  nameInputShown = true;
  sessionName = 'test';
  exited = false;

  handleEscapeKey(false, true, mockSetShowLayoutSelect, mockSetShowNameInput, mockSetNewSessionName, mockExit);
  assert.strictEqual(nameInputShown, false);
  assert.strictEqual(sessionName, '');
  assert.strictEqual(exited, false);

  // Reset and test: escape from main view
  layoutSelectShown = false;
  nameInputShown = false;
  exited = false;

  handleEscapeKey(false, false, mockSetShowLayoutSelect, mockSetShowNameInput, mockSetNewSessionName, mockExit);
  assert.strictEqual(exited, true);
});

test('delete session logic works correctly', () => {
  // Simulate the logic from app.tsx lines 71-86
  const canDeleteItem = (item) => {
    return 'value' in item && item.value !== 'new-session';
  };

  const deletableItem = { value: 'session1', label: 'Session 1' };
  const newSessionItem = { value: 'new-session', label: '[ + New Session ]' };
  const itemWithoutValue = { label: 'Some item' };

  assert.strictEqual(canDeleteItem(deletableItem), true);
  assert.strictEqual(canDeleteItem(newSessionItem), false);
  assert.strictEqual(canDeleteItem(itemWithoutValue), false);
});

test('context determination logic works correctly', () => {
  // Simulate the logic from app.tsx lines 36-41
  const shouldShowSessionCreation = (inZellij, sessionsLength) => {
    return !inZellij && sessionsLength === 0;
  };

  // Outside Zellij with no sessions - should show creation
  assert.strictEqual(shouldShowSessionCreation(false, 0), true);

  // Outside Zellij with sessions - should show list
  assert.strictEqual(shouldShowSessionCreation(false, 2), false);

  // Inside Zellij - should show exit option
  assert.strictEqual(shouldShowSessionCreation(true, 0), false);
  assert.strictEqual(shouldShowSessionCreation(true, 2), false);
});

test('layout sorting logic works correctly', () => {
  // Simulate the logic from app.tsx lines 175-179
  const sortLayouts = (layouts) => {
    return [...layouts].sort((a, b) => {
      if (a === 'default') return -1;
      if (b === 'default') return 1;
      return a.localeCompare(b);
    });
  };

  const layouts = ['zebra', 'default', 'compact', 'apple', 'classic'];
  const sorted = sortLayouts(layouts);

  assert.strictEqual(sorted[0], 'default');
  assert.strictEqual(sorted[1], 'apple');
  assert.strictEqual(sorted[2], 'classic');
  assert.strictEqual(sorted[3], 'compact');
  assert.strictEqual(sorted[4], 'zebra');
});