import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarsManagement = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/cars');
      setCars(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cars');
      setLoading(false);
    }
  };

  const handleEditCar = (car) => {
    setSelectedCar({ ...car });
    setShowEditModal(true);
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

  const handleUpdateCar = async () => {
    try {
      await axios.put(`/api/cars/${selectedCar.id}`, selectedCar);
      setCars(cars.map(car => 
        car.id === selectedCar.id ? selectedCar : car
      ));
      setShowEditModal(false);
      setSelectedCar(null);
    } catch (err) {
      setError('Failed to update car');
    }
  };

  const filteredCars = cars.filter(car =>
    car.carBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.carNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h2>Cars Management</h2>
        <button className="btn btn-primary" onClick={fetchCars}>
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

      {/* Search Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text">
              <span className="material-icons">search</span>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search cars by brand, model, number, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Cars Table */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">All Cars ({filteredCars.length})</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Car Number</th>
                  <th>Owner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map(car => (
                  <tr key={car.id}>
                    <td>{car.id}</td>
                    <td>{car.carBrand}</td>
                    <td>{car.carModel}</td>
                    <td>
                      <span className="badge bg-primary">{car.carNumber}</span>
                    </td>
                    <td>{car.userName}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditCar(car)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteCar(car.id)}
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

      {/* Edit Car Modal */}
      {showEditModal && selectedCar && (
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
                    className="form-control"
                    value={selectedCar.carBrand}
                    onChange={(e) => setSelectedCar({...selectedCar, carBrand: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Car Model</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCar.carModel}
                    onChange={(e) => setSelectedCar({...selectedCar, carModel: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Car Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCar.carNumber}
                    onChange={(e) => setSelectedCar({...selectedCar, carNumber: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Owner</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCar.userName}
                    disabled
                  />
                  <small className="text-muted">Owner cannot be changed</small>
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
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarsManagement;
