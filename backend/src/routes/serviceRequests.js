const { randomUUID } = require('crypto');
const express = require('express');
const store = require('../store');
const { isSelfOrAdmin } = require('../auth');

const router = express.Router();

const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

const findRequest = (id) => store.serviceRequests.find((r) => r.id === id);

const withCarInfo = (request) => {
  const car = request.carId ? store.cars.find((c) => c.id === request.carId) : null;
  return {
    ...request,
    carBrand: car ? car.carBrand : null,
    carModel: car ? car.carModel : null,
    carNumber: car ? car.carNumber : null,
    carYear: car ? car.year : null,
    carColor: car ? car.color : null
  };
};

router.get('/user/:userId', (req, res) => {
  if (!isSelfOrAdmin(req, req.params.userId)) {
    return res.status(403).json({ error: 'You can only view your own service requests' });
  }
  res.json(store.serviceRequests.filter((r) => r.userId === req.params.userId).map(withCarInfo));
});

router.post('/', (req, res) => {
  const { serviceType, description } = req.body;
  const userId = req.body.userId || req.query.userId;
  const carId = req.body.carId || req.query.carId || null;

  if (!serviceType || !description || !userId) {
    return res.status(400).json({ error: 'serviceType, description and userId are required' });
  }
  if (!isSelfOrAdmin(req, userId)) {
    return res.status(403).json({ error: 'You can only create requests for your own account' });
  }
  if (carId) {
    const car = store.cars.find((c) => c.id === carId);
    if (!car || car.userId !== userId) {
      return res.status(400).json({ error: 'That car does not belong to this user' });
    }
  }

  const request = {
    id: randomUUID(),
    userId,
    carId,
    serviceType,
    description,
    status: 'PENDING',
    requestDate: new Date(),
    updatedDate: new Date()
  };
  store.serviceRequests.push(request);

  res.status(201).json({ message: 'Service request created', request: withCarInfo(request) });
});

// Status moves forward through the queue; only staff (admin) change it.
router.put('/:id/status', (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only staff can update a request status' });
  }
  const request = findRequest(req.params.id);
  if (!request) {
    return res.status(404).json({ error: 'Service request not found' });
  }

  const status = req.query.status || req.body.status;
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${STATUSES.join(', ')}` });
  }

  request.status = status;
  request.updatedDate = new Date();

  res.json({ message: 'Status updated', request: withCarInfo(request) });
});

router.delete('/:id', (req, res) => {
  const request = findRequest(req.params.id);
  if (!request) {
    return res.status(404).json({ error: 'Service request not found' });
  }
  if (!isSelfOrAdmin(req, request.userId)) {
    return res.status(403).json({ error: 'You can only delete your own service requests' });
  }

  store.serviceRequests = store.serviceRequests.filter((r) => r.id !== request.id);
  res.json({ message: 'Service request deleted' });
});

module.exports = router;
