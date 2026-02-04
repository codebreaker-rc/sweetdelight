import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface Context {
  prisma: PrismaClient;
}

export const resolvers = {
  Query: {
    cakes: async (_: any, { search, category }: { search?: string; category?: string }) => {
      const where: any = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { flavor: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      if (category) {
        where.category = category;
      }
      
      return prisma.cake.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    },

    cake: async (_: any, { id }: { id: string }) => {
      return prisma.cake.findUnique({
        where: { id },
      });
    },

    categories: async () => {
      const cakes = await prisma.cake.findMany({
        select: { category: true },
        distinct: ['category'],
      });
      return cakes.map(cake => cake.category);
    },

    cart: async (_: any, { userId }: { userId: string }) => {
      return prisma.cartItem.findMany({
        where: { userId },
        include: { cake: true },
        orderBy: { createdAt: 'desc' },
      });
    },

    orders: async (_: any, { userId }: { userId: string }) => {
      return prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: { cake: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    },

    order: async (_: any, { id }: { id: string }) => {
      return prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: { cake: true },
          },
        },
      });
    },

    me: async (_: any, { token }: { token: string }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
        return prisma.user.findUnique({
          where: { id: decoded.userId },
        });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
  },

  Mutation: {
    register: async (_: any, { email, password, name, phone, address }: any) => {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone,
          address,
        },
      });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '7d',
      });

      return { token, user };
    },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '7d',
      });

      return { token, user };
    },

    addToCart: async (_: any, { userId, cakeId, quantity }: any) => {
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          userId_cakeId: {
            userId,
            cakeId,
          },
        },
      });

      if (existingItem) {
        return prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
          include: { cake: true },
        });
      }

      return prisma.cartItem.create({
        data: {
          userId,
          cakeId,
          quantity,
        },
        include: { cake: true },
      });
    },

    updateCartItem: async (_: any, { id, quantity }: { id: string; quantity: number }) => {
      return prisma.cartItem.update({
        where: { id },
        data: { quantity },
        include: { cake: true },
      });
    },

    removeFromCart: async (_: any, { id }: { id: string }) => {
      await prisma.cartItem.delete({
        where: { id },
      });
      return true;
    },

    clearCart: async (_: any, { userId }: { userId: string }) => {
      await prisma.cartItem.deleteMany({
        where: { userId },
      });
      return true;
    },

    createOrder: async (_: any, { userId, deliveryAddress, phone, customerName, items }: any) => {
      const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

      const order = await prisma.order.create({
        data: {
          userId,
          total,
          deliveryAddress,
          phone,
          customerName,
          paymentMethod: 'PAY_ON_DELIVERY',
          items: {
            create: items.map((item: any) => ({
              cakeId: item.cakeId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: { cake: true },
          },
        },
      });

      await prisma.cartItem.deleteMany({
        where: { userId },
      });

      return order;
    },

    updateOrderStatus: async (_: any, { id, status }: { id: string; status: string }) => {
      return prisma.order.update({
        where: { id },
        data: { status: status as any },
        include: {
          items: {
            include: { cake: true },
          },
        },
      });
    },
  },
};
