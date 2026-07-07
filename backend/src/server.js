const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const facilityRoutes = require('./routes/facilities');
const applicationRoutes = require('./routes/applications');
const tenantRoutes = require('./routes/tenants');
const paymentRoutes = require('./routes/payments');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const expenseRoutes = require('./routes/expenses');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Ensure upload directories exist
const fs = require('fs');
['uploads/payments', 'uploads/avatars'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve uploads as static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Kost Management API' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
