const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');
const store = require('./store');

const DEMO_PASSWORD = 'password123'; // public demo password, never used for real accounts

const SEED_USERS = [
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

const SEED_CARS = [
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

const SERVICE_TYPES = ['Oil Change', 'Brake Inspection', 'Tire Rotation', 'Engine Diagnostic', 'AC Service', 'Transmission Service', 'Battery Replacement', 'Wheel Alignment'];
const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const DESCRIPTIONS = [
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

const daysAgo = (max) => new Date(Date.now() - Math.random() * max * 24 * 60 * 60 * 1000);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  store.users = SEED_USERS.map((u) => ({
    id: randomUUID(),
    ...u,
    password: passwordHash,
    createdAt: daysAgo(30)
  }));

  const customers = store.users.filter((u) => u.role === 'CUSTOMER');

  store.cars = SEED_CARS.map((c, i) => ({
    id: randomUUID(),
    userId: customers[i % customers.length].id,
    ...c,
    createdAt: daysAgo(20)
  }));

  store.serviceRequests = Array.from({ length: 25 }, () => {
    const owner = pick(customers);
    const ownerCars = store.cars.filter((c) => c.userId === owner.id);
    return {
      id: randomUUID(),
      userId: owner.id,
      carId: ownerCars.length ? pick(ownerCars).id : null,
      serviceType: pick(SERVICE_TYPES),
      description: pick(DESCRIPTIONS),
      status: pick(STATUSES),
      requestDate: daysAgo(15),
      updatedDate: daysAgo(10)
    };
  });
}

module.exports = { seed };
