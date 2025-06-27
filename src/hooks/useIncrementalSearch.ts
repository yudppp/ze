import { useState, useMemo, useCallback } from 'react';

export interface SearchableItem {
  label?: string;
  name?: string;
}

export function useIncrementalSearch<T extends SearchableItem>(items: T[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    
    return items.filter(item => {
      const label = item.label || item.name || '';
      return label.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, items]);

  const addChar = useCallback((char: string) => {
    setSearchQuery(prev => prev + char);
  }, []);

  const removeChar = useCallback(() => {
    setSearchQuery(prev => prev.slice(0, -1));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    filteredItems,
    addChar,
    removeChar,
    clearSearch
  };
}