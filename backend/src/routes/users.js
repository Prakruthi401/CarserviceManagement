const express = require('express');
const bcrypt = require('bcryptjs');
const store = require('../store');
const { isSelfOrAdmin } = require('../auth');

const router = express.Router();

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role });

// Profile edits: name, phone, email and password. Role never changes here.
router.put('/:id', async (req, res) => {
  if (!isSelfOrAdmin(req, req.params.id)) {
    return res.status(403).json({ error: 'You can only update your own profile' });
  }
  const user = store.users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, email, phone, password } = req.body;
  if (email && email !== user.email && store.users.some((u) => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (password) user.password = await bcrypt.hash(password, 10);

  res.json({ message: 'User updated successfully', user: publicUser(user) });
});

// Removing a customer also removes their cars and requests.
router.delete('/:id', (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const user = store.users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.id === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete your own account while logged in' });
  }

  store.users = store.users.filter((u) => u.id !== user.id);
  store.cars = store.cars.filter((c) => c.userId !== user.id);
  const ownedCarIds = new Set(store.cars.map((c) => c.id));
  store.serviceRequests = store.serviceRequests.filter((r) => r.userId !== user.id);
  store.serviceRequests.forEach((r) => { if (r.carId && !ownedCarIds.has(r.carId)) r.carId = null; });

  res.json({ message: 'User deleted successfully' });
});

module.exports = router;
