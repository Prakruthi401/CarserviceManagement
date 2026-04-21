const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Realistic sample data generator
const generateRealisticData = () => {
  const users = [];
  const cars = [];
  const serviceRequests = [];

  // Realistic user data
  const realisticUsers = [
    {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      role: 'ADMIN'
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 234-5678',
      role: 'CUSTOMER'
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 345-6789',
      role: 'CUSTOMER'
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      role: 'CUSTOMER'
    },
    {
      name: 'Robert Wilson',
      email: 'robert.wilson@email.com',
      phone: '+1 (555) 567-8901',
      role: 'CUSTOMER'
    },
    {
      name: 'Amanda Martinez',
      email: 'amanda.martinez@email.com',
      phone: '+1 (555) 678-9012',
      role: 'CUSTOMER'
    },
    {
      name: 'David Thompson',
      email: 'david.thompson@email.com',
      phone: '+1 (555) 789-0123',
      role: 'CUSTOMER'
    }
  ];

  // Create users with hashed passwords
  for (const userData of realisticUsers) {
    users.push({
      id: uuidv4(),
      ...userData,
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password123' hashed
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random time in last year
    });
  }

  // Realistic car data
  const realisticCars = [
    { brand: 'Toyota', model: 'Camry', year: '2021', color: 'Silver' },
    { brand: 'Honda', model: 'Civic', year: '2022', color: 'Blue' },
    { brand: 'Ford', model: 'F-150', year: '2020', color: 'Black' },
    { brand: 'Chevrolet', model: 'Malibu', year: '2021', color: 'Red' },
    { brand: 'BMW', model: 'X5', year: '2022', color: 'White' },
    { brand: 'Mercedes', model: 'C-Class', year: '2020', color: 'Gray' },
    { brand: 'Tesla', model: 'Model 3', year: '2023', color: 'Pearl White' },
    { brand: 'Nissan', model: 'Altima', year: '2021', color: 'Dark Blue' },
    { brand: 'Jeep', model: 'Wrangler', year: '2020', color: 'Green' },
    { brand: 'Audi', model: 'A4', year: '2022', color: 'Black' }
  ];

  // Assign cars to customers (skip admin)
  for (let i = 1; i < users.length && i < realisticCars.length + 1; i++) {
    const carData = realisticCars[i - 1];
    cars.push({
      id: uuidv4(),
      userId: users[i].id,
      carModel: `${carData.year} ${carData.brand} ${carData.model}`,
      carBrand: carData.brand,
      carNumber: generateLicensePlate(),
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000) // Random time in last 6 months
    });
  }

  // Realistic service types
  const serviceTypes = [
    'Oil Change', 'Tire Rotation', 'Brake Inspection', 'Battery Check',
    'Air Filter Replacement', 'Transmission Service', 'Wheel Alignment',
    'Coolant Flush', 'Spark Plug Replacement', 'Fuel System Cleaning',
    'AC Service', 'Exhaust System Check', 'Suspension Inspection',
    'Differential Service', 'Timing Belt Replacement', 'Radiator Service'
  ];

  // Realistic descriptions
  const serviceDescriptions = [
    'Regular maintenance oil change with filter replacement',
    'Rotate and balance all four tires',
    'Complete brake system inspection including pads and rotors',
    'Battery load test and terminal cleaning',
    'Replace engine air filter and cabin air filter',
    'Transmission fluid change and filter replacement',
    'Four-wheel alignment check and adjustment',
    'Flush cooling system and replace coolant',
    'Replace spark plugs and inspect ignition system',
    'Clean fuel injectors and throttle body',
    'AC system check and refrigerant recharge',
    'Exhaust system inspection for leaks',
    'Complete suspension system inspection',
    'Differential fluid change and inspection',
    'Timing belt and water pump replacement',
    'Radiator inspection and coolant system check'
  ];

  // Generate realistic service requests
  const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  const statusWeights = [0.2, 0.3, 0.4, 0.1]; // Weighted distribution

  for (let i = 0; i < 25; i++) { // Generate 25 service requests
    const randomUser = users[Math.floor(Math.random() * (users.length - 1)) + 1]; // Skip admin
    const userCars = cars.filter(car => car.userId === randomUser.id);
    const randomCar = userCars.length > 0 ? userCars[Math.floor(Math.random() * userCars.length)] : null;
    const serviceTypeIndex = Math.floor(Math.random() * serviceTypes.length);
    
    // Weighted random status selection
    const random = Math.random();
    let status = statuses[0];
    let cumulative = 0;
    for (let j = 0; j < statusWeights.length; j++) {
      cumulative += statusWeights[j];
      if (random <= cumulative) {
        status = statuses[j];
        break;
      }
    }

    // Generate realistic dates
    const daysAgo = Math.floor(Math.random() * 90); // Last 90 days
    const requestDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    let updatedDate = new Date(requestDate);
    if (status === 'IN_PROGRESS') {
      updatedDate = new Date(requestDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000); // Started within 2 days
    } else if (status === 'COMPLETED') {
      updatedDate = new Date(requestDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000); // Completed within 7 days
    }

    serviceRequests.push({
      id: uuidv4(),
      userId: randomUser.id,
      carId: randomCar ? randomCar.id : null,
      serviceType: serviceTypes[serviceTypeIndex],
      description: serviceDescriptions[serviceTypeIndex],
      status: status,
      requestDate: requestDate,
      updatedDate: updatedDate
    });
  }

  return { users, cars, serviceRequests };
};

// Generate realistic license plate
const generateLicensePlate = () => {
  const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
  const state = states[Math.floor(Math.random() * states.length)];
  const numbers = Math.floor(Math.random() * 9000) + 1000;
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                 String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                 String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${state} ${letters}${numbers}`;
};

module.exports = { generateRealisticData };
