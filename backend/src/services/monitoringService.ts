import { runCommand } from '../utils/commandRunner';
import {
  CpuStats,
  MemoryStats,
  DiskIOStats,
  NetworkStats,
  ProcessInfo,
  SystemStats,
} from '../types';

export class MonitoringService {
  async getCpuStats(): Promise<CpuStats> {
    try {
      // Try mpstat first (most accurate)
      const output = await runCommand('mpstat 1 1 2>/dev/null | tail -1');
      const parts = output.trim().split(/\s+/);
      
      // mpstat output format: CPU %usr %nice %sys %iowait %irq %soft %steal %guest %gnice %idle
      if (parts.length >= 12) {
        const user = parseFloat(parts[2]) || 0;
        const nice = parseFloat(parts[3]) || 0;
        const system = parseFloat(parts[4]) || 0;
        const iowait = parseFloat(parts[5]) || 0;
        const irq = parseFloat(parts[6]) || 0;
        const softirq = parseFloat(parts[7]) || 0;
        const steal = parseFloat(parts[8]) || 0;
        const guest = parseFloat(parts[9]) || 0;
        const guestNice = parseFloat(parts[10]) || 0;
        const idle = parseFloat(parts[11]) || 0;
        
        const utilization = 100 - idle;
        
        return {
          user,
          nice,
          system,
          idle,
          iowait,
          irq,
          softirq,
          steal,
          guest,
          guestNice,
          utilization,
          idlePercent: idle,
        };
      }
    } catch (error) {
      // Try sar as fallback
      try {
        return await this.getCpuStatsFromSar();
      } catch (sarError) {
        // Fallback to parsing /proc/stat
        return this.getCpuStatsFromProc();
      }
    }
    return this.getCpuStatsFromProc();
  }

  private async getCpuStatsFromSar(): Promise<CpuStats> {
    // sar -u 1 1 gives CPU utilization
    const output = await runCommand('sar -u 1 1 2>/dev/null | tail -1');
    const parts = output.trim().split(/\s+/);
    
    if (parts.length >= 9) {
      const user = parseFloat(parts[2]) || 0;
      const nice = parseFloat(parts[3]) || 0;
      const system = parseFloat(parts[4]) || 0;
      const iowait = parseFloat(parts[5]) || 0;
      const steal = parseFloat(parts[6]) || 0;
      const idle = parseFloat(parts[7]) || 0;
      
      const utilization = 100 - idle;
      
      return {
        user,
        nice,
        system,
        idle,
        iowait,
        irq: 0,
        softirq: 0,
        steal,
        guest: 0,
        guestNice: 0,
        utilization,
        idlePercent: idle,
      };
    }
    throw new Error('Failed to parse sar output');
  }

  private async getCpuStatsFromProc(): Promise<CpuStats> {
    const output = await runCommand("cat /proc/stat | grep '^cpu '");
    const parts = output.trim().split(/\s+/);
    
    const user = parseFloat(parts[1]) || 0;
    const nice = parseFloat(parts[2]) || 0;
    const system = parseFloat(parts[3]) || 0;
    const idle = parseFloat(parts[4]) || 0;
    const iowait = parseFloat(parts[5]) || 0;
    const irq = parseFloat(parts[6]) || 0;
    const softirq = parseFloat(parts[7]) || 0;
    const steal = parseFloat(parts[8]) || 0;
    const guest = parseFloat(parts[9]) || 0;
    const guestNice = parseFloat(parts[10]) || 0;
    
    const total = user + nice + system + idle + iowait + irq + softirq + steal;
    const idlePercent = total > 0 ? (idle / total) * 100 : 0;
    const utilization = 100 - idlePercent;
    
    return {
      user: (user / total) * 100,
      nice: (nice / total) * 100,
      system: (system / total) * 100,
      idle: idlePercent,
      iowait: (iowait / total) * 100,
      irq: (irq / total) * 100,
      softirq: (softirq / total) * 100,
      steal: (steal / total) * 100,
      guest: (guest / total) * 100,
      guestNice: (guestNice / total) * 100,
      utilization,
      idlePercent,
    };
  }

  async getMemoryStats(): Promise<MemoryStats> {
    try {
      // Try free command first
      const output = await runCommand('free -m');
      const lines = output.split('\n');
      const memLine = lines[1].split(/\s+/).filter(Boolean);
      
      const total = parseFloat(memLine[1]) || 0;
      const used = parseFloat(memLine[2]) || 0;
      const free = parseFloat(memLine[3]) || 0;
      const shared = parseFloat(memLine[4]) || 0;
      const buffCache = parseFloat(memLine[5]) || 0;
      const available = parseFloat(memLine[6]) || 0;
      
      const utilization = total > 0 ? (used / total) * 100 : 0;
      
      return {
        total,
        used,
        free,
        shared,
        buffCache,
        available,
        utilization,
      };
    } catch (error) {
      // Fallback to vmstat
      return await this.getMemoryStatsFromVmstat();
    }
  }

