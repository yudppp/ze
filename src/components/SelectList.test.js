import { test } from 'node:test';
import assert from 'node:assert';

test('separator detection works correctly', () => {
  const isSeparator = (item) => {
    return 'label' in item && item.label === '---';
  };

  const separatorItem = { label: '---' };
  const normalItem = { label: 'session1' };
  const nameItem = { name: 'session2' };

  assert.strictEqual(isSeparator(separatorItem), true);
  assert.strictEqual(isSeparator(normalItem), false);
  assert.strictEqual(isSeparator(nameItem), false);
});

test('deletable item check works correctly', () => {
  const isDeletable = (item) => {
    return 'deletable' in item && item.deletable;
  };

  const deletableItem = { label: 'session1', deletable: true };
  const nonDeletableItem = { label: 'session2', deletable: false };
  const itemWithoutDeletable = { label: 'session3' };

  assert.strictEqual(isDeletable(deletableItem), true);
  assert.strictEqual(isDeletable(nonDeletableItem), false);
  assert.strictEqual(isDeletable(itemWithoutDeletable), false);
});

test('search query manipulation works correctly', () => {
  let searchQuery = '';

  // Add characters
  searchQuery += 's';
  searchQuery += 'e';
  assert.strictEqual(searchQuery, 'se');

  // Remove character
  searchQuery = searchQuery.slice(0, -1);
  assert.strictEqual(searchQuery, 's');

  // Remove last character
  searchQuery = searchQuery.slice(0, -1);
  assert.strictEqual(searchQuery, '');

  // Remove from empty string (should stay empty)
  searchQuery = searchQuery.slice(0, -1);
  assert.strictEqual(searchQuery, '');
});

test('label extraction works correctly', () => {
  const extractLabel = (item) => {
    return item.label || item.name || '';
  };

  const labelItem = { label: 'session1' };
  const nameItem = { name: 'session2' };
  const bothItem = { label: 'session3', name: 'fallback' };
  const emptyItem = {};

  assert.strictEqual(extractLabel(labelItem), 'session1');
  assert.strictEqual(extractLabel(nameItem), 'session2');
  assert.strictEqual(extractLabel(bothItem), 'session3'); // label takes precedence
  assert.strictEqual(extractLabel(emptyItem), '');
});