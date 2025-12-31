import { ProcessInfo } from '../types';
import './Card.css';

interface ProcessTableProps {
  processes: ProcessInfo[];
}

export default function ProcessTable({ processes }: ProcessTableProps) {
  return (
    <div className="card">
      <h2 className="card-title">Top Processes</h2>
      <div className="card-content">
        {processes.length === 0 ? (
          <div className="no-data">No process data available</div>
        ) : (
          <div className="process-table">
            <table>
              <thead>
                <tr>
                  <th>PID</th>
                  <th>User</th>
                  <th>CPU %</th>
                  <th>Memory %</th>
                  <th>VIRT</th>
                  <th>RES</th>
                  <th>Time</th>
                  <th>Command</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process, index) => (
                  <tr key={index}>
                    <td>{process.pid}</td>
                    <td>{process.user}</td>
                    <td>
                      <span className={`cpu-badge ${parseFloat(process.cpu) > 50 ? 'high' : parseFloat(process.cpu) > 20 ? 'medium' : 'low'}`}>
                        {process.cpu}%
                      </span>
                    </td>
                    <td>{process.mem}%</td>
                    <td>{process.virt}</td>
                    <td>{process.res}</td>
                    <td>{process.time}</td>
                    <td className="command-cell" title={process.command}>
                      {process.command.length > 50 
                        ? `${process.command.substring(0, 50)}...` 
                        : process.command}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

