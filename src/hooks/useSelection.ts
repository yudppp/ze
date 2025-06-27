import { useState, useCallback, useEffect } from 'react';

export function useSelection<T>(items: T[]) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selection when items change
  useEffect(() => {
    if (selectedIndex >= items.length) {
      setSelectedIndex(Math.max(0, items.length - 1));
    }
  }, [items.length, selectedIndex]);

  const moveUp = useCallback(() => {
    setSelectedIndex(prev => 
      prev === 0 ? items.length - 1 : prev - 1
    );
  }, [items.length]);

  const moveDown = useCallback(() => {
    setSelectedIndex(prev => 
      prev === items.length - 1 ? 0 : prev + 1
    );
  }, [items.length]);

  const resetSelection = useCallback(() => {
    setSelectedIndex(0);
  }, []);

  const currentItem = items[selectedIndex];

  return {
    selectedIndex,
    currentItem,
    moveUp,
    moveDown,
    resetSelection
  };
}