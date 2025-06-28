import { useState, useMemo, useCallback } from 'react';
import { Action } from '../types.js';

export interface SearchableItem {
  label?: string;
  name?: string;
}

export function useIncrementalSearch<T extends SearchableItem>(items: T[], disableSearch = false) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    // If search is disabled, return items as-is
    if (disableSearch) {
      return items;
    }

    const filtered = searchQuery 
      ? items.filter(item => {
          const label = item.label || item.name || '';
          return label.toLowerCase().includes(searchQuery.toLowerCase());
        })
      : items;

    // Always add "Create New Session" option when searching
    if (searchQuery) {
      const createSessionAction: Action = {
        label: `Create New Session: ${searchQuery}`,
        value: 'create-session',
        description: 'Create a new session with this name',
        action: () => searchQuery,
        createSession: true,
        sessionName: searchQuery
      };
      return [...filtered, createSessionAction as unknown as T];
    }
    
    // Add "Create New Session" option to regular list
    const newSessionAction: Action = {
      label: '[ + New Session ]',
      value: 'new-session',
      description: 'Create a new session',
      action: () => 'new-session'
    };
    
    return [...filtered, newSessionAction as unknown as T];
  }, [searchQuery, items, disableSearch]);

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