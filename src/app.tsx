import React, {useState, useEffect} from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import TextInput from 'ink-text-input';
import SelectList from './components/SelectList.js';
import ConfirmDeletePrompt from './components/ConfirmDeletePrompt.js';
import MessageDisplay from './components/MessageDisplay.js';
import {Action, SelectableItem, CreateSessionAction, SessionAction, LayoutAction, DeleteTarget, Mode, Message} from './types.js';
import {listSessions, listLayouts, isSessionActive} from './lib/zellij.js';
import {attachSession, createSession, deleteSession, forceDeleteSession} from './lib/actions.js';

const App: React.FC = () => {
	const {exit} = useApp();
	const [mode, setMode] = useState<Mode>('list');
	const [sessionName, setSessionName] = useState('');
	const [layouts, setLayouts] = useState<string[]>([]);
	const [sessionToDelete, setSessionToDelete] = useState<DeleteTarget | null>(null);
	const [message, setMessage] = useState<Message | null>(null);

	const [actions, setActions] = useState<Action[]>([]);

	useEffect(() => {
		const sessions = listSessions();
		
		// If no sessions exist, go straight to create new session
		if (sessions.length === 0) {
			setMode('input');
			return;
		}
		
		// Create session actions
		const sessionActions: SessionAction[] = sessions.map(session => ({
			type: 'action' as const,
			actionType: 'session' as const,
			label: session.label,
			description: session.isActive ? 'active' : session.created,
			action: () => attachSession(session.label),
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
			} else if (mode === 'confirm-delete') {
				setMode('list');
				setSessionToDelete(null);
			} else {
				exit();
			}
		}
	});

	const handleSelect = (item: SelectableItem) => {
		// Handle "Create Session" from search
		if (item.type === 'action' && item.actionType === 'create-session') {
			const createAction = item as CreateSessionAction;
			setSessionName(createAction.sessionName);
			setLayouts(listLayouts());
			setMode('layout');
			return;
		}
		
		// Handle "New Session" option (check for specific label)
		if (item.type === 'action' && item.actionType === 'session' && item.label === '[ + New Session ]') {
			setMode('input');
			return;
		}
		
		// Handle existing session selection
		if (item.type === 'action' && item.actionType === 'session' && item.action) {
			item.action();
			return;
		}
		
		// Fallback for other actions
		if (item.type === 'action' && item.action) {
			item.action();
		}
	};

	const handleDelete = (item: SelectableItem) => {
		if ((item.type === 'action' && item.actionType === 'session') || item.type === 'session') {
			const sessionName = item.type === 'action' ? item.label : item.label;
			
			// Check if session is active using the new isSessionActive function
			const isActive = isSessionActive(sessionName);
			
			if (isActive) {
				// Route active sessions to confirmation prompt
				setSessionToDelete({
					sessionName,
					isActive: true
				});
				setMode('confirm-delete');
			} else {
				// Handle non-active sessions with proper error handling
				const result = deleteSession(sessionName);
				
				// Display the result message
				setMessage({
					type: result.type,
					message: result.message,
					duration: 3000
				});
				
				// Clear message after duration
				setTimeout(() => setMessage(null), 3000);
				
				if (result.success) {
					// Refresh the session list only on successful deletion
					const updatedSessions = listSessions();
					const sessionActions: SessionAction[] = updatedSessions.map(session => ({
						type: 'action' as const,
						actionType: 'session' as const,
						label: session.label,
						description: session.isActive ? 'active' : session.created,
						action: () => attachSession(session.label),
						deletable: true,
					}));
					
					setActions(sessionActions);
				}
			}
		}
	};

	const handleConfirmDelete = () => {
		if (sessionToDelete) {
			// Execute force delete using the forceDeleteSession function
			const result = forceDeleteSession(sessionToDelete.sessionName);
			
			// Display the result message
			setMessage({
				type: result.type,
				message: result.message,
				duration: 3000
			});
			
			// Clear message after duration
			setTimeout(() => setMessage(null), 3000);
			
			if (result.success) {
				// Refresh the session list only on successful deletion
				const updatedSessions = listSessions();
				const sessionActions: SessionAction[] = updatedSessions.map(session => ({
					type: 'action' as const,
					actionType: 'session' as const,
					label: session.label,
					description: session.isActive ? 'active' : session.created,
					action: () => attachSession(session.label),
					deletable: true,
				}));
				
				setActions(sessionActions);
			}
			
			// Clean up state and return to list mode
			setMode('list');
			setSessionToDelete(null);
		}
	};

	const handleCancelDelete = () => {
		// Clean up state and return to list mode
		setMode('list');
		setSessionToDelete(null);
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

		const layoutActions: LayoutAction[] = sortedLayouts.map(layout => ({
			type: 'action' as const,
			actionType: 'layout' as const,
			label: layout,
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
					<SelectList items={layoutActions} onSelect={handleSelect} disableSearch={true} />
				</Box>
			</Box>
		);
	}

	if (mode === 'confirm-delete' && sessionToDelete) {
		return (
			<ConfirmDeletePrompt
				sessionName={sessionToDelete.sessionName}
				isActive={sessionToDelete.isActive}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
			/>
		);
	}

	return (
		<Box flexDirection="column" paddingY={1}>
			{message && <MessageDisplay message={message} />}
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