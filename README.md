# Ze - Zellij Session Manager

Fast and intuitive Zellij session manager with real-time search. Simplify your Zellij workflow with intuitive keyboard-driven operations.

![Ze Demo](./assets/demo.gif)

## Installation

```bash
# Install from npm
npm install -g ze-cli

# Or using npx
npx ze-cli
```

### Install from source

```bash
# Clone the repository
git clone https://github.com/yudppp/ze.git
cd ze

# Install dependencies
npm install

# Install globally
npm link
```

## Usage

```bash
# Run ze
ze
```

### Features

#### Outside Zellij
- **Session List**: View all Zellij sessions with creation time
- **Quick Attach**: Select and attach to existing sessions
- **Create Sessions**: Create new sessions with optional custom names
- **Layout Selection**: Choose from available layouts when creating sessions
- **Delete Sessions**: Remove sessions with Ctrl+D
- **Active Indicator**: Green dot (●) shows active sessions

#### Inside Zellij
- Shows current session context
- Simple exit option

## Keyboard Shortcuts

- **Navigation**
  - `↑`/`↓` or `j`/`k` - Navigate through items
  - `Enter` - Select item or confirm input
  - `Esc` or `Ctrl+C` - Cancel current action or exit

- **Search**
  - Type any characters - Filter sessions by name
  - `Backspace` - Clear search character by character

- **Session Management**
  - `Ctrl+D` - Delete selected session (when outside Zellij)

## User Interface

### Session Selection
```
⚡ Select Session
┌─────────────────────────────────────┐
│   session1                          │
│ > session2 ●                        │
│   [ + New Session ]                 │
└─────────────────────────────────────┘
```

### Session Creation Flow
1. **Name Input**: Enter session name (optional)
2. **Layout Selection**: Choose from available layouts
   - `default` - Standard layout (recommended)
   - `compact` - Compact view
   - `classic` - Classic style
   - Custom layouts from `~/.config/zellij/layouts/`

## Development

```bash
# Watch mode for TypeScript
npm run dev

# Build
npm run build

# Run
npm start
```

## License

MIT