import { execSync } from 'child_process';
import { SessionInfo } from '../types';

export function isInsideZellij(): boolean {
  return !!process.env.ZELLIJ;
}

export function getCurrentSessionName(): string | null {
  return process.env.ZELLIJ_SESSION_NAME || null;
}

export function listSessions(): SessionInfo[] {
  try {
    const output = execSync('zellij list-sessions', { encoding: 'utf8' });
    const lines = output.trim().split('\n').filter(line => line.trim());
    
    return lines.map(line => {
      // Remove ANSI color codes
      const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '');
      
      // Parse session info from zellij output
      // Format example: "hello [Created 46m 29s ago] (EXITED - attach to resurrect)"
      // or "session_name"
      const match = cleanLine.match(/^(\S+)(?:\s+\[Created\s+(.+?)\s+ago\])?(?:\s+\((.+)\))?/);
      if (!match) return null;
      
      const name = match[1];
      const createdTime = match[2] || '';
      const status = match[3] || 'active';
      
      // Extract time info
      let timeInfo = createdTime || 'active';
      
      return {
        type: 'session' as const,
        label: name,
        created: timeInfo,
        isActive: !status.includes('EXITED')
      };
    }).filter(Boolean) as SessionInfo[];
  } catch (error) {
    return [];
  }
}


export function listLayouts(): string[] {
  try {
    // Get list of available layouts
    // Zellij stores layouts in ~/.config/zellij/layouts/
    const layoutDir = `${process.env.HOME}/.config/zellij/layouts`;
    const builtinLayouts = ['default', 'compact', 'classic'];
    
    try {
      const customLayoutFiles = execSync(`ls ${layoutDir} 2>/dev/null | grep -E '\\.kdl$' | sed 's/\\.kdl$//'`, { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(name => name);
      
      return [...builtinLayouts, ...customLayoutFiles];
    } catch {
      // If custom layouts directory doesn't exist, return only builtin layouts
      return builtinLayouts;
    }
  } catch (error) {
    return ['default', 'compact', 'classic'];
  }
}
