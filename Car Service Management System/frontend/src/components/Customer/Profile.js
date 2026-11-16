import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (error || success) {
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone
      };
      
      // Only include password if it's provided
      if (profileData.currentPassword) {
        if (!profileData.newPassword) {
          setError('New password is required when changing password');
          setLoading(false);
          return;
        }
        
        if (profileData.newPassword !== profileData.confirmPassword) {
          setError('New passwords do not match');
          setLoading(false);
          return;
        }
        
        updateData.password = profileData.newPassword;
      }
      
      await axios.put(`/api/users/${user.id}`, updateData);
      
      setSuccess('Profile updated successfully!');
      
      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!profileData.name || !profileData.email || !profileData.phone) {
      setError('All fields are required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (profileData.currentPassword && !profileData.newPassword) {
      setError('New password is required when changing password');
      return false;
    }
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    
    if (profileData.newPassword && profileData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  return (
    <div>
      <h2 className="mb-4">My Profile</h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-sm btn-outline-light ms-2" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          {success}
          <button className="btn btn-sm btn-outline-light ms-2" onClick={() => setSuccess(null)}>
            ×
          </button>
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Profile Information</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateProfile}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={profileData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={profileData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-control"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Account Type</label>
                      <input
                        type="text"
                        className="form-control"
                        value={user?.role || 'CUSTOMER'}
                        disabled
                      />
                      <small className="text-muted">Account type cannot be changed</small>
                    </div>
                  </div>
                </div>

                <hr />

                <h5 className="mb-3">Change Password</h5>
                <p className="text-muted mb-3">Leave blank if you don't want to change your password</p>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label" htmlFor="currentPassword">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        className="form-control"
                        value={profileData.currentPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label" htmlFor="newPassword">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="form-control"
                        value={profileData.newPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label" htmlFor="confirmPassword">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control"
                        value={profileData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Account Summary</h4>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <div className="avatar-placeholder">
                  <span className="material-icons" style={{ fontSize: '64px', color: '#ccc' }}>
                    person
                  </span>
                </div>
                <h5>{profileData.name}</h5>
                <p className="text-muted">{profileData.email}</p>
                <span className="badge bg-primary">{user?.role || 'CUSTOMER'}</span>
              </div>
              
              <hr />
              
              <div className="account-info">
                <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Account Status:</strong> <span className="badge bg-success">Active</span></p>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5 className="card-title">Quick Links</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <a href="/customer/cars" className="btn btn-outline-primary">
                  <span className="material-icons me-2">directions_car</span>
                  My Cars
                </a>
                <a href="/customer/service-requests" className="btn btn-outline-success">
                  <span className="material-icons me-2">build</span>
                  Service Requests
                </a>
                <a href="/customer/dashboard" className="btn btn-outline-info">
                  <span className="material-icons me-2">dashboard</span>
                  Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
