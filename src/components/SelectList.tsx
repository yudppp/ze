import React, {useState, useCallback, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {Action, SessionInfo} from '../types.js';
import {useIncrementalSearch} from '../hooks/useIncrementalSearch.js';
import {useSelection} from '../hooks/useSelection.js';

interface SelectListProps {
	items: (Action | SessionInfo)[];
	onSelect: (item: Action | SessionInfo) => void;
	onDelete?: (item: Action | SessionInfo) => void;
	enablePreview?: boolean;
}

const isSeparator = (item: Action | SessionInfo) => {
	return 'label' in item && item.label === '---';
};

const SelectList: React.FC<SelectListProps> = ({items, onSelect, onDelete, enablePreview = true}) => {
	const [showPreview, setShowPreview] = useState(false);
	
	const { searchQuery, filteredItems, addChar, removeChar } = useIncrementalSearch(items);
	const { selectedIndex, currentItem, moveUp, moveDown, resetSelection } = useSelection(filteredItems);

	// Reset selection when starting new search
	useEffect(() => {
		if (searchQuery && selectedIndex === 0) {
			resetSelection();
		}
	}, [searchQuery, resetSelection, selectedIndex]);


	useInput((input, key) => {
		if (key.upArrow || (input === 'k' && key.ctrl)) {
			moveUp();
		} else if (key.downArrow || (input === 'j' && key.ctrl)) {
			moveDown();
		} else if (key.return) {
			if (currentItem && !isSeparator(currentItem)) {
				onSelect(currentItem);
			}
		} else if (key.backspace || key.delete) {
			removeChar();
		} else if (key.tab && enablePreview) {
			setShowPreview(prev => !prev);
		} else if ((input === 'd' && key.ctrl) && onDelete) {
			if (currentItem && 'deletable' in currentItem && currentItem.deletable) {
				onDelete(currentItem);
			}
		} else if (input && !key.ctrl && !key.meta && !key.shift) {
			addChar(input);
			resetSelection();
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
					↑/↓ or Ctrl+j/k: Navigate • Enter: Select{onDelete ? ' • Ctrl+D: Delete' : ''}{searchQuery ? ' • Backspace/Del: Clear' : ' • Type: Search'} • Esc: Exit
				</Text>
			</Box>
		</Box>
	);
};

export default SelectList;