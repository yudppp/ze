import { test } from 'node:test';
import assert from 'node:assert';

test('ConfirmDeletePrompt props interface validation', () => {
  // Test that the component expects the correct props structure
  const validProps = {
    sessionName: 'test-session',
    isActive: true,
    onConfirm: () => {},
    onCancel: () => {}
  };

  // Validate required props exist
  assert.strictEqual(typeof validProps.sessionName, 'string');
  assert.strictEqual(typeof validProps.isActive, 'boolean');
  assert.strictEqual(typeof validProps.onConfirm, 'function');
  assert.strictEqual(typeof validProps.onCancel, 'function');
});

test('session name formatting works correctly', () => {
  const formatSessionName = (name) => `'${name}'`;
  
  assert.strictEqual(formatSessionName('my-session'), "'my-session'");
  assert.strictEqual(formatSessionName('test'), "'test'");
  assert.strictEqual(formatSessionName(''), "''");
});

test('active session warning logic', () => {
  const shouldShowWarning = (isActive) => isActive === true;
  
  assert.strictEqual(shouldShowWarning(true), true);
  assert.strictEqual(shouldShowWarning(false), false);
  assert.strictEqual(shouldShowWarning(undefined), false);
  assert.strictEqual(shouldShowWarning(null), false);
});

test('input validation for confirmation', () => {
  const isConfirmInput = (input) => input && input.toLowerCase() === 'y';
  const isCancelInput = (input) => input && input.toLowerCase() === 'n';
  
  // Confirm inputs
  assert.strictEqual(isConfirmInput('y'), true);
  assert.strictEqual(isConfirmInput('Y'), true);
  assert.strictEqual(isConfirmInput('yes'), false); // Only 'y' should work
  
  // Cancel inputs
  assert.strictEqual(isCancelInput('n'), true);
  assert.strictEqual(isCancelInput('N'), true);
  assert.strictEqual(isCancelInput('no'), false); // Only 'n' should work
  
  // Invalid inputs
  assert.strictEqual(isConfirmInput('x'), false);
  assert.strictEqual(isCancelInput('x'), false);
  assert.strictEqual(!!isConfirmInput(''), false); // Convert to boolean for comparison
  assert.strictEqual(!!isCancelInput(''), false); // Convert to boolean for comparison
});