import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { SystemStats } from './types';
import { fetchSystemStats } from './services/api';

function App() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSystemStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch system stats');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white',
        fontSize: '24px'
      }}>
        Loading system stats...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white',
        fontSize: '24px',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div>Error: {error}</div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          Make sure the backend server is running on port 3001
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return <Dashboard stats={stats} />;
}

export default App;

