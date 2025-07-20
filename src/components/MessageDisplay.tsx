import React from 'react';
import {Box, Text} from 'ink';
import {Message} from '../types.js';

interface MessageDisplayProps {
	message: Message;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({message}) => {
	const getIcon = (type: Message['type']) => {
		switch (type) {
			case 'success':
				return '✓';
			case 'error':
				return '✗';
			case 'warning':
				return '⚠️';
			case 'info':
				return 'ℹ️';
			default:
				return '';
		}
	};

	const getColor = (type: Message['type']) => {
		switch (type) {
			case 'success':
				return 'green';
			case 'error':
				return 'red';
			case 'warning':
				return 'yellow';
			case 'info':
				return 'blue';
			default:
				return 'white';
		}
	};

	return (
		<Box marginBottom={1}>
			<Text color={getColor(message.type)}>
				{getIcon(message.type)} {message.message}
			</Text>
		</Box>
	);
};

export default MessageDisplay;