import { MemoryStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Card.css';

interface MemoryCardProps {
  memory: MemoryStats;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const formatBytes = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  const data = [
    {
      name: 'Memory',
      Used: memory.used,
      Free: memory.free,
      'Buff/Cache': memory.buffCache,
    },
  ];

  return (
    <div className="card">
      <h2 className="card-title">Memory Usage</h2>
      <div className="card-content">
        <div className="stat-large">
          <div className="stat-value">{memory.utilization.toFixed(1)}%</div>
          <div className="stat-label">Utilization</div>
        </div>
        <div className="stat-info">
          <div className="stat-row">
            <span className="stat-label-small">Total:</span>
            <span className="stat-value-small">{formatBytes(memory.total)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label-small">Used:</span>
            <span className="stat-value-small">{formatBytes(memory.used)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label-small">Free:</span>
            <span className="stat-value-small">{formatBytes(memory.free)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label-small">Available:</span>
            <span className="stat-value-small">{formatBytes(memory.available)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label-small">Buff/Cache:</span>
            <span className="stat-value-small">{formatBytes(memory.buffCache)}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatBytes(value)} />
            <Legend />
            <Bar dataKey="Used" fill="#667eea" />
            <Bar dataKey="Free" fill="#43e97b" />
            <Bar dataKey="Buff/Cache" fill="#f093fb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

