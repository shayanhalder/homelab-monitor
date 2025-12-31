import { CpuStats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './Card.css';

interface CpuCardProps {
  cpu: CpuStats;
}

export default function CpuCard({ cpu }: CpuCardProps) {
  const data = [
    { name: 'User', value: parseFloat(cpu.user.toFixed(2)) },
    { name: 'System', value: parseFloat(cpu.system.toFixed(2)) },
    { name: 'I/O Wait', value: parseFloat(cpu.iowait.toFixed(2)) },
    { name: 'Idle', value: parseFloat(cpu.idlePercent.toFixed(2)) },
  ];

  const COLORS = ['#667eea', '#f093fb', '#4facfe', '#43e97b'];

  return (
    <div className="card">
      <h2 className="card-title">CPU Utilization</h2>
      <div className="card-content">
        <div className="stat-large">
          <div className="stat-value">{cpu.utilization.toFixed(1)}%</div>
          <div className="stat-label">Total Utilization</div>
        </div>
        <div className="stat-large">
          <div className="stat-value">{cpu.idlePercent.toFixed(1)}%</div>
          <div className="stat-label">Idle</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="stat-grid">
          <div className="stat-item">
            <span className="stat-label-small">User:</span>
            <span className="stat-value-small">{cpu.user.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label-small">System:</span>
            <span className="stat-value-small">{cpu.system.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label-small">I/O Wait:</span>
            <span className="stat-value-small">{cpu.iowait.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label-small">Nice:</span>
            <span className="stat-value-small">{cpu.nice.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

