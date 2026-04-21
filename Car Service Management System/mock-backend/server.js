const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;
const JWT_SECRET = 'mySecretKey';

// In-memory storage (for demo purposes)
let users = [];
let cars = [];
let serviceRequests = [];

// Initialize realistic dummy data
const initializeDummyData = async () => {
  // Create realistic users
  const realisticUsers = [
    { name: 'John Anderson', email: 'john.anderson@email.com', phone: '555-0101', role: 'CUSTOMER' },
    { name: 'Sarah Mitchell', email: 'sarah.mitchell@email.com', phone: '555-0102', role: 'CUSTOMER' },
    { name: 'Michael Chen', email: 'michael.chen@email.com', phone: '555-0103', role: 'CUSTOMER' },
    { name: 'Emily Rodriguez', email: 'emily.rodriguez@email.com', phone: '555-0104', role: 'CUSTOMER' },
    { name: 'David Thompson', email: 'david.thompson@email.com', phone: '555-0105', role: 'CUSTOMER' },
    { name: 'Lisa Wang', email: 'lisa.wang@email.com', phone: '555-0106', role: 'CUSTOMER' },
    { name: 'James Wilson', email: 'james.wilson@email.com', phone: '555-0107', role: 'CUSTOMER' },
    { name: 'Maria Garcia', email: 'maria.garcia@email.com', phone: '555-0108', role: 'CUSTOMER' },
    { name: 'Robert Taylor', email: 'robert.taylor@email.com', phone: '555-0109', role: 'ADMIN' },
    { name: 'Jennifer Brown', email: 'jennifer.brown@email.com', phone: '555-0110', role: 'ADMIN' }
  ];

  // Add users with hashed passwords
  for (const userData of realisticUsers) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = {
      id: uuidv4(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
    };
    users.push(user);
  }

  // Create realistic cars with more details
  const realisticCars = [
    { carBrand: 'Toyota', carModel: 'Camry SE', carNumber: 'ABC-1234', year: 2022, color: 'Silver' },
    { carBrand: 'Honda', carModel: 'Civic EX', carNumber: 'XYZ-5678', year: 2023, color: 'Blue' },
    { carBrand: 'Ford', carModel: 'F-150 XLT', carNumber: 'DEF-9012', year: 2021, color: 'Black' },
    { carBrand: 'BMW', carModel: 'X5 xDrive40i', carNumber: 'GHI-3456', year: 2023, color: 'White' },
    { carBrand: 'Mercedes', carModel: 'C 300', carNumber: 'JKL-7890', year: 2022, color: 'Gray' },
    { carBrand: 'Tesla', carModel: 'Model 3 LR', carNumber: 'MNO-2345', year: 2023, color: 'Red' },
    { carBrand: 'Audi', carModel: 'A4 Premium', carNumber: 'PQR-6789', year: 2022, color: 'Black' },
    { carBrand: 'Nissan', carModel: 'Altima SV', carNumber: 'STU-0123', year: 2021, color: 'Silver' },
    { carBrand: 'Hyundai', carModel: 'Sonata Limited', carNumber: 'VWX-4567', year: 2023, color: 'White' },
    { carBrand: 'Kia', carModel: 'Sportage EX', carNumber: 'YZA-8901', year: 2022, color: 'Blue' },
    { carBrand: 'Chevrolet', carModel: 'Malibu LT', carNumber: 'BCD-1111', year: 2021, color: 'Red' },
    { carBrand: 'Mazda', carModel: 'CX-5 Touring', carNumber: 'EFG-2222', year: 2023, color: 'Gray' }
  ];

  // Assign cars to users
  realisticCars.forEach((carData, index) => {
    if (index < users.length - 2) { // Don't assign cars to admin users
      const car = {
        id: uuidv4(),
        userId: users[index].id,
        ...carData,
        createdAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000)
      };
      cars.push(car);
    }
  });

  // Create realistic service requests
  const serviceTypes = ['Oil Change', 'Brake Inspection', 'Tire Rotation', 'Engine Diagnostic', 'AC Service', 'Transmission Service', 'Battery Replacement', 'Wheel Alignment'];
  const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
  const descriptions = [
    'Regular maintenance service requested',
    'Check engine light is on',
    'Strange noise coming from engine',
    'Brakes feel soft and need inspection',
    'Oil change and filter replacement',
    'Air conditioning not cooling properly',
    'Battery died and needs replacement',
    'Car pulling to one side while driving',
    'Transmission slipping between gears',
    'Routine inspection before long trip'
  ];

  // Create service requests for customers
  for (let i = 0; i < 25; i++) {
    const customerUsers = users.filter(u => u.role === 'CUSTOMER');
    const randomUser = customerUsers[Math.floor(Math.random() * customerUsers.length)];
    const userCars = cars.filter(c => c.userId === randomUser.id);
    const randomCar = userCars.length > 0 ? userCars[Math.floor(Math.random() * userCars.length)] : null;
    
    const serviceRequest = {
      id: uuidv4(),
      userId: randomUser.id,
      carId: randomCar ? randomCar.id : null,
      serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      requestDate: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
      updatedDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
    };
    serviceRequests.push(serviceRequest);
  }
};

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

