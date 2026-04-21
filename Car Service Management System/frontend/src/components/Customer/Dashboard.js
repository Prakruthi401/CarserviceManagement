import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalServiceRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch user's cars and service requests in parallel
      const [carsResponse, serviceRequestsResponse] = await Promise.all([
        axios.get(`/api/cars/user/${user.id}`),
        axios.get(`/api/service-requests/user/${user.id}`)
      ]);

      const cars = carsResponse.data;
      const serviceRequests = serviceRequestsResponse.data;

      // Calculate statistics
      const pendingRequests = serviceRequests.filter(sr => sr.status === 'PENDING').length;
      const inProgressRequests = serviceRequests.filter(sr => sr.status === 'IN_PROGRESS').length;
      const completedRequests = serviceRequests.filter(sr => sr.status === 'COMPLETED').length;

      setStats({
        totalCars: cars.length,
        totalServiceRequests: serviceRequests.length,
        pendingRequests,
        inProgressRequests,
        completedRequests
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
      <h2 className="mb-4">Customer Dashboard</h2>
      
      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <StatCard
            title="My Cars"
            value={stats.totalCars}
            icon="directions_car"
            color="#2ecc71"
            link="/customer/cars"
          />
        </div>
        <div className="col-md-3 mb-3">
          <StatCard
            title="Service Requests"
            value={stats.totalServiceRequests}
            icon="build"
            color="#e74c3c"
            link="/customer/service-requests"
          />
        </div>
        <div className="col-md-3 mb-3">
          <StatCard
            title="Pending"
            value={stats.pendingRequests}
            icon="pending"
            color="#f39c12"
            link="/customer/service-requests"
          />
        </div>
        <div className="col-md-3 mb-3">
          <StatCard
            title="Completed"
            value={stats.completedRequests}
            icon="check_circle"
            color="#27ae60"
            link="/customer/service-requests"
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
                    style={{ width: `${stats.totalServiceRequests > 0 ? (stats.pendingRequests / stats.totalServiceRequests) * 100 : 0}%` }}
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
                    style={{ width: `${stats.totalServiceRequests > 0 ? (stats.inProgressRequests / stats.totalServiceRequests) * 100 : 0}%` }}
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
                    style={{ width: `${stats.totalServiceRequests > 0 ? (stats.completedRequests / stats.totalServiceRequests) * 100 : 0}%` }}
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
              <a href="/customer/cars" className="btn btn-primary btn-block">
                <span className="material-icons me-2">directions_car</span>
                My Cars
              </a>
            </div>
            <div className="col-md-3 mb-3">
              <a href="/customer/service-requests" className="btn btn-success btn-block">
                <span className="material-icons me-2">build</span>
                Service Requests
              </a>
            </div>
            <div className="col-md-3 mb-3">
              <a href="/customer/profile" className="btn btn-info btn-block">
                <span className="material-icons me-2">person</span>
                Edit Profile
              </a>
            </div>
            <div className="col-md-3 mb-3">
              <button className="btn btn-warning btn-block" onClick={fetchDashboardStats}>
                <span className="material-icons me-2">refresh</span>
                Refresh Stats
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="card mt-4">
        <div className="card-body text-center">
          <h4>Welcome to Car Service Management System!</h4>
          <p className="text-muted">
            Manage your vehicles and service requests efficiently. Add your cars, create service requests, and track their progress all in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
