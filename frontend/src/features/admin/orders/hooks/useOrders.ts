import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminOrdersAPI, GetOrdersParams } from '../api/orders.api';

export const useAdminOrders = (params: GetOrdersParams) => {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => AdminOrdersAPI.getAllOrders(params),
    placeholderData: (prev) => prev, // keeps old data visible while fetching new page
  });
};

export const useOrderTimeline = (orderId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'orders', 'timeline', orderId],
    queryFn: () => AdminOrdersAPI.getOrderTimeline(orderId!),
    enabled: !!orderId,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status, remarks }: { id: string, status: string, remarks?: string }) => 
      AdminOrdersAPI.updateOrderStatus(id, status, remarks),
    onSuccess: (updatedOrder) => {
      // Invalidate the orders list and specific order details/timeline
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      // You could also optimistically update the list if needed
    }
  });
};
