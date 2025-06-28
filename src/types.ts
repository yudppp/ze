export type ActionType = 'create-session' | 'session' | 'layout';

export interface CreateSessionAction {
	type: 'action';
	actionType: 'create-session';
	label: string;
	description?: string;
	action?: () => void | string;
	createSession: true;
	sessionName: string;
}

export interface SessionAction {
	type: 'action';
	actionType: 'session';
	label: string;
	description?: string;
	action?: () => void | string;
	deletable?: true;
}

export interface LayoutAction {
	type: 'action';
	actionType: 'layout';
	label: string;
	description?: string;
	action?: () => void | string;
}

export type Action = CreateSessionAction | SessionAction | LayoutAction;

export interface SessionInfo {
	type: 'session';
	label: string;
	created: string;
	isActive: boolean;
}

export type SelectableItem = Action | SessionInfo;