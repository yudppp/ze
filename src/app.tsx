import React, {useState, useEffect} from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import TextInput from 'ink-text-input';
import SelectList from './components/SelectList.js';
import {Action} from './types.js';
import {listSessions, listLayouts} from './lib/zellij.js';
import {attachSession, createSession, deleteSession} from './lib/actions.js';

const App: React.FC = () => {
	const {exit} = useApp();
	const [mode, setMode] = useState<'list' | 'input' | 'layout'>('list');
	const [sessionName, setSessionName] = useState('');
	const [layouts, setLayouts] = useState<string[]>([]);

	const [actions, setActions] = useState<Action[]>([]);

	useEffect(() => {
		const sessions = listSessions();
		
		// If no sessions exist, go straight to create new session
		if (sessions.length === 0) {
			setMode('input');
			return;
		}
		
		// Create session actions
		const sessionActions: Action[] = sessions.map(session => ({
			label: session.name,
			value: session.name,
			description: session.isActive ? 'active' : session.created,
			action: () => attachSession(session.name),
			deletable: true,
		}));
		
		setActions(sessionActions);
	}, []);

	useInput((input, key) => {
		if (key.escape || (key.ctrl && input === 'c')) {
			if (mode === 'layout') {
				setMode('input');
			} else if (mode === 'input') {
				setMode('list');
				setSessionName('');
			} else {
				exit();
			}
		}
	});

	const handleSelect = (item: Action | any) => {
		// Handle "Create Session" from search
		if ('createSession' in item && item.createSession && item.sessionName) {
			setSessionName(item.sessionName);
			setLayouts(listLayouts());
			setMode('layout');
			return;
		}
		
		// Handle "New Session" option
		if ('value' in item && item.value === 'new-session') {
			setMode('input');
			return;
		}
		
		if ('action' in item && item.action) {
			item.action();
		}
	};

	const handleDelete = (item: Action | any) => {
		if ('value' in item && item.value !== 'new-session') {
			deleteSession(item.value);
			// Refresh the session list
			const sessions = listSessions();
			const sessionActions: Action[] = sessions.map(session => ({
				label: session.name,
				value: session.name,
				description: session.isActive ? 'active' : session.created,
				action: () => attachSession(session.name),
				deletable: true,
			}));
			
			setActions(sessionActions);
		}
	};

	if (mode === 'input') {
		return (
			<Box flexDirection="column" paddingY={1}>
				<Box marginBottom={1}>
					<Text bold color="cyan">
						⚡ {actions.length === 0 ? 'Create Your First Session' : 'Create New Session'}
					</Text>
				</Box>
				<Box flexDirection="column" borderStyle="round" borderColor="gray" padding={1}>
					<Box marginBottom={1}>
						<Text>Session name:</Text>
					</Box>
					<Box>
						<Text color="gray">› </Text>
						<TextInput
							value={sessionName}
							onChange={setSessionName}
							placeholder="Enter session name (optional)"
							onSubmit={(name) => {
								setSessionName(name.trim());
								setLayouts(listLayouts());
								setMode('layout');
							}}
						/>
					</Box>
				</Box>
				<Box marginTop={1}>
					<Text dimColor>Press Enter to continue • Esc to cancel</Text>
				</Box>
			</Box>
		);
	}

	if (mode === 'layout') {
		const sortedLayouts = [...layouts].sort((a, b) => {
			if (a === 'default') return -1;
			if (b === 'default') return 1;
			return a.localeCompare(b);
		});

		const layoutActions: Action[] = sortedLayouts.map(layout => ({
			label: layout,
			value: layout,
			description: layout === 'default' ? 'Standard layout (recommended)' : 
			            layout === 'compact' ? 'Compact view' : 
			            layout === 'classic' ? 'Classic style' : 'Custom layout',
			action: () => createSession(sessionName || undefined, layout)
		}));

		return (
			<Box flexDirection="column" paddingY={1}>
				<Box marginBottom={1}>
					<Text bold color="cyan">
						⚡ Select Layout
					</Text>
					{sessionName && (
						<Text color="gray"> for session "{sessionName}"</Text>
					)}
				</Box>
				<Box borderStyle="round" borderColor="gray" padding={1}>
					<SelectList items={layoutActions} onSelect={handleSelect} />
				</Box>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" paddingY={1}>
			<Box marginBottom={1}>
				<Text bold color="cyan">
					⚡ Select Session
				</Text>
			</Box>
			<Box borderStyle="round" borderColor="gray" padding={1}>
				<SelectList items={actions} onSelect={handleSelect} onDelete={handleDelete} />
			</Box>
		</Box>
	);
};


export default App;