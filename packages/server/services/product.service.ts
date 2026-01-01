import { productRepository } from '../repositories/product.repository';

export const productService = {
   getProduct: async (id: number) => {
      return productRepository.getProduct(id);
   },
};
