import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loader">Loading Dashboard...</div>;
  if (!stats) return <div className="error">Failed to load stats</div>;

  const statusData = [
    { name: 'To Do', value: stats.statusCounts['To Do'] || 0 },
    { name: 'In Progress', value: stats.statusCounts['In Progress'] || 0 },
    { name: 'Done', value: stats.statusCounts['Done'] || 0 },
  ];
  const COLORS = ['#e2e8f0', '#3b82f6', '#10b981'];

  const userData = Object.keys(stats.tasksPerUser).map(name => ({
    name,
    tasks: stats.tasksPerUser[name]
  }));

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{stats.totalTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Overdue Tasks</h3>
          <p className="stat-number text-danger">{stats.overdueTasks}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="chart-container">
          <h2>Task Status Distribution</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h2>Tasks Per User</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="tasks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
