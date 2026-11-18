import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({
    carModel: '',
    carBrand: '',
    carNumber: ''
  });
  const { user } = useAuth();


  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/cars/user/${user.id}`);
      setCars(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cars');
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleAddCar = async () => {
    try {
      await axios.post('/api/cars', formData, { params: { userId: user.id } });
      setCars([...cars, { ...formData, id: Date.now(), userId: user.id }]);
      setShowAddModal(false);
      setFormData({ carModel: '', carBrand: '', carNumber: '' });
    } catch (err) {
      setError('Failed to add car');
    }
  };

  const handleEditCar = (car) => {
    setSelectedCar(car);
    setFormData({
      carModel: car.carModel,
      carBrand: car.carBrand,
      carNumber: car.carNumber
    });
    setShowEditModal(true);
  };

  const handleUpdateCar = async () => {
    try {
      await axios.put(`/api/cars/${selectedCar.id}`, formData);
      setCars(cars.map(car => 
        car.id === selectedCar.id ? { ...car, ...formData } : car
      ));
      setShowEditModal(false);
      setSelectedCar(null);
      setFormData({ carModel: '', carBrand: '', carNumber: '' });
    } catch (err) {
      setError('Failed to update car');
    }
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`/api/cars/${carId}`);
        setCars(cars.filter(car => car.id !== carId));
      } catch (err) {
        setError('Failed to delete car');
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
        <h2>My Cars</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <span className="material-icons me-2">add</span>
          Add New Car
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

      {/* Cars Grid */}
      {cars.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <span className="material-icons" style={{ fontSize: '48px', color: '#ccc' }}>directions_car</span>
            <h4>No Cars Added</h4>
            <p className="text-muted">You haven't added any cars yet. Click "Add New Car" to get started.</p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <span className="material-icons me-2">add</span>
              Add Your First Car
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          {cars.map(car => (
            <div key={car.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title">{car.carBrand} {car.carModel}</h5>
                      <span className="badge bg-primary">{car.carNumber}</span>
                    </div>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <span className="material-icons">more_vert</span>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button className="dropdown-item" onClick={() => handleEditCar(car)}>
                            <span className="material-icons me-2">edit</span>
                            Edit
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item text-danger" onClick={() => handleDeleteCar(car.id)}>
                            <span className="material-icons me-2">delete</span>
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="car-details">
                    <p><strong>Brand:</strong> {car.carBrand}</p>
                    <p><strong>Model:</strong> {car.carModel}</p>
                    <p><strong>Number:</strong> {car.carNumber}</p>
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-sm btn-outline-primary me-2">
                      <span className="material-icons me-1">build</span>
                      Request Service
                    </button>
                    <button className="btn btn-sm btn-outline-info">
                      <span className="material-icons me-1">history</span>
                      Service History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Car Modal */}
      {showAddModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Car</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Car Brand</label>
                  <input
                    type="text"
                    name="carBrand"
                    className="form-control"
                    value={formData.carBrand}
                    onChange={handleInputChange}
                    placeholder="e.g., Toyota, Honda, BMW"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Car Model</label>
                  <input
                    type="text"
                    name="carModel"
                    className="form-control"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    placeholder="e.g., Camry, Civic, X5"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Car Number</label>
                  <input
                    type="text"
                    name="carNumber"
                    className="form-control"
                    value={formData.carNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., ABC-1234"
                  />
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
                  onClick={handleAddCar}
                >
                  Add Car
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {showEditModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Car</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Car Brand</label>
                  <input
                    type="text"
                    name="carBrand"
                    className="form-control"
                    value={formData.carBrand}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Car Model</label>
                  <input
                    type="text"
                    name="carModel"
                    className="form-control"
                    value={formData.carModel}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Car Number</label>
                  <input
                    type="text"
                    name="carNumber"
                    className="form-control"
                    value={formData.carNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateCar}
                >
                  Update Car
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCars;