  private async getMemoryStatsFromVmstat(): Promise<MemoryStats> {
    // vmstat -s gives memory statistics
    const output = await runCommand('vmstat -s');
    const lines = output.split('\n');
    
    let total = 0;
    let free = 0;
    let used = 0;
    let buffCache = 0;
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const value = parseFloat(parts[0]);
        const unit = parts[1].toLowerCase();
        const label = parts.slice(2).join(' ').toLowerCase();
        
        // Convert to MB
        let valueInMB = value;
        if (unit === 'k') valueInMB = value / 1024;
        else if (unit === 'g') valueInMB = value * 1024;
        
        if (label.includes('total memory')) total = valueInMB;
        else if (label.includes('free memory')) free = valueInMB;
        else if (label.includes('buffer')) buffCache += valueInMB;
        else if (label.includes('cache')) buffCache += valueInMB;
      }
    }
    
    used = total - free - buffCache;
    const available = free;
    const utilization = total > 0 ? (used / total) * 100 : 0;
    
    return {
      total,
      used,
      free,
      shared: 0,
      buffCache,
      available,
      utilization,
    };
  }

  async getDiskIOStats(): Promise<DiskIOStats[]> {
    try {
      // Try iostat first
      const output = await runCommand('iostat -x 1 1 2>/dev/null || iostat -d 1 1');
      const lines = output.split('\n');
      const stats: DiskIOStats[] = [];
      
      for (let i = 3; i < lines.length; i++) {
        const parts = lines[i].trim().split(/\s+/);
        if (parts.length >= 6 && parts[0] !== 'Device' && !parts[0].startsWith('Linux')) {
          stats.push({
            device: parts[0],
            reads: parseFloat(parts[1]) || 0,
            writes: parseFloat(parts[2]) || 0,
            readBytes: parseFloat(parts[3]) || 0,
            writeBytes: parseFloat(parts[4]) || 0,
            readTime: parseFloat(parts[5]) || 0,
            writeTime: parseFloat(parts[6]) || 0,
          });
        }
      }
      
      return stats.length > 0 ? stats : await this.getDiskIOFromProc();
    } catch (error) {
      return this.getDiskIOFromProc();
    }
  }

  private async getDiskIOFromProc(): Promise<DiskIOStats[]> {
    const output = await runCommand('cat /proc/diskstats');
    const lines = output.split('\n');
    const stats: DiskIOStats[] = [];
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 14) {
        const device = parts[2];
        // Skip loop and ram devices
        if (!device.startsWith('loop') && !device.startsWith('ram')) {
          stats.push({
            device,
            reads: parseFloat(parts[3]) || 0,
            writes: parseFloat(parts[7]) || 0,
            readBytes: (parseFloat(parts[5]) || 0) * 512, // Convert sectors to bytes
            writeBytes: (parseFloat(parts[9]) || 0) * 512,
            readTime: parseFloat(parts[6]) || 0,
            writeTime: parseFloat(parts[10]) || 0,
          });
        }
      }
    }
    
    return stats;
  }

  async getNetworkStats(): Promise<NetworkStats[]> {
    const output = await runCommand('cat /proc/net/dev');
    const lines = output.split('\n');
    const stats: NetworkStats[] = [];
    
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const iface = match[1];
        const parts = match[2].split(/\s+/).filter(Boolean);
        
        if (parts.length >= 16) {
          stats.push({
            interface: iface,
            rxBytes: parseFloat(parts[0]) || 0,
            txBytes: parseFloat(parts[8]) || 0,
            rxPackets: parseFloat(parts[1]) || 0,
            txPackets: parseFloat(parts[9]) || 0,
            rxErrors: parseFloat(parts[2]) || 0,
            txErrors: parseFloat(parts[10]) || 0,
          });
        }
      }
    }
    
    return stats;
  }

  async getTopProcesses(limit: number = 10): Promise<ProcessInfo[]> {
    try {
      // Use top command in batch mode
      const output = await runCommand(`top -bn1 -o %CPU | head -n ${limit + 7}`);
      const lines = output.split('\n');
      const processes: ProcessInfo[] = [];
      
      // Find the header line and process data lines
      let foundHeader = false;
      for (const line of lines) {
        if (line.includes('PID') && line.includes('USER') && line.includes('%CPU')) {
          foundHeader = true;
          continue;
        }
        
        if (foundHeader) {
          const parts = line.trim().split(/\s+/);
          // top output: PID USER PR NI VIRT RES SHR S %CPU %MEM TIME+ COMMAND
          if (parts.length >= 12) {
            processes.push({
              pid: parts[0],
              user: parts[1],
              pr: parts[2],
              ni: parts[3],
              virt: parts[4],
              res: parts[5],
              shr: parts[6],
              s: parts[7],
              cpu: parts[8],
              mem: parts[9],
              time: parts[10],
              command: parts.slice(11).join(' '),
            });
            
            if (processes.length >= limit) break;
          }
        }
      }
      
      return processes;
    } catch (error) {
      // Fallback: use ps command
      return await this.getTopProcessesFromPs(limit);
    }
  }

  private async getTopProcessesFromPs(limit: number): Promise<ProcessInfo[]> {
    const output = await runCommand(
      `ps aux --sort=-%cpu | head -n ${limit + 1} | tail -n ${limit}`
    );
    const lines = output.split('\n');
    const processes: ProcessInfo[] = [];
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 11) {
        processes.push({
          pid: parts[1],
          user: parts[0],
          pr: '-',
          ni: '-',
          virt: parts[4],
          res: parts[5],
          shr: '-',
          s: parts[7],
          cpu: parts[2],
          mem: parts[3],
          time: parts[9],
          command: parts.slice(10).join(' '),
        });
      }
    }
    
    return processes;
  }

  async getAllStats(): Promise<SystemStats> {
    const [cpu, memory, diskIO, network, topProcesses] = await Promise.all([
      this.getCpuStats(),
      this.getMemoryStats(),
      this.getDiskIOStats(),
      this.getNetworkStats(),
      this.getTopProcesses(10),
    ]);
    
    return {
      cpu,
      memory,
      diskIO,
      network,
      topProcesses,
      timestamp: new Date().toISOString(),
    };
  }
}

