const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());  // Make sure to configure CORS as required for your setup

const secret = process.env.YOUR_SECRET;  // Assuming you store the secret in an environment variable

function authenticateJWT(req, res, next) {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    });
}

app.get('/', (req, res) => {
    res.send('Welcome to the Product API server!');
});

app.use('/secure-endpoint', authenticateJWT, (req, res) => {
    res.json({ message: 'You have accessed a secure endpoint' });
});

// Products CRUD endpoints

// List all products with pagination
app.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
        take: limit,
        skip: skip
    });
    
    const totalProducts = await prisma.product.count();

    res.json({
        data: products,
        meta: {
            totalProducts: totalProducts,
            currentPage: page,
            perPage: limit,
            totalPages: Math.ceil(totalProducts / limit)
        }
    });
});

app.get('/products/search', async (req, res) => {
    const query = req.query.query;
    const resultsPerPage = 10; // Adjust as needed
    const pageNumber = Number(req.query.page) || 1;

    console.log(`Search query received: ${query}`);

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    try {
        // Fetching total count for pagination
        const totalProducts = await prisma.product.count({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive'  // Case-insensitive search
                }
            }
        });

        console.log(`Total products found for query ${query}: ${totalProducts}`);

        const totalPages = Math.ceil(totalProducts / resultsPerPage);

        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive'  // Case-insensitive search
                }
            },
            skip: (pageNumber - 1) * resultsPerPage,
            take: resultsPerPage
        });

        console.log(`Returning products for page ${pageNumber}:`, products);

        return res.json({
            data: products,
            currentPage: pageNumber,
            totalPages: totalPages
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Something went wrong.' });
    }
});


// Get a single product
app.get('/products/:id', async (req, res) => {
    const product = await prisma.product.findUnique({
        where: { id: parseInt(req.params.id) }
    });
    res.json(product);
});

// Add a new product
app.post('/products', authenticateJWT, async (req, res) => {
    const newProduct = await prisma.product.create({
        data: req.body
    });
    res.json(newProduct);
});


app.get('/product-pages', async (req, res) => {
    try {
        // Get the total number of products from the database
        const totalProducts = await prisma.product.count();

        // Compute the total pages
        const totalPages = Math.ceil(totalProducts / 6);

        // Return the result
        res.json({ totalPages });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the total pages.' });
    }
});


// Update a product
app.put('/products/:id', authenticateJWT, async (req, res) => {
    const updatedProduct = await prisma.product.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
    });
    res.json(updatedProduct);
});

// Delete a product
app.delete('/products/:id', authenticateJWT, async (req, res) => {
    const deletedProduct = await prisma.product.delete({
        where: { id: parseInt(req.params.id) }
    });
    res.json(deletedProduct);
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
