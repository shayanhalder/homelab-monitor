export interface CpuStats {
  user: number;
  nice: number;
  system: number;
  idle: number;
  iowait: number;
  irq: number;
  softirq: number;
  steal: number;
  guest: number;
  guestNice: number;
  utilization: number;
  idlePercent: number;
}

export interface MemoryStats {
  total: number;
  used: number;
  free: number;
  shared: number;
  buffCache: number;
  available: number;
  utilization: number;
}

export interface DiskIOStats {
  device: string;
  reads: number;
  writes: number;
  readBytes: number;
  writeBytes: number;
  readTime: number;
  writeTime: number;
}

export interface NetworkStats {
  interface: string;
  rxBytes: number;
  txBytes: number;
  rxPackets: number;
  txPackets: number;
  rxErrors: number;
  txErrors: number;
}

export interface ProcessInfo {
  pid: string;
  user: string;
  pr: string;
  ni: string;
  virt: string;
  res: string;
  shr: string;
  s: string;
  cpu: string;
  mem: string;
  time: string;
  command: string;
}

export interface SystemStats {
  cpu: CpuStats;
  memory: MemoryStats;
  diskIO: DiskIOStats[];
  network: NetworkStats[];
  topProcesses: ProcessInfo[];
  timestamp: string;
}

