const express = require('express');
const cors = require('cors');
const { seed } = require('./src/seed');
const { authenticate, requireAdmin } = require('./src/auth');
const authRoutes = require('./src/routes/auth');
const dashboardRoutes = require('./src/routes/dashboard');
const carRoutes = require('./src/routes/cars');
const serviceRequestRoutes = require('./src/routes/serviceRequests');
const userRoutes = require('./src/routes/users');

const app = express();
const PORT = Number(process.env.PORT || 8080);

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Demo backend is running' });
});

app.use('/api/auth', authRoutes);

// Everything below needs a logged-in user.
app.use('/api', authenticate);

app.use('/api/dashboard', requireAdmin, dashboardRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/users', userRoutes);

// Loopback only: this is a local demo, not a server to expose.
app.listen(PORT, '127.0.0.1', async () => {
  await seed();
  console.log(`Demo backend on http://localhost:${PORT}`);
  console.log(`Seeded demo data; log in as john.anderson@email.com or robert.taylor@email.com (password123)`);
});
