import { prisma } from '../lib/prisma';

export const productRepository = {
   getProduct: async (id: number) => {
      return prisma.product.findUnique({
         where: { id },
      });
   },
};
