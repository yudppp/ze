import { test } from 'node:test';
import assert from 'node:assert';

test('selection moves up and down correctly', () => {
  const items = ['item1', 'item2', 'item3'];
  let selectedIndex = 0;

  // Move down
  selectedIndex = selectedIndex === items.length - 1 ? 0 : selectedIndex + 1;
  assert.strictEqual(selectedIndex, 1);

  // Move down again
  selectedIndex = selectedIndex === items.length - 1 ? 0 : selectedIndex + 1;
  assert.strictEqual(selectedIndex, 2);

  // Move down (should wrap to 0)
  selectedIndex = selectedIndex === items.length - 1 ? 0 : selectedIndex + 1;
  assert.strictEqual(selectedIndex, 0);
});

test('selection wraps around when moving up from first item', () => {
  const items = ['item1', 'item2', 'item3'];
  let selectedIndex = 0;

  // Move up (should wrap to last item)
  selectedIndex = selectedIndex === 0 ? items.length - 1 : selectedIndex - 1;
  assert.strictEqual(selectedIndex, 2);
});

test('selection handles empty arrays', () => {
  const items = [];
  let selectedIndex = 0;

  // Reset to 0 when items are empty
  selectedIndex = Math.max(0, Math.min(selectedIndex, items.length - 1));
  assert.strictEqual(selectedIndex, 0);
});

test('selection adjusts when items list shrinks', () => {
  let items = ['item1', 'item2', 'item3'];
  let selectedIndex = 2; // Last item

  // Simulate filtering that reduces items
  items = ['item1']; // Only one item left
  selectedIndex = Math.max(0, Math.min(selectedIndex, items.length - 1));
  
  assert.strictEqual(selectedIndex, 0);
});