import React, {useState, useEffect} from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import TextInput from 'ink-text-input';
import SelectList from './components/SelectList.js';
import {Action, SessionInfo, Context} from './types.js';
import {isInsideZellij, listSessions, getCurrentSessionName, listLayouts} from './lib/zellij.js';
import {attachSession, createSession, deleteSession} from './lib/actions.js';


const App: React.FC = () => {
	const {exit} = useApp();
	const [context, setContext] = useState<Context>('zellij');
	const [actions, setActions] = useState<Action[]>([]);
	const [sessions] = useState<SessionInfo[]>([]);
	const [isZellij, setIsZellij] = useState(false);
	const [showNameInput, setShowNameInput] = useState(false);
	const [newSessionName, setNewSessionName] = useState('');
	const [showLayoutSelect, setShowLayoutSelect] = useState(false);
	const [availableLayouts, setAvailableLayouts] = useState<string[]>([]);

	useEffect(() => {
		// Determine context based on current environment
		const determineContext = async () => {
			// Check if we're in a Zellij session
			const inZellij = isInsideZellij();
			setIsZellij(inZellij);
			
			if (inZellij) {
				getCurrentSessionName(); // Just to verify we're in a session
			}
			
			// Get Zellij sessions
			const zellijSessions = listSessions();
			setContext('zellij');
			
			// If no sessions exist and we're not inside Zellij, go straight to create new session
			if (!inZellij && zellijSessions.length === 0) {
				setShowNameInput(true);
				setShowLayoutSelect(true);
				return;
			}
			
			if (inZellij) {
				// Inside Zellij - show exit option only
				setActions([
					{label: 'Exit', value: 'exit', action: () => exit()},
				]);
			} else {
				// Outside Zellij - ALWAYS show session list
				const sessionActions: Action[] = zellijSessions.map(session => ({
					label: session.name,
					value: session.name,
					description: session.isActive ? 'active' : session.created,
					action: () => { 
						attachSession(session.name);
					},
					deletable: true,
				}));
				
				sessionActions.push({
					label: '[ + New Session ]',
					value: 'new-session',
					description: '',
					action: () => { 
						// Show name input for new session
						setShowNameInput(true);
						setShowLayoutSelect(true); // Always allow layout selection
						return; // Don't exit
					},
					deletable: false,
				});
				
				setActions(sessionActions);
			}
		};

		determineContext();
	}, [exit]);

	useInput((input, key) => {
		if (key.escape || (key.ctrl && input === 'c')) {
			if (showLayoutSelect) {
				setShowLayoutSelect(false);
				setShowNameInput(true);
			} else if (showNameInput) {
				setShowNameInput(false);
				setNewSessionName('');
			} else {
				exit();
			}
		}
	});

	const handleSelect = (item: Action | SessionInfo) => {
		if ('action' in item && item.action) {
			item.action();
		}
	};

	const handleDelete = (item: Action | SessionInfo) => {
		if ('value' in item && item.value !== 'new-session' && item.value !== 'separator') {
			// Delete the session
			deleteSession(item.value);
			// Refresh the session list
			const updatedSessions = listSessions();
			const sessionActions: Action[] = updatedSessions.map(session => ({
				label: session.name,
				value: session.name,
				description: session.isActive ? 'active' : session.created,
				action: () => { 
					attachSession(session.name);
				},
				deletable: true,
			}));
			
			sessionActions.push({
				label: '[ + New Session ]',
				value: 'new-session',
				description: '',
				action: () => { 
					// Show name input for new session
					setShowNameInput(true);
					setShowLayoutSelect(true); // Always allow layout selection
					return; // Don't exit
				},
				deletable: false,
			});
			
			setActions(sessionActions);
		}
	};

	const items = context === 'tmux' ? sessions : actions;

	if (showNameInput) {
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
							value={newSessionName}
							onChange={setNewSessionName}
							placeholder="Enter session name (optional)"
							onSubmit={(name) => {
								const sessionName = name.trim() || '';
								setNewSessionName(sessionName);
								
								// Always go to layout selection
								const layouts = listLayouts();
								setAvailableLayouts(layouts);
								setShowNameInput(false);
								setShowLayoutSelect(true);
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

	if (showLayoutSelect) {
		// Put default layout first
		const sortedLayouts = [...availableLayouts].sort((a, b) => {
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
			action: () => {
				createSession(newSessionName || undefined, layout);
			}
		}));

		return (
			<Box flexDirection="column" paddingY={1}>
				<Box marginBottom={1}>
					<Text bold color="cyan">
						⚡ Select Layout
					</Text>
					{newSessionName && (
						<Text color="gray"> for session "{newSessionName}"</Text>
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
					⚡ {isZellij ? 'Zellij Session' : 'Select Session'}
				</Text>
			</Box>
			<Box borderStyle="round" borderColor="gray" padding={1}>
				<SelectList items={items} onSelect={handleSelect} onDelete={isZellij ? undefined : handleDelete} />
			</Box>
		</Box>
	);
};


export default App;