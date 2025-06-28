import { useState, useMemo, useCallback } from 'react';
import { Action, CreateSessionAction, SessionAction } from '../types.js';

export interface SearchableItem {
  label: string;
}

export function useIncrementalSearch<T extends SearchableItem>(items: T[], disableSearch = false) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    // If search is disabled, return items as-is
    if (disableSearch) {
      return items;
    }

    const filtered = searchQuery 
      ? items.filter(item => 
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : items;

    // Always add "Create New Session" option when searching
    if (searchQuery) {
      const createSessionAction: CreateSessionAction = {
        type: 'action' as const,
        actionType: 'create-session',
        label: `Create New Session: ${searchQuery}`,
        description: 'Create a new session with this name',
        action: () => searchQuery,
        createSession: true,
        sessionName: searchQuery
      };
      return [...filtered, createSessionAction as unknown as T];
    }
    
    // Add "Create New Session" option to regular list
    const newSessionAction: SessionAction = {
      type: 'action' as const,
      actionType: 'session',
      label: '[ + New Session ]',
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