import { NetworkStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Card.css';

interface NetworkCardProps {
  network: NetworkStats[];
}

export default function NetworkCard({ network }: NetworkCardProps) {
  const formatBytes = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(2)} KB`;
    return `${bytes.toFixed(0)} B`;
  };

  // Filter out loopback and only show active interfaces
  const activeInterfaces = network
    .filter((iface) => !iface.interface.startsWith('lo') && (iface.rxBytes > 0 || iface.txBytes > 0))
    .slice(0, 5);

  const chartData = activeInterfaces.map((iface) => ({
    interface: iface.interface,
    'RX (MB)': iface.rxBytes / 1e6,
    'TX (MB)': iface.txBytes / 1e6,
  }));

  return (
    <div className="card">
      <h2 className="card-title">Network Traffic</h2>
      <div className="card-content">
        {activeInterfaces.length === 0 ? (
          <div className="no-data">No network data available</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="interface" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} MB`} />
                <Legend />
                <Bar dataKey="RX (MB)" fill="#667eea" />
                <Bar dataKey="TX (MB)" fill="#43e97b" />
              </BarChart>
            </ResponsiveContainer>
            <div className="network-table">
              <table>
                <thead>
                  <tr>
                    <th>Interface</th>
                    <th>RX Bytes</th>
                    <th>TX Bytes</th>
                    <th>RX Packets</th>
                    <th>TX Packets</th>
                    <th>RX Errors</th>
                    <th>TX Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInterfaces.map((iface, index) => (
                    <tr key={index}>
                      <td>{iface.interface}</td>
                      <td>{formatBytes(iface.rxBytes)}</td>
                      <td>{formatBytes(iface.txBytes)}</td>
                      <td>{iface.rxPackets.toLocaleString()}</td>
                      <td>{iface.txPackets.toLocaleString()}</td>
                      <td>{iface.rxErrors}</td>
                      <td>{iface.txErrors}</td>
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

