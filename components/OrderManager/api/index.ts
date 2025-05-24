import type { OrderStatus, OrderWithUser } from '~/types/order';
import { deleteOrder } from './deleteOrder';
import { fetchAllOrders } from './fetchAllOrders';
import { updateOrderStatus } from './updateOrderStatus';

export { deleteOrder, fetchAllOrders, updateOrderStatus };
export type { OrderStatus, OrderWithUser };
