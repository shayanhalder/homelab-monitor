import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runCommand(command: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout: 10000, // 10 second timeout
    });
    
    if (stderr && !stderr.includes('Warning')) {
      throw new Error(stderr);
    }
    
    return stdout.trim();
  } catch (error: any) {
    if (error.code === 'ETIMEDOUT') {
      throw new Error(`Command timed out: ${command}`);
    }
    throw error;
  }
}

