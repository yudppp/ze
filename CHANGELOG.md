# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2025-06-28

### Added
- **Create Session from Search**: Type any name to get "Create New Session: [name]" option
- **Always Available Creation**: "[ + New Session ]" option always shown at bottom of session list
- **Enhanced Search**: Create new sessions directly from search results, even when matches exist

### Improved
- **Simplified State Management**: Reduced from 8 useState to 3 simple states (mode, sessionName, layouts)
- **React Architecture**: Migrated from useReducer to clean 3-mode interface (list → input → layout)
- **Component Structure**: Inlined components for better maintainability and reduced complexity
- **Performance**: Removed unnecessary useEffect hooks and optimized re-rendering
- **Code Quality**: Comprehensive test coverage for new features with 18 passing tests

### Removed
- **Unused Dependencies**: Removed chalk and fuse.js packages (4 runtime dependencies total)
- **Dead Code**: Cleaned up separator functionality, enablePreview feature, and unused functions
- **Redundant State**: Eliminated isZellij, context, and other unnecessary state variables
- **Code Bloat**: Removed 100+ lines of unused code across multiple files

### Technical
- **Bundle Size**: Reduced from ~18kb to 13.5kb (25% smaller)
- **Dependencies**: Cut runtime dependencies from 6 to 4 packages
- **Test Coverage**: Added comprehensive tests for search-to-create functionality
- **Type Safety**: Improved TypeScript definitions and removed unused properties

## [0.1.0] - 2025-06-26

### Added
- Initial release of ze-cli
- Interactive session management for Zellij
- fzf-like selection interface
- Session creation with custom names
- Layout selection support
- Session deletion with Ctrl+D
- Real-time search/filtering
- Active session indicator
- Context-aware behavior (inside/outside Zellij)
- TypeScript implementation with Ink (React for CLIs)

### Features
- List all Zellij sessions
- Attach to existing sessions
- Create new sessions with optional layouts
- Delete sessions (except active ones)
- Keyboard navigation (arrows and vim keys)
- Incremental search by typing
- Visual feedback with box-styled UI