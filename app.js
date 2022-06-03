const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Controllers
const { globalErrorHandler } = require('./controllers/errors.controller');

// Routers
const { usersRouter } = require('./routes/usersRoutes');
const { productsRouter } = require('./routes/productsRoutes');
const { cartRouter } = require('./routes/cartRoutes');
const { categoriesRouter } = require('./routes/categoriesRoutes');
const { ordersRouter } = require('./routes/orderRoutes');

// Init express app
const app = express();

// Enable CORS
app.use(cors());

// Enable incoming JSON data
app.use(express.json());

// Enable incoming Form-Data
app.use(express.urlencoded({ extended: true }));

// Limit IP requests
const limiter = rateLimit({
  max: 10000,
  windowMs: 3 * 60 * 60 * 1000,
  message: 'Too many requests from this IP',
});

app.use(limiter);

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/category', categoriesRouter);
app.use('/api/v1/orders', ordersRouter);

// Global error handler
app.use('*', globalErrorHandler);

module.exports = { app };
