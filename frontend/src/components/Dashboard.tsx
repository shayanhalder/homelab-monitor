import { SystemStats } from '../types';
import CpuCard from './CpuCard';
import MemoryCard from './MemoryCard';
import DiskIOCard from './DiskIOCard';
import NetworkCard from './NetworkCard';
import ProcessTable from './ProcessTable';
import './Dashboard.css';

interface DashboardProps {
  stats: SystemStats;
}

export default function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏠 Homelab Server Monitor</h1>
        <div className="timestamp">
          Last updated: {new Date(stats.timestamp).toLocaleTimeString()}
        </div>
      </header>
      
      <div className="dashboard-grid">
        <div className="grid-item">
          <CpuCard cpu={stats.cpu} />
        </div>
        
        <div className="grid-item">
          <MemoryCard memory={stats.memory} />
        </div>
        
        <div className="grid-item grid-item-wide">
          <DiskIOCard diskIO={stats.diskIO} />
        </div>
        
        <div className="grid-item grid-item-wide">
          <NetworkCard network={stats.network} />
        </div>
        
        <div className="grid-item grid-item-full">
          <ProcessTable processes={stats.topProcesses} />
        </div>
      </div>
    </div>
  );
}

