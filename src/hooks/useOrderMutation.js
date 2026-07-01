// src/hooks/useOrderMutation.js
// TanStack Query mutation for placing orders
import { useMutation } from '@tanstack/react-query';
import { placeOrder } from '../api/orders';

export function useOrderMutation() {
  return useMutation({
    mutationFn: placeOrder,
  });
}
