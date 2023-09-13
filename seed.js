const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create the 'Cigar' category
    const cigarCategory = await prisma.category.create({
        data: {
            name: "Cigar",
        },
    });

    // Montecristo products
    const montecristoProducts = [
        {
            name: "Montecristo No. 4",
            price: 12.50,
            imageUrl: "http://example.com/montecristo4.jpg",
            isDiscount: false,
            isCigarette: false,
            inStock: true,
            cigarCountry: "Cuba",
        },
        {
            name: "Montecristo No. 2",
            price: 16.75,
            imageUrl: "http://example.com/montecristo2.jpg",
            isDiscount: true,
            discountAmount: 1.50,
            isCigarette: false,
            inStock: true,
            cigarCountry: "Cuba",
        },
        {
            name: "Montecristo No. 3",
            price: 14.25,
            imageUrl: "http://example.com/montecristo3.jpg",
            isDiscount: false,
            isCigarette: false,
            inStock: true,
            cigarCountry: "Cuba",
        },
        {
            name: "Montecristo Petit No. 2",
            price: 15.50,
            imageUrl: "http://example.com/montecristopetit2.jpg",
            isDiscount: false,
            isCigarette: false,
            inStock: true,
            cigarCountry: "Cuba",
        },
        {
            name: "Montecristo Double Edmundo",
            price: 18.00,
            imageUrl: "http://example.com/montecristodoubleedmundo.jpg",
            isDiscount: true,
            discountAmount: 2.50,
            isCigarette: false,
            inStock: true,
            cigarCountry: "Cuba",
        },
    ];

    // Romeo y Julieta products
    const romeoYJulietaProducts = [
        {
            name: "Romeo y Julieta No. 1",
            price: 10.50,
            imageUrl: "http://example.com/romeo1.jpg",
            isDiscount: false,
            isCigarette: false,
            inStock: true,
            cigarCountry: "Cuba",
        },
        {
            name: "Romeo y Julieta Churchill",
            price: 14.75,
            imageUrl: "http://example.com/romeochurchill.jpg",
            isDiscount: true,
            discountAmount: 2.00,
            isCigarette: false,
            inStock: true,
            cigarCountry: "Cuba",
        },
        {
            name: "Romeo y Julieta Short Churchill",
            price: 13.00,
            imageUrl: "http://example.com/romeoshortchurchill.jpg",
            isDiscount: false,
            isCigarette: false,
            inStock: true,
            cigarCountry: "Cuba",
        },
        {
            name: "Romeo y Julieta Wide Churchill",
            price: 15.50,
            imageUrl: "http://example.com/romeowidechurchill.jpg",
            isDiscount: true,
            discountAmount: 1.75,
            isCigarette: false,
            inStock: true,
            cigarCountry: "Cuba",
        },
        {
            name: "Romeo y Julieta Petit Royales",
            price: 11.25,
            imageUrl: "http://example.com/romeopetitroyales.jpg",
            isDiscount: false,
            isCigarette: false,
            inStock: true,
            cigarCountry: "Cuba",
        },
    ];

    // Combine both arrays for easy insertion
    const allProducts = [...montecristoProducts, ...romeoYJulietaProducts];

    // Add all products to the 'Cigar' category
    for (const product of allProducts) {
        await prisma.product.create({
            data: {
                ...product,
                category: {
                    connect: {
                        id: cigarCategory.id,
                    },
                },
            },
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