// Public dashboard endpoints (no authentication required)
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {
    totalUsers: users.length,
    totalCars: cars.length,
    totalServiceRequests: serviceRequests.length,
    pendingRequests: serviceRequests.filter(sr => sr.status === 'PENDING').length,
    inProgressRequests: serviceRequests.filter(sr => sr.status === 'IN_PROGRESS').length,
    completedRequests: serviceRequests.filter(sr => sr.status === 'COMPLETED').length
  };
  res.json(stats);
});

app.get('/api/dashboard/users', (req, res) => {
  const userList = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json(userList);
});

app.get('/api/dashboard/cars', (req, res) => {
  const carsWithUserNames = cars.map(car => {
    const carOwner = users.find(u => u.id === car.userId);
    return {
      ...car,
      userName: carOwner ? carOwner.name : 'Unknown'
    };
  });
  res.json(carsWithUserNames);
});

app.get('/api/dashboard/service-requests', (req, res) => {
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

// Public customer endpoints (no authentication required for demo)
app.get('/api/cars/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userCars = cars.filter(c => c.userId === userId);
  res.json(userCars);
});

app.get('/api/service-requests/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userRequests = serviceRequests.filter(sr => sr.userId === userId);
  
  // Add car information to service requests
  const requestsWithCarInfo = userRequests.map(request => {
    const car = request.carId ? cars.find(c => c.id === request.carId) : null;
    return {
      ...request,
      carBrand: car ? car.carBrand : null,
      carModel: car ? car.carModel : null,
      carNumber: car ? car.carNumber : null,
      carYear: car ? car.year : null,
      carColor: car ? car.color : null
    };
  });
  
  res.json(requestsWithCarInfo);
});

// Public car management endpoints
app.post('/api/cars', (req, res) => {
  try {
    const { carModel, carBrand, carNumber, userId } = req.body;
    const actualUserId = userId || req.query.userId;

    if (!carModel || !carBrand || !carNumber || !actualUserId) {
      return res.status(400).json({ error: 'All car fields and userId are required' });
    }

    const car = {
      id: uuidv4(),
      userId: actualUserId,
      carModel,
      carBrand,
      carNumber,
      year: new Date().getFullYear(),
      color: 'Unknown',
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
        carNumber: car.carNumber,
        year: car.year,
        color: car.color
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add car' });
  }
});

app.put('/api/cars/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { carModel, carBrand, carNumber } = req.body;

    const car = cars.find(c => c.id === id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    if (carModel) car.carModel = carModel;
    if (carBrand) car.carBrand = carBrand;
    if (carNumber) car.carNumber = carNumber;

    res.json({
      message: 'Car updated successfully',
      car: {
        id: car.id,
        userId: car.userId,
        carModel: car.carModel,
        carBrand: car.carBrand,
        carNumber: car.carNumber,
        year: car.year,
        color: car.color
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update car' });
  }
});

app.delete('/api/cars/:id', (req, res) => {
  try {
    const { id } = req.params;
    const carIndex = cars.findIndex(c => c.id === id);
    
    if (carIndex === -1) {
      return res.status(404).json({ error: 'Car not found' });
    }

    cars.splice(carIndex, 1);

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock backend is running' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Mock backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  
  // Initialize dummy data
  await initializeDummyData();
  console.log(`Initialized with ${users.length} users, ${cars.length} cars, and ${serviceRequests.length} service requests`);
  console.log('Registration should now work!');
});
