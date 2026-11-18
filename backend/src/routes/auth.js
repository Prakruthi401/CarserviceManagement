const { randomUUID } = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const store = require('../store');
const { signToken } = require('../auth');

const router = express.Router();

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role });

router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (store.users.some((u) => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // New signups are always customers; admin accounts are seeded, not self-registered.
  const user = {
    id: randomUUID(),
    name,
    email,
    password: await bcrypt.hash(password, 10),
    phone,
    role: 'CUSTOMER',
    createdAt: new Date()
  };
  store.users.push(user);

  res.status(201).json({ message: 'User registered successfully', user: publicUser(user), token: signToken(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = store.users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({ message: 'Login successful', user: publicUser(user), token: signToken(user) });
});

module.exports = router;
