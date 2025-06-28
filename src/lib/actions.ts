import { execSync, spawnSync } from 'child_process';
import { isInsideZellij, getCurrentSessionName } from './zellij.js';

// Session Actions
export function attachSession(sessionName: string): void {
  if (isInsideZellij()) {
    throw new Error('Cannot attach to a session from within Zellij');
  }
  
  try {
    // Use spawnSync to run zellij synchronously with direct stdio inheritance
    // This replaces the current process's stdio
    const result = spawnSync('zellij', ['attach', sessionName], {
      stdio: 'inherit',
      shell: false
    });
    
    // Force exit regardless of the result
    // This ensures ze doesn't continue running
    process.exit(result.status ?? 0);
  } catch (error) {
    console.error(`Failed to attach to session: ${sessionName}`);
    process.exit(1);
  }
}

export function createSession(sessionName?: string, layout?: string): void {
  const args: string[] = [];
  
  if (layout && layout !== 'default') {
    // Use -n for new session with layout
    args.push('-n', layout);
    if (sessionName) {
      args.push('-s', sessionName);
    }
  } else if (sessionName) {
    // Use -s for creating new session without specific layout
    args.push('-s', sessionName);
  }
    
  try {
    // Use spawnSync to run zellij synchronously with direct stdio inheritance
    // This replaces the current process's stdio
    const result = spawnSync('zellij', args, {
      stdio: 'inherit',
      shell: false
    });
    
    // Force exit regardless of the result
    // This ensures ze doesn't continue running
    process.exit(result.status ?? 0);
  } catch (error) {
    console.error(`Failed to create session${sessionName ? `: ${sessionName}` : ''}`);
    process.exit(1);
  }
}

export function deleteSession(sessionName: string): void {
  const currentSession = getCurrentSessionName();
  if (currentSession === sessionName) {
    throw new Error('Cannot delete the current session');
  }
  
  try {
    execSync(`zellij delete-session ${sessionName}`, { stdio: 'inherit' });
    console.log(`Session '${sessionName}' deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete session: ${sessionName}`);
    process.exit(1);
  }
}

