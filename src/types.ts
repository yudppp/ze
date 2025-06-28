export interface Action {
	label: string;
	value: string;
	description?: string;
	action?: () => void | string;
	deletable?: boolean;
	createSession?: boolean;
	sessionName?: string;
}

export interface SessionInfo {
	name: string;
	created: string;
	isActive: boolean;
}