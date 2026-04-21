import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Dashboard from './Dashboard';
import MyCars from './MyCars';
import ServiceRequests from './ServiceRequests';
import Profile from './Profile';

const CustomerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'CUSTOMER') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/customer/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/customer/cars', label: 'My Cars', icon: 'directions_car' },
    { path: '/customer/service-requests', label: 'Service Requests', icon: 'build' },
    { path: '/customer/profile', label: 'Profile', icon: 'person' }
  ];

  const getIcon = (iconName) => {
    const icons = {
      dashboard: 'dashboard',
      directions_car: 'directions_car',
      build: 'build',
      person: 'person'
    };
    return icons[iconName] || 'menu';
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h3>Customer Panel</h3>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>
        
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                <span className="material-icons">
                  {getIcon(item.icon)}
                </span>
                {sidebarOpen && item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="content-header">
          <div className="d-flex justify-content-between align-items-center">
            <h1>Car Service Management System</h1>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Welcome, {user?.name}</span>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="content-body">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cars" element={<MyCars />} />
            <Route path="/service-requests" element={<ServiceRequests />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
