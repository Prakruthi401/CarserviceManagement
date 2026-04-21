import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceRequestsManagement = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServiceRequests();
  }, [filterStatus]);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      let url = '/api/dashboard/service-requests';
      if (filterStatus) {
        // Filter locally since we don't have filtered endpoints
        const response = await axios.get('/api/dashboard/service-requests');
        const filtered = response.data.filter(req => req.status === filterStatus);
        setServiceRequests(filtered);
      } else {
        const response = await axios.get(url);
        setServiceRequests(response.data);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch service requests');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await axios.put(`/api/service-requests/${requestId}/status`, null, {
        params: { status: newStatus }
      });
      setServiceRequests(requests =>
        requests.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this service request?')) {
      try {
        await axios.delete(`/api/service-requests/${requestId}`);
        setServiceRequests(requests => requests.filter(req => req.id !== requestId));
      } catch (err) {
        setError('Failed to delete service request');
      }
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowEditModal(true);
  };

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = 
      request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.carNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'PENDING': 'badge-warning',
      'IN_PROGRESS': 'badge-info',
      'COMPLETED': 'badge-success',
      'CANCELLED': 'badge-danger'
    };
    return statusClasses[status] || 'badge-secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Service Requests Management</h2>
        <button className="btn btn-primary" onClick={fetchServiceRequests}>
          <span className="material-icons me-2">refresh</span>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-sm btn-outline-light ms-2" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Filter by Status</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text">
                  <span className="material-icons">search</span>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by customer, service type, or car..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Requests Table */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Service Requests ({filteredRequests.length})</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Car</th>
                  <th>Service Type</th>
                  <th>Status</th>
                  <th>Request Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.userName}</td>
                    <td>{request.userEmail}</td>
                    <td>
                      {request.carNumber ? (
                        <div>
                          <div>{request.carBrand} {request.carModel}</div>
                          <small className="text-muted">{request.carNumber}</small>
                        </div>
                      ) : (
                        <span className="text-muted">No car assigned</span>
                      )}
                    </td>
                    <td>{request.serviceType}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{formatDate(request.requestDate)}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => handleViewDetails(request)}
                        >
                          <span className="material-icons">visibility</span>
                        </button>
                        {request.status === 'PENDING' && (
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleUpdateStatus(request.id, 'IN_PROGRESS')}
                          >
                            <span className="material-icons">play_arrow</span>
                          </button>
                        )}
                        {request.status === 'IN_PROGRESS' && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleUpdateStatus(request.id, 'COMPLETED')}
                          >
                            <span className="material-icons">check</span>
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Service Request Details Modal */}
      {showEditModal && selectedRequest && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Service Request Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Customer Information</h6>
                    <p><strong>Name:</strong> {selectedRequest.userName}</p>
                    <p><strong>Email:</strong> {selectedRequest.userEmail}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Vehicle Information</h6>
                    <p><strong>Car:</strong> {selectedRequest.carBrand} {selectedRequest.carModel}</p>
                    <p><strong>Number:</strong> {selectedRequest.carNumber || 'Not assigned'}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6>Service Details</h6>
                    <p><strong>Service Type:</strong> {selectedRequest.serviceType}</p>
                    <p><strong>Status:</strong> 
                      <span className={`badge ${getStatusBadgeClass(selectedRequest.status)} ms-2`}>
                        {selectedRequest.status.replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Timeline</h6>
                    <p><strong>Request Date:</strong> {formatDate(selectedRequest.requestDate)}</p>
                    <p><strong>Last Updated:</strong> {formatDate(selectedRequest.updatedDate)}</p>
                  </div>
                </div>
                {selectedRequest.description && (
                  <>
                    <hr />
                    <h6>Description</h6>
                    <p>{selectedRequest.description}</p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                {selectedRequest.status === 'PENDING' && (
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => {
                      handleUpdateStatus(selectedRequest.id, 'IN_PROGRESS');
                      setShowEditModal(false);
                    }}
                  >
                    Start Service
                  </button>
                )}
                {selectedRequest.status === 'IN_PROGRESS' && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      handleUpdateStatus(selectedRequest.id, 'COMPLETED');
                      setShowEditModal(false);
                    }}
                  >
                    Complete Service
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequestsManagement;
