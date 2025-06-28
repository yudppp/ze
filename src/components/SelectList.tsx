import React from 'react';
import {Box, Text, useInput} from 'ink';
import {SelectableItem} from '../types.js';
import {useIncrementalSearch} from '../hooks/useIncrementalSearch.js';
import {useSelection} from '../hooks/useSelection.js';

interface SelectListProps {
	items: SelectableItem[];
	onSelect: (item: SelectableItem) => void;
	onDelete?: (item: SelectableItem) => void;
	disableSearch?: boolean;
}


const SelectList: React.FC<SelectListProps> = ({items, onSelect, onDelete, disableSearch = false}) => {
	
	const { searchQuery, filteredItems, addChar, removeChar, clearSearch } = useIncrementalSearch(items, disableSearch);
	const { selectedIndex, currentItem, moveUp, moveDown, resetSelection } = useSelection(filteredItems);


	useInput((input, key) => {
		if (key.upArrow) {
			moveUp();
		} else if (key.downArrow) {
			moveDown();
		} else if (key.return) {
			if (currentItem) {
				// Clear search when selecting Create Session item
				if (currentItem.type === 'action' && currentItem.actionType === 'create-session') {
					clearSearch();
				}
				onSelect(currentItem);
			}
		} else if (((input === 'd' && key.ctrl) || input === '\u0004') && onDelete) {
			if (currentItem && ((currentItem.type === 'action' && 'deletable' in currentItem) || currentItem.type === 'session')) {
				onDelete(currentItem);
			}
		} else if (key.backspace || key.delete) {
			if (!disableSearch) {
				removeChar();
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
				const label = item.label;
				const description = item.type === 'action' ? (item.description || '') : '';
				const isActive = description === 'active';
				const isCreateSession = item.type === 'action' && item.actionType === 'create-session';

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
					↑/↓: Navigate • Enter: Select{onDelete ? ' • Ctrl+D: Delete' : ''}{!disableSearch ? (searchQuery ? ' • Backspace/Del: Clear' : ' • Type: Search') : ''} • Esc: Exit
				</Text>
			</Box>
		</Box>
	);
};

export default SelectList;