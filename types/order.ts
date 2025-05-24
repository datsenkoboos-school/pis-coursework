export type OrderStatus = 'CANCELLED' | 'COMPLETED' | 'CONFIRMED' | 'IN_PROGRESS' | 'PENDING';

export interface Order {
  address: string;
  created_at: Date | string;
  date: Date | string;
  description: string;
  id: number;
  status: OrderStatus;
  updated_at: Date | string;
  userId: number;
}

export interface CreateOrderPayload {
  address: string;
  date: string;
  description: string;
  email: string;
}

export interface OrderWithUser extends Order {
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}
