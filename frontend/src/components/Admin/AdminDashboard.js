import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Dashboard from './Dashboard';
import UsersManagement from './UsersManagement';
import ServiceRequestsManagement from './ServiceRequestsManagement';
import CarsManagement from './CarsManagement';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/users', label: 'Users Management', icon: 'people' },
    { path: '/admin/service-requests', label: 'Service Requests', icon: 'build' },
    { path: '/admin/cars', label: 'Cars Management', icon: 'directions_car' }
  ];

  const getIcon = (iconName) => {
    const icons = {
      dashboard: 'dashboard',
      people: 'people',
      build: 'build',
      directions_car: 'directions_car'
    };
    return icons[iconName] || 'menu';
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
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
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/service-requests" element={<ServiceRequestsManagement />} />
            <Route path="/cars" element={<CarsManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
