import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalServiceRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Use public dashboard endpoints (no authentication required)
      const statsResponse = await axios.get('/api/dashboard/stats');
      const stats = statsResponse.data;

      // Use the pre-calculated stats from the backend
      setStats({
        totalUsers: stats.totalUsers,
        totalCars: stats.totalCars,
        totalServiceRequests: stats.totalServiceRequests,
        pendingRequests: stats.pendingRequests,
        inProgressRequests: stats.inProgressRequests,
        completedRequests: stats.completedRequests
      });
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link }) => (
    <div className="card stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="stat-value">{value}</h3>
          <p className="stat-title">{title}</p>
        </div>
        <div className="stat-icon" style={{ backgroundColor: color + '20', color }}>
          <span className="material-icons">{icon}</span>
        </div>
      </div>
      {link && (
        <div className="mt-3">
          <a href={link} className="btn btn-sm btn-outline-primary">
            View Details
          </a>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button className="btn btn-sm btn-primary ms-2" onClick={fetchDashboardStats}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="people"
            color="#3498db"
            link="/admin/users"
          />
        </div>
        <div className="col-md-3 mb-3">
          <StatCard
            title="Total Cars"
            value={stats.totalCars}
            icon="directions_car"
            color="#2ecc71"
            link="/admin/cars"
          />
        </div>
        <div className="col-md-3 mb-3">
          <StatCard
            title="Total Service Requests"
            value={stats.totalServiceRequests}
            icon="build"
            color="#e74c3c"
            link="/admin/service-requests"
          />
        </div>
        <div className="col-md-3 mb-3">
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon="pending"
            color="#f39c12"
            link="/admin/service-requests"
          />
        </div>
      </div>

      {/* Service Request Status Overview */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Service Request Status Overview</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="text-center">
                <h3 className="text-warning">{stats.pendingRequests}</h3>
                <p className="text-muted">Pending</p>
                <div className="progress mb-3">
                  <div
                    className="progress-bar bg-warning"
                    style={{ width: `${(stats.pendingRequests / stats.totalServiceRequests) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <h3 className="text-info">{stats.inProgressRequests}</h3>
                <p className="text-muted">In Progress</p>
                <div className="progress mb-3">
                  <div
                    className="progress-bar bg-info"
                    style={{ width: `${(stats.inProgressRequests / stats.totalServiceRequests) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <h3 className="text-success">{stats.completedRequests}</h3>
                <p className="text-muted">Completed</p>
                <div className="progress mb-3">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${(stats.completedRequests / stats.totalServiceRequests) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mt-4">
        <div className="card-header">
          <h4 className="card-title">Quick Actions</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-3">
              <a href="/admin/users" className="btn btn-primary btn-block">
                <span className="material-icons me-2">people</span>
                Manage Users
              </a>
            </div>
            <div className="col-md-3 mb-3">
              <a href="/admin/cars" className="btn btn-success btn-block">
                <span className="material-icons me-2">directions_car</span>
                Manage Cars
              </a>
            </div>
            <div className="col-md-3 mb-3">
              <a href="/admin/service-requests" className="btn btn-warning btn-block">
                <span className="material-icons me-2">build</span>
                Service Requests
              </a>
            </div>
            <div className="col-md-3 mb-3">
              <button className="btn btn-info btn-block" onClick={fetchDashboardStats}>
                <span className="material-icons me-2">refresh</span>
                Refresh Stats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
