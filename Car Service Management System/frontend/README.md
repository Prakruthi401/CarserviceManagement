# Car Service Management System - Frontend

React frontend application for the Car Service Management System with a professional automotive theme.

## Technology Stack
- React 18 with functional components and hooks
- React Router 6 for client-side routing
- Axios for HTTP requests
- Bootstrap 5 for responsive UI components
- Material Icons for consistent iconography
- Context API for state management

## Project Structure
```
src/
|-- components/
|   |-- Auth/                              # Authentication components
|   |   |-- Login.js                       # Login page
|   |   |-- Register.js                    # Registration page
|   |-- Admin/                             # Admin dashboard components
|   |   |-- AdminDashboard.js              # Main admin layout
|   |   |-- Dashboard.js                   # Admin home page
|   |   |-- UsersManagement.js             # User management
|   |   |-- ServiceRequestsManagement.js   # Service request management
|   |   |-- CarsManagement.js              # Car management
|   |-- Customer/                          # Customer dashboard components
|   |   |-- CustomerDashboard.js           # Main customer layout
|   |   |-- Dashboard.js                   # Customer home page
|   |   |-- MyCars.js                      # Car management for customers
|   |   |-- ServiceRequests.js            # Service requests for customers
|   |   |-- Profile.js                     # Profile management
|-- contexts/
|   |-- AuthContext.js                    # Authentication context
|-- App.js                                 # Main application component
|-- App.css                                # Global styles
|-- index.js                              # Application entry point
|-- index.css                              # Base styles
```

## Features

### Authentication
- JWT-based authentication
- Role-based routing (Admin/Customer)
- Protected routes
- Automatic token management
- Login/logout functionality

### Admin Dashboard
- Statistics overview
- User management (CRUD operations)
- Service request management with status updates
- Car management
- Responsive sidebar navigation
- Search and filter functionality

### Customer Dashboard
- Personal statistics
- Vehicle management (add/edit/delete cars)
- Service request creation and tracking
- Profile management
- Service history

### UI/UX Features
- Professional automotive theme
- Responsive design for all screen sizes
- Material Design icons
- Bootstrap components
- Loading states and error handling
- Form validation
- Interactive modals and dropdowns

## Installation and Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Setup Steps
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

4. For production build:
   ```bash
   npm run build
   ```

## Configuration

### API Configuration
The frontend is configured to proxy API requests to the backend through the `proxy` setting in `package.json`:
```json
"proxy": "http://localhost:8080"
```

### Environment Variables
Create a `.env` file in the root directory for environment-specific configuration:
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_APP_NAME=Car Service Management System
```

## Component Architecture

### Authentication Flow
1. **AuthContext**: Global authentication state management
2. **Login Component**: User login with form validation
3. **Register Component**: User registration with role selection
4. **Protected Routes**: Route guards based on authentication status

### Dashboard Layout
1. **Sidebar Navigation**: Collapsible sidebar with role-based menu items
2. **Header**: User info and logout functionality
3. **Main Content**: Dynamic content based on selected route

### Data Management
1. **Axios Interceptors**: Automatic token attachment to requests
2. **Error Handling**: Centralized error display and logging
3. **Loading States**: Consistent loading indicators
4. **Form Validation**: Client-side validation with user feedback

## Styling and Theme

### Color Scheme
```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #e74c3c;
  --accent-color: #3498db;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
  --dark-color: #2c3e50;
  --light-color: #ecf0f1;
}
```

### Responsive Design
- Mobile-first approach
- Bootstrap grid system
- Flexible layouts
- Touch-friendly interfaces

### Custom Components
- Stat cards with hover effects
- Status badges
- Progress indicators
- Modal dialogs
- Form controls with validation

## API Integration

### Authentication Endpoints
```javascript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password",
  "phone": "1234567890",
  "role": "CUSTOMER"
}
```

### Data Fetching Patterns
```javascript
// Using Axios with authentication
const fetchData = async () => {
  try {
    const response = await axios.get('/api/users');
    setData(response.data);
  } catch (error) {
    setError(error.response?.data?.error || 'Failed to fetch data');
  }
};
```

## State Management

### AuthContext Structure
```javascript
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  clearError: () => {}
});
```

### Component State Patterns
- useState for local component state
- useEffect for side effects and data fetching
- useContext for global state access
- Custom hooks for reusable logic

## Form Handling

### Validation Rules
- Email format validation
- Password strength requirements
- Phone number format validation
- Required field validation

### Error Handling
- Real-time validation feedback
- Server-side error display
- Form reset on success
- Loading states during submission

## Performance Optimizations

### Code Splitting
- Lazy loading of dashboard components
- Route-based code splitting
- Dynamic imports for large libraries

### Caching Strategies
- API response caching
- Component memoization
- Image optimization
- Bundle size optimization

## Testing

### Unit Testing
```bash
npm test
```

### End-to-End Testing
- Manual testing through browser
- Cross-browser compatibility
- Mobile responsiveness testing

## Deployment

### Build Process
```bash
# Production build
npm run build

# Preview build (serves build directory)
npm run build && npx serve -s build
```

### Environment Configuration
- Development: `npm start`
- Production: Build and deploy static files
- Environment-specific API URLs

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues
1. **CORS Errors**: Verify backend CORS configuration
2. **Authentication Issues**: Check JWT token storage and validation
3. **Routing Problems**: Ensure React Router is properly configured
4. **API Connection**: Verify backend is running and accessible

### Debugging Tools
- React Developer Tools
- Browser DevTools Network tab
- Console logging for API responses
- Error boundary implementation

## Accessibility Features
- Semantic HTML elements
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast color scheme
- Focus management

## Future Enhancements
- Progressive Web App (PWA) features
- Offline functionality
- Real-time notifications
- Advanced animations
- Mobile app development
- Analytics integration
