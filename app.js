const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const authentication = require('./middlewares/jwt');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());  // Configure CORS as required for your setup

app.get('/', (req, res) => {
    res.send('Welcome to the Product API server!');
});

app.use('/secure-endpoint', authentication.authenticateJWT, (req, res) => {
    res.json({ message: 'You have accessed a secure endpoint' });
});

// Product routes
app.use('/products', productRoutes);

module.exports = app;
