import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ServiceRequests = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    carId: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsResponse, carsResponse] = await Promise.all([
        axios.get(`/api/service-requests/user/${user.id}`),
        axios.get(`/api/cars/user/${user.id}`)
      ]);
      setServiceRequests(requestsResponse.data);
      setCars(carsResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    try {
      await axios.post('/api/service-requests', formData, { 
        params: { 
          userId: user.id,
          carId: formData.carId || null
        }
      });
      fetchData();
      setShowAddModal(false);
      setFormData({ serviceType: '', description: '', carId: '' });
    } catch (err) {
      setError('Failed to create service request');
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        <h2>Service Requests</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <span className="material-icons me-2">add</span>
          New Service Request
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

      {/* Service Requests List */}
      {serviceRequests.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <span className="material-icons" style={{ fontSize: '48px', color: '#ccc' }}>build</span>
            <h4>No Service Requests</h4>
            <p className="text-muted">You haven't created any service requests yet. Click "New Service Request" to get started.</p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <span className="material-icons me-2">add</span>
              Create Your First Request
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          {serviceRequests.map(request => (
            <div key={request.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title">{request.serviceType}</h5>
                      <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <span className="material-icons">more_vert</span>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button className="dropdown-item" onClick={() => handleViewDetails(request)}>
                            <span className="material-icons me-2">visibility</span>
                            View Details
                          </button>
                        </li>
                        {request.status === 'PENDING' && (
                          <li>
                            <button className="dropdown-item text-danger" onClick={() => handleDeleteRequest(request.id)}>
                              <span className="material-icons me-2">delete</span>
                              Cancel Request
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="request-details">
                    {request.carNumber && (
                      <p><strong>Car:</strong> {request.carBrand} {request.carModel} ({request.carNumber})</p>
                    )}
                    <p><strong>Request Date:</strong> {formatDate(request.requestDate)}</p>
                    {request.description && (
                      <p><strong>Description:</strong> {request.description.substring(0, 100)}...</p>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewDetails(request)}>
                      <span className="material-icons me-1">visibility</span>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Request Modal */}
      {showAddModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Service Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Service Type</label>
                  <select
                    name="serviceType"
                    className="form-select"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Service Type</option>
                    <option value="Oil Change">Oil Change</option>
                    <option value="Tire Service">Tire Service</option>
                    <option value="Brake Service">Brake Service</option>
                    <option value="Engine Service">Engine Service</option>
                    <option value="Transmission Service">Transmission Service</option>
                    <option value="AC Service">AC Service</option>
                    <option value="General Inspection">General Inspection</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {cars.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Select Car (Optional)</label>
                    <select
                      name="carId"
                      className="form-select"
                      value={formData.carId}
                      onChange={handleInputChange}
                    >
                      <option value="">No specific car</option>
                      {cars.map(car => (
                        <option key={car.id} value={car.id}>
                          {car.carBrand} {car.carModel} ({car.carNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Please describe the service you need..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateRequest}
                  disabled={!formData.serviceType}
                >
                  Create Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Service Request Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Service Information</h6>
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
                
                {selectedRequest.carNumber && (
                  <>
                    <hr />
                    <div className="row">
                      <div className="col-12">
                        <h6>Vehicle Information</h6>
                        <p><strong>Car:</strong> {selectedRequest.carBrand} {selectedRequest.carModel}</p>
                        <p><strong>Number:</strong> {selectedRequest.carNumber}</p>
                      </div>
                    </div>
                  </>
                )}
                
                {selectedRequest.description && (
                  <>
                    <hr />
                    <h6>Description</h6>
                    <p>{selectedRequest.description}</p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
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

export default ServiceRequests;
