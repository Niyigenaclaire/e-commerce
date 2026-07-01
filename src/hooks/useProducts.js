// src/hooks/useProducts.js
// TanStack Query hooks for product server state
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById, fetchCategories } from '../api/products';

export function useProducts({ category = '', sort = '', search = '' } = {}) {
  return useQuery({
    queryKey: ['products', { category, sort, search }],
    queryFn: () => fetchProducts({ category: category || undefined, sort }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      if (!search) return data;
      const lower = search.toLowerCase();
      return data.filter((p) =>
        p.title.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
      );
    },
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000, // categories rarely change
  });
}
