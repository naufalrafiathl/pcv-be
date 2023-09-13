

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('./middleware/jwt.js')


const prisma = new PrismaClient();
const app = express();
const bodyParser = require('body-parser');
const secret = env("SECRET_KEY");  // This should be a complex string stored securely, not hardcoded.
const token = jwt.sign({ api: 'myAPI' }, secret, { expiresIn: '24h' });
const cors = require('cors');

app.use(cors());


app.use(express.json());
app.use(bodyParser.json());

const PORT = 3000;


console.log(token);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/products', async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
  });

// List all products with pagination
app.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
        take: limit,
        skip: skip
    });
    
    // Optionally, you can also return the total number of products
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


app.post('/products', async (req, res) => {
  const product = await prisma.product.create({
    data: req.body
  });
  res.json(product);
});

app.post('/category', async (req, res) => {
    const { name } = req.body;

    try {
        const category = await prisma.category.create({
            data: { name },
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: "Failed to create category." });
    }
});

app.post('/product', async (req, res) => {
    const { name, price, imageUrl, isDiscount, discountAmount, isCigarette, inStock, cigarCountry, categoryId } = req.body;

    try {
        const product = await prisma.product.create({
            data: {
                name,
                price,
                category,
                imageUrl,
                isDiscount,
                discountAmount,
                isCigarette,
                inStock,
                cigarCountry,
                category: { connect: { id: categoryId } }
            },
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to create product." });
    }
});


