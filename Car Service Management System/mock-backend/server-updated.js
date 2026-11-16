const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { generateRealisticData } = require('./realistic-data');

const app = express();
const PORT = process.env.PORT || 8081; // Use environment variable or default
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || Buffer.byteLength(JWT_SECRET) < 32) {
  throw new Error('Set JWT_SECRET to a private random value of at least 32 bytes before starting.');
}

// In-memory storage (for demo purposes)
let users = [];
let cars = [];
let serviceRequests = [];

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Add realistic sample data for testing
const addSampleData = () => {
  if (users.length === 0) {
    const realisticData = generateRealisticData();
    users = realisticData.users;
    cars = realisticData.cars;
    serviceRequests = realisticData.serviceRequests;
    
    console.log(`Loaded ${users.length} users, ${cars.length} cars, ${serviceRequests.length} service requests`);
  }
};

// Initialize sample data
addSampleData();

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, role = 'CUSTOMER' } = req.body;

    // Validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      createdAt: new Date()
    };

    users.push(user);

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const userList = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role
  }));

  res.json(userList);
});

// Add car
app.post('/api/cars', authenticateToken, (req, res) => {
  try {
    const { carModel, carBrand, carNumber } = req.body;
    const userId = req.user.id;

    if (!carModel || !carBrand || !carNumber) {
      return res.status(400).json({ error: 'All car fields are required' });
    }

    const car = {
      id: uuidv4(),
      userId,
      carModel,
      carBrand,
      carNumber,
      createdAt: new Date()
    };

    cars.push(car);

    res.status(201).json({
      message: 'Car added successfully',
      car: {
        id: car.id,
        userId: car.userId,
        carModel: car.carModel,
        carBrand: car.carBrand,
        carNumber: car.carNumber
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add car' });
  }
});

// Get all cars (admin only)
app.get('/api/cars', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const carsWithUserNames = cars.map(car => {
    const carOwner = users.find(u => u.id === car.userId);
    return {
      ...car,
      userName: carOwner ? carOwner.name : 'Unknown'
    };
  });

  res.json(carsWithUserNames);
});

// Get user's cars
app.get('/api/cars/user/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params;
  
  if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const userCars = cars.filter(c => c.userId === userId);
  res.json(userCars);
});

// Create service request
app.post('/api/service-requests', authenticateToken, (req, res) => {
  try {
    const { serviceType, description, carId } = req.body;
    const userId = req.user.id;

    if (!serviceType) {
      return res.status(400).json({ error: 'Service type is required' });
    }

    const serviceRequest = {
      id: uuidv4(),
      userId,
      carId: carId || null,
      serviceType,
      description: description || '',
      status: 'PENDING',
      requestDate: new Date(),
      updatedDate: new Date()
    };

    serviceRequests.push(serviceRequest);

    res.status(201).json({
      message: 'Service request created successfully',
      serviceRequest
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service request' });
  }
});

// Get user's service requests
app.get('/api/service-requests/user/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params;
  
  if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const userRequests = serviceRequests.filter(sr => sr.userId === userId);
  res.json(userRequests);
});

// Get all service requests (admin only)
app.get('/api/service-requests', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const requestsWithUserInfo = serviceRequests.map(request => {
    const user = users.find(u => u.id === request.userId);
    const car = request.carId ? cars.find(c => c.id === request.carId) : null;
    
    return {
      ...request,
      userName: user ? user.name : 'Unknown',
      userEmail: user ? user.email : 'unknown@example.com',
      carBrand: car ? car.carBrand : null,
      carModel: car ? car.carModel : null,
      carNumber: car ? car.carNumber : null
    };
  });

  res.json(requestsWithUserInfo);
});

// Update service request status (admin only)
app.put('/api/service-requests/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { id } = req.params;
  const { status } = req.query;

  const request = serviceRequests.find(sr => sr.id === id);
  if (!request) {
    return res.status(404).json({ error: 'Service request not found' });
  }

  request.status = status;
  request.updatedDate = new Date();

  res.json({
    message: 'Service request status updated successfully',
    serviceRequest: request
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Updated mock backend is running',
    users: users.length,
    cars: cars.length,
    serviceRequests: serviceRequests.length
  });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Updated mock backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('Dashboard statistics should now work!');
});
