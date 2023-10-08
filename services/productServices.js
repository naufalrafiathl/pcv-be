const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProducts = async (page, limit) => {
    const skip = (page - 1) * limit;
    const products = await prisma.product.findMany({ take: limit, skip: skip });
    const totalProducts = await prisma.product.count();

    return {
        data: products,
        meta: {
            totalProducts,
            currentPage: page,
            perPage: limit,
            totalPages: Math.ceil(totalProducts / limit)
        }
    };
};

exports.searchProducts = async (query, pageNumber, resultsPerPage = 10) => {
    const totalProducts = await prisma.product.count({
        where: { name: { contains: query, mode: 'insensitive' } }
    });
    const products = await prisma.product.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        skip: (pageNumber - 1) * resultsPerPage,
        take: resultsPerPage
    });
    return {
        data: products,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / resultsPerPage)
    };
};

exports.getProductById = async (id) => {
    return await prisma.product.findUnique({ where: { id } });
};

exports.addProduct = async (productData) => {
    return await prisma.product.create({ data: productData });
};

exports.updateProduct = async (id, updateData) => {
    return await prisma.product.update({ where: { id }, data: updateData });
};

exports.deleteProduct = async (id) => {
    return await prisma.product.delete({ where: { id } });
};

exports.getProductPages = async () => {
    const totalProducts = await prisma.product.count();
    return { totalPages: Math.ceil(totalProducts / 6) };
};
