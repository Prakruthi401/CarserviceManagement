const { randomUUID } = require('crypto');
const express = require('express');
const store = require('../store');
const { isSelfOrAdmin } = require('../auth');

const router = express.Router();

const findCar = (id) => store.cars.find((c) => c.id === id);

const carView = (car) => ({
  id: car.id, userId: car.userId, carModel: car.carModel, carBrand: car.carBrand,
  carNumber: car.carNumber, year: car.year, color: car.color
});

router.get('/user/:userId', (req, res) => {
  if (!isSelfOrAdmin(req, req.params.userId)) {
    return res.status(403).json({ error: 'You can only view your own cars' });
  }
  res.json(store.cars.filter((c) => c.userId === req.params.userId));
});

router.post('/', (req, res) => {
  const { carModel, carBrand, carNumber } = req.body;
  const userId = req.body.userId || req.query.userId;

  if (!carModel || !carBrand || !carNumber || !userId) {
    return res.status(400).json({ error: 'All car fields and userId are required' });
  }
  if (!isSelfOrAdmin(req, userId)) {
    return res.status(403).json({ error: 'You can only add cars to your own account' });
  }

  const car = {
    id: randomUUID(),
    userId,
    carModel,
    carBrand,
    carNumber,
    year: new Date().getFullYear(),
    color: 'Unknown',
    createdAt: new Date()
  };
  store.cars.push(car);

  res.status(201).json({ message: 'Car added successfully', car: carView(car) });
});

router.put('/:id', (req, res) => {
  const car = findCar(req.params.id);
  if (!car) {
    return res.status(404).json({ error: 'Car not found' });
  }
  if (!isSelfOrAdmin(req, car.userId)) {
    return res.status(403).json({ error: 'You can only update your own cars' });
  }

  const { carModel, carBrand, carNumber } = req.body;
  if (carModel) car.carModel = carModel;
  if (carBrand) car.carBrand = carBrand;
  if (carNumber) car.carNumber = carNumber;

  res.json({ message: 'Car updated successfully', car: carView(car) });
});

router.delete('/:id', (req, res) => {
  const car = findCar(req.params.id);
  if (!car) {
    return res.status(404).json({ error: 'Car not found' });
  }
  if (!isSelfOrAdmin(req, car.userId)) {
    return res.status(403).json({ error: 'You can only delete your own cars' });
  }

  store.cars = store.cars.filter((c) => c.id !== car.id);
  // Requests that pointed at this car keep their history but lose the link.
  store.serviceRequests.forEach((r) => { if (r.carId === car.id) r.carId = null; });

  res.json({ message: 'Car deleted successfully' });
});

module.exports = router;
