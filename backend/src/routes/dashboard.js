const express = require('express');
const store = require('../store');

const router = express.Router();

// Admin overview of everything in the demo store.
router.get('/stats', (req, res) => {
  res.json({
    totalUsers: store.users.length,
    totalCars: store.cars.length,
    totalServiceRequests: store.serviceRequests.length,
    pendingRequests: store.serviceRequests.filter((r) => r.status === 'PENDING').length,
    inProgressRequests: store.serviceRequests.filter((r) => r.status === 'IN_PROGRESS').length,
    completedRequests: store.serviceRequests.filter((r) => r.status === 'COMPLETED').length
  });
});

router.get('/users', (req, res) => {
  res.json(store.users.map((u) => ({
    id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt
  })));
});

router.get('/cars', (req, res) => {
  res.json(store.cars.map((car) => {
    const owner = store.users.find((u) => u.id === car.userId);
    return { ...car, userName: owner ? owner.name : 'Unknown' };
  }));
});

router.get('/service-requests', (req, res) => {
  res.json(store.serviceRequests.map((request) => {
    const user = store.users.find((u) => u.id === request.userId);
    const car = request.carId ? store.cars.find((c) => c.id === request.carId) : null;
    return {
      ...request,
      userName: user ? user.name : 'Unknown',
      userEmail: user ? user.email : 'unknown@example.com',
      carBrand: car ? car.carBrand : null,
      carModel: car ? car.carModel : null,
      carNumber: car ? car.carNumber : null
    };
  }));
});

module.exports = router;
