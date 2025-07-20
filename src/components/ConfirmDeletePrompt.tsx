import React from 'react';
import {Box, Text, useInput} from 'ink';
import {ConfirmDeletePromptProps} from '../types.js';

const ConfirmDeletePrompt: React.FC<ConfirmDeletePromptProps> = ({
	sessionName,
	isActive,
	onConfirm,
	onCancel,
}) => {
	useInput((input, key) => {
		if (key.escape || (key.ctrl && input === 'c')) {
			onCancel();
		} else if (input.toLowerCase() === 'y') {
			onConfirm();
		} else if (input.toLowerCase() === 'n') {
			onCancel();
		}
	});

	return (
		<Box flexDirection="column" paddingY={1}>
			<Box marginBottom={1}>
				<Text bold color="yellow">
					⚠️  Confirm Session Deletion
				</Text>
			</Box>
			<Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1}>
				<Box marginBottom={1}>
					<Text>
						You are about to delete session <Text bold color="cyan">'{sessionName}'</Text>.
					</Text>
				</Box>
				{isActive && (
					<Box marginBottom={1}>
						<Text color="red" bold>
							This session is currently active.
						</Text>
					</Box>
				)}
				<Box marginBottom={1}>
					<Text>
						Are you sure you want to delete it? <Text color="gray">(y/n):</Text>
					</Text>
				</Box>
			</Box>
			<Box marginTop={1}>
				<Text dimColor>
					Press 'y' to confirm, 'n' to cancel, or Esc to return
				</Text>
			</Box>
		</Box>
	);
};

export default ConfirmDeletePrompt;