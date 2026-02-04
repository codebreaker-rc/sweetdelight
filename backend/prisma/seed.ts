import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@cakeshop.com' },
    update: {},
    create: {
      email: 'demo@cakeshop.com',
      name: 'Demo User',
      password: hashedPassword,
      phone: '+1234567890',
      address: '123 Main Street, City, State 12345',
    },
  });

  const cakes = [
    {
      name: 'Chocolate Fudge Cake',
      description: 'Rich and moist chocolate cake with creamy fudge frosting',
      price: 35.99,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
      category: 'Chocolate',
      weight: '1kg',
      flavor: 'Chocolate',
      inStock: true,
    },
    {
      name: 'Vanilla Dream Cake',
      description: 'Classic vanilla sponge cake with vanilla buttercream',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1588195538326-c5b1e5b80c0b?w=500',
      category: 'Vanilla',
      weight: '1kg',
      flavor: 'Vanilla',
      inStock: true,
    },
    {
      name: 'Red Velvet Delight',
      description: 'Smooth red velvet cake with cream cheese frosting',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500',
      category: 'Red Velvet',
      weight: '1kg',
      flavor: 'Red Velvet',
      inStock: true,
    },
    {
      name: 'Strawberry Shortcake',
      description: 'Fresh strawberries with light whipped cream and sponge',
      price: 32.99,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500',
      category: 'Fruit',
      weight: '1kg',
      flavor: 'Strawberry',
      inStock: true,
    },
    {
      name: 'Black Forest Cake',
      description: 'Chocolate sponge with cherries and whipped cream',
      price: 42.99,
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500',
      category: 'Chocolate',
      weight: '1.5kg',
      flavor: 'Chocolate Cherry',
      inStock: true,
    },
    {
      name: 'Lemon Bliss Cake',
      description: 'Zesty lemon cake with tangy lemon frosting',
      price: 28.99,
      image: 'https://images.unsplash.com/photo-1519915212116-715fb0c02e8a?w=500',
      category: 'Citrus',
      weight: '1kg',
      flavor: 'Lemon',
      inStock: true,
    },
    {
      name: 'Carrot Walnut Cake',
      description: 'Moist carrot cake with cream cheese and walnuts',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500',
      category: 'Specialty',
      weight: '1kg',
      flavor: 'Carrot',
      inStock: true,
    },
    {
      name: 'Tiramisu Cake',
      description: 'Coffee-soaked layers with mascarpone cream',
      price: 44.99,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500',
      category: 'Specialty',
      weight: '1kg',
      flavor: 'Coffee',
      inStock: true,
    },
    {
      name: 'Blueberry Cheesecake',
      description: 'Creamy cheesecake with fresh blueberry topping',
      price: 38.99,
      image: 'https://images.unsplash.com/photo-1533134242820-b4f6b6c5c2b0?w=500',
      category: 'Cheesecake',
      weight: '1kg',
      flavor: 'Blueberry',
      inStock: true,
    },
    {
      name: 'Oreo Cookies & Cream',
      description: 'Chocolate cake with Oreo cookies and cream frosting',
      price: 36.99,
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
      category: 'Chocolate',
      weight: '1kg',
      flavor: 'Cookies & Cream',
      inStock: true,
    },
    {
      name: 'Raspberry Chocolate Cake',
      description: 'Dark chocolate cake with raspberry filling',
      price: 40.99,
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500',
      category: 'Chocolate',
      weight: '1kg',
      flavor: 'Raspberry Chocolate',
      inStock: true,
    },
    {
      name: 'Coconut Paradise Cake',
      description: 'Tropical coconut cake with coconut cream frosting',
      price: 33.99,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500',
      category: 'Tropical',
      weight: '1kg',
      flavor: 'Coconut',
      inStock: true,
    },
  ];

  for (const cake of cakes) {
    await prisma.cake.upsert({
      where: { id: cake.name },
      update: {},
      create: cake,
    });
  }

  console.log('Database seeded successfully!');
  console.log(`Created user: ${user.email}`);
  console.log(`Created ${cakes.length} cakes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
