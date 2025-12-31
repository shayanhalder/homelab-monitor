import { DiskIOStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Card.css';

interface DiskIOCardProps {
  diskIO: DiskIOStats[];
}

export default function DiskIOCard({ diskIO }: DiskIOCardProps) {
  const formatBytes = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(2)} KB`;
    return `${bytes.toFixed(0)} B`;
  };

  const chartData = diskIO.slice(0, 5).map((disk) => ({
    device: disk.device,
    'Read (MB)': disk.readBytes / 1e6,
    'Write (MB)': disk.writeBytes / 1e6,
  }));

  return (
    <div className="card">
      <h2 className="card-title">Disk I/O</h2>
      <div className="card-content">
        {diskIO.length === 0 ? (
          <div className="no-data">No disk I/O data available</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="device" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} MB`} />
                <Legend />
                <Bar dataKey="Read (MB)" fill="#667eea" />
                <Bar dataKey="Write (MB)" fill="#f093fb" />
              </BarChart>
            </ResponsiveContainer>
            <div className="disk-table">
              <table>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Reads</th>
                    <th>Writes</th>
                    <th>Read Bytes</th>
                    <th>Write Bytes</th>
                  </tr>
                </thead>
                <tbody>
                  {diskIO.slice(0, 5).map((disk, index) => (
                    <tr key={index}>
                      <td>{disk.device}</td>
                      <td>{disk.reads.toLocaleString()}</td>
                      <td>{disk.writes.toLocaleString()}</td>
                      <td>{formatBytes(disk.readBytes)}</td>
                      <td>{formatBytes(disk.writeBytes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

