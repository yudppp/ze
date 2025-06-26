export interface Action {
	label: string;
	value: string;
	description?: string;
	action?: () => void | string;
	deletable?: boolean;
}

export interface SessionInfo {
	id: string;
	name: string;
	windows?: number;
	attached?: boolean;
	created: string;
	isActive: boolean;
}

export type Context = 'zellij' | 'tmux' | 'git' | 'ssh' | 'default' | 'loading';

export interface Config {
	defaultContext?: Context;
	shortcuts?: Record<string, string>;
	theme?: {
		primaryColor?: string;
		highlightColor?: string;
	};
}