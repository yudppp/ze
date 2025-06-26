import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {Action, SessionInfo} from '../types.js';

interface SelectListProps {
	items: (Action | SessionInfo)[];
	onSelect: (item: Action | SessionInfo) => void;
	onDelete?: (item: Action | SessionInfo) => void;
	enablePreview?: boolean;
}

const SelectList: React.FC<SelectListProps> = ({items, onSelect, onDelete, enablePreview = true}) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredItems, setFilteredItems] = useState(items);
	const [showPreview, setShowPreview] = useState(false);

	useEffect(() => {
		// Filter items based on search query
		if (searchQuery) {
			const filtered = items.filter(item => {
				const label = 'label' in item ? item.label : item.name;
				return label.toLowerCase().includes(searchQuery.toLowerCase());
			});
			setFilteredItems(filtered);
			// Reset selection if current selection is out of bounds
			if (selectedIndex >= filtered.length) {
				setSelectedIndex(Math.max(0, filtered.length - 1));
			}
		} else {
			setFilteredItems(items);
		}
	}, [searchQuery, items, selectedIndex]);

	const moveSelection = (direction: 'up' | 'down') => {
		const isSeparator = (item: Action | SessionInfo) => {
			return 'label' in item && item.label === '---';
		};

		setSelectedIndex(prev => {
			let newIndex = prev;
			const step = direction === 'up' ? -1 : 1;
			const limit = direction === 'up' ? 0 : filteredItems.length - 1;

			do {
				if ((direction === 'up' && newIndex === 0) || (direction === 'down' && newIndex === filteredItems.length - 1)) {
					break;
				}
				newIndex += step;
			} while (isSeparator(filteredItems[newIndex]) && newIndex !== limit);

			return newIndex;
		});
	};

	useInput((input, key) => {
		if (key.upArrow || input === 'k') {
			moveSelection('up');
		} else if (key.downArrow || input === 'j') {
			moveSelection('down');
		} else if (key.return) {
			if (filteredItems[selectedIndex]) {
				const item = filteredItems[selectedIndex];
				// Don't select separators
				if ('label' in item && item.label === '---') {
					return;
				}
				onSelect(item);
			}
		} else if (key.backspace) {
			setSearchQuery(prev => prev.slice(0, -1));
		} else if (key.tab && enablePreview) {
			setShowPreview(prev => !prev);
		} else if (input === 'd' && key.ctrl && onDelete) {
			// Ctrl+D to delete
			const item = filteredItems[selectedIndex];
			if (item && 'deletable' in item && item.deletable) {
				onDelete(item);
			}
		} else if (input && !key.ctrl && !key.meta && !key.shift && input !== 'j' && input !== 'k') {
			// Add character to search query
			setSearchQuery(prev => prev + input);
		}
	});

	return (
		<Box flexDirection="column">
			{searchQuery && (
				<Box marginBottom={1}>
					<Text color="gray">Search: </Text>
					<Text color="yellow">{searchQuery}</Text>
				</Box>
			)}
			{filteredItems.length === 0 && searchQuery ? (
				<Text color="gray" italic>No matches found for "{searchQuery}"</Text>
			) : (
				filteredItems.map((item, index) => {
					const isSelected = index === selectedIndex;
					const label = 'label' in item ? item.label : item.name;
					const description = 'description' in item ? item.description : 
						('windows' in item ? `${item.windows || 0} windows${item.attached ? ' (attached)' : ''}` : '');
					const metadata = 'created' in item && item.created 
						? `Created: ${new Date(item.created).toLocaleString()}`
						: null;

					const isActive = description === 'active';
					const isSeparator = label === '---';

					if (isSeparator) {
						return (
							<Box key={index}>
								<Text dimColor color="gray">  ─────────────────────────────────</Text>
							</Box>
						);
					}

					return (
						<Box key={index} flexDirection="column">
							<Box>
								<Text color={isSelected ? 'blue' : 'white'}>
									{isSelected ? '> ' : '  '}
									{label}
								</Text>
								{isActive && (
									<Text color="green"> ● </Text>
								)}
								{description && description !== 'active' && (
									<Text color="gray" dimColor> ({description})</Text>
								)}
							</Box>
							{metadata && isSelected && showPreview && (
								<Box marginLeft={4}>
									<Text color="cyan" dimColor>
										{metadata}
									</Text>
								</Box>
							)}
						</Box>
					);
				})
			)}
			<Box marginTop={1}>
				<Text color="gray" dimColor>
					↑/↓ or j/k: Navigate • Enter: Select{onDelete ? ' • Ctrl+D: Delete' : ''}{searchQuery ? ' • Backspace: Clear' : ' • Type: Search'} • Esc: Exit
				</Text>
			</Box>
		</Box>
	);
};

export default SelectList;