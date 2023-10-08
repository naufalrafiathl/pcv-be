const productService = require('../services/productServices');

exports.getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const products = await productService.getProducts(page, limit);
    res.json(products);
};

exports.searchProducts = async (req, res) => {
    const query = req.query.query;
    const pageNumber = Number(req.query.page) || 1;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    try {
        const result = await productService.searchProducts(query, pageNumber);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

exports.getProductById = async (req, res) => {
    const product = await productService.getProductById(parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
};

exports.addProduct = async (req, res) => {
    const newProduct = await productService.addProduct(req.body);
    res.json(newProduct);
};

exports.updateProduct = async (req, res) => {
    const updatedProduct = await productService.updateProduct(parseInt(req.params.id), req.body);
    res.json(updatedProduct);
};

exports.deleteProduct = async (req, res) => {
    const deletedProduct = await productService.deleteProduct(parseInt(req.params.id));
    res.json(deletedProduct);
};

exports.getProductPages = async (req, res) => {
    try {
        const pages = await productService.getProductPages();
        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the total pages.' });
    }
};
