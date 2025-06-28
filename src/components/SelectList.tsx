import React from 'react';
import {Box, Text, useInput} from 'ink';
import {Action, SessionInfo} from '../types.js';
import {useIncrementalSearch} from '../hooks/useIncrementalSearch.js';
import {useSelection} from '../hooks/useSelection.js';

interface SelectListProps {
	items: (Action | SessionInfo)[];
	onSelect: (item: Action | SessionInfo) => void;
	onDelete?: (item: Action | SessionInfo) => void;
	disableSearch?: boolean;
}


const SelectList: React.FC<SelectListProps> = ({items, onSelect, onDelete, disableSearch = false}) => {
	
	const { searchQuery, filteredItems, addChar, removeChar, clearSearch } = useIncrementalSearch(items, disableSearch);
	const { selectedIndex, currentItem, moveUp, moveDown, resetSelection } = useSelection(filteredItems);


	useInput((input, key) => {
		if (key.upArrow || (input === 'k' && key.ctrl)) {
			moveUp();
		} else if (key.downArrow || (input === 'j' && key.ctrl)) {
			moveDown();
		} else if (key.return) {
			if (currentItem) {
				// Clear search when selecting Create Session item
				if ('createSession' in currentItem && currentItem.createSession) {
					clearSearch();
				}
				onSelect(currentItem);
			}
		} else if (key.backspace || key.delete) {
			if (!disableSearch) {
				removeChar();
			}
		} else if ((input === 'd' && key.ctrl) && onDelete) {
			if (currentItem && 'deletable' in currentItem && currentItem.deletable) {
				onDelete(currentItem);
			}
		} else if (input && !key.ctrl && !key.meta && !key.shift) {
			if (!disableSearch) {
				addChar(input);
				resetSelection();
			}
		}
	});


	return (
		<Box flexDirection="column">
			{searchQuery && !disableSearch && (
				<Box marginBottom={1}>
					<Text color="gray">Search: </Text>
					<Text color="yellow">{searchQuery}</Text>
				</Box>
			)}
			{filteredItems.map((item, index) => {
				const isSelected = index === selectedIndex;
				const label = 'label' in item ? item.label : item.name;
				const description = 'description' in item ? item.description : '';
				const isActive = description === 'active';
				const isCreateSession = 'createSession' in item && item.createSession;

				return (
					<Box key={index}>
						<Text color={isSelected ? (isCreateSession ? 'green' : 'blue') : (isCreateSession ? 'green' : 'white')}>
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
				);
			})}
			<Box marginTop={1}>
				<Text color="gray" dimColor>
					↑/↓ or Ctrl+j/k: Navigate • Enter: Select{onDelete ? ' • Ctrl+D: Delete' : ''}{!disableSearch ? (searchQuery ? ' • Backspace/Del: Clear' : ' • Type: Search') : ''} • Esc: Exit
				</Text>
			</Box>
		</Box>
	);
};

export default SelectList;