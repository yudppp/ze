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

export function deleteSession(sessionName: string): { success: boolean; message: string; type: 'success' | 'error' } {
  const currentSession = getCurrentSessionName();
  if (currentSession === sessionName) {
    return {
      success: false,
      message: 'Cannot delete the current session',
      type: 'error'
    };
  }
  
  try {
    execSync(`zellij delete-session ${sessionName}`, { 
      stdio: 'pipe', 
      timeout: 10000,
      encoding: 'utf8'
    });
    return {
      success: true,
      message: `Session '${sessionName}' deleted successfully`,
      type: 'success'
    };
  } catch (error) {
    // Handle different types of errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      // Check for timeout errors
      if (errorMessage.includes('timeout') || errorMessage.includes('killed')) {
        return {
          success: false,
          message: `Zellij is not responding (timeout). Failed to delete session: ${sessionName}`,
          type: 'error'
        };
      }
      
      // Check if session doesn't exist
      if (errorMessage.includes('not found') || 
          errorMessage.includes('does not exist') ||
          errorMessage.includes('no such session') ||
          errorMessage.includes('session not found')) {
        return {
          success: false,
          message: `Session '${sessionName}' does not exist`,
          type: 'error'
        };
      }
      
      // Check if Zellij is not installed or not in PATH
      if (errorMessage.includes('command not found') || 
          errorMessage.includes('enoent') ||
          errorMessage.includes('no such file')) {
        return {
          success: false,
          message: `Zellij is not installed or not in PATH`,
          type: 'error'
        };
      }
      
      // Check for permission errors
      if (errorMessage.includes('permission denied') || errorMessage.includes('access denied')) {
        return {
          success: false,
          message: `Permission denied. Cannot delete session: ${sessionName}`,
          type: 'error'
        };
      }
      
      // Check for session in use errors
      if (errorMessage.includes('in use') || errorMessage.includes('active') || errorMessage.includes('attached')) {
        return {
          success: false,
          message: `Session '${sessionName}' is currently in use and cannot be deleted`,
          type: 'error'
        };
      }
      
      // Generic error with the actual error message if available
      const cleanErrorMessage = error.message.replace(/Command failed:.*?\n/, '').trim();
      return {
        success: false,
        message: cleanErrorMessage || `Failed to delete session: ${sessionName}`,
        type: 'error'
      };
    } else {
      return {
        success: false,
        message: `Failed to delete session: ${sessionName}`,
        type: 'error'
      };
    }
  }
}

export function forceDeleteSession(sessionName: string): { success: boolean; message: string; type: 'success' | 'error' } {
  try {
    execSync(`zellij kill-session ${sessionName}`, { 
      stdio: 'pipe', 
      timeout: 10000,
      encoding: 'utf8'
    });
    return {
      success: true,
      message: `Session '${sessionName}' force deleted successfully`,
      type: 'success'
    };
  } catch (error) {
    // Handle different types of errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      // Check for timeout errors
      if (errorMessage.includes('timeout') || errorMessage.includes('killed')) {
        return {
          success: false,
          message: `Zellij is not responding (timeout). Failed to force delete session: ${sessionName}`,
          type: 'error'
        };
      }
      
      // Check if session doesn't exist
      if (errorMessage.includes('not found') || 
          errorMessage.includes('does not exist') ||
          errorMessage.includes('no such session') ||
          errorMessage.includes('session not found')) {
        return {
          success: false,
          message: `Session '${sessionName}' does not exist`,
          type: 'error'
        };
      }
      
      // Check if Zellij is not installed or not in PATH
      if (errorMessage.includes('command not found') || 
          errorMessage.includes('enoent') ||
          errorMessage.includes('no such file')) {
        return {
          success: false,
          message: `Zellij is not installed or not in PATH`,
          type: 'error'
        };
      }
      
      // Check for permission errors
      if (errorMessage.includes('permission denied') || errorMessage.includes('access denied')) {
        return {
          success: false,
          message: `Permission denied. Cannot force delete session: ${sessionName}`,
          type: 'error'
        };
      }
      
      // Check for session already terminated errors
      if (errorMessage.includes('already terminated') || 
          errorMessage.includes('not running') ||
          errorMessage.includes('already dead')) {
        return {
          success: false,
          message: `Session '${sessionName}' is already terminated`,
          type: 'error'
        };
      }
      
      // Check for force delete specific errors
      if (errorMessage.includes('cannot kill') || errorMessage.includes('kill failed')) {
        return {
          success: false,
          message: `Cannot force delete session '${sessionName}'. Session may be protected or in a critical state`,
          type: 'error'
        };
      }
      
      // Generic error with the actual error message if available
      const cleanErrorMessage = error.message.replace(/Command failed:.*?\n/, '').trim();
      return {
        success: false,
        message: cleanErrorMessage || `Failed to force delete session: ${sessionName}`,
        type: 'error'
      };
    } else {
      return {
        success: false,
        message: `Failed to force delete session: ${sessionName}`,
        type: 'error'
      };
    }
  }
}

