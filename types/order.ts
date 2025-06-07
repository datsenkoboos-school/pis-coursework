export type OrderStatus = 'CANCELLED' | 'COMPLETED' | 'CONFIRMED' | 'IN_PROGRESS' | 'PENDING';

export interface MenuItem {
  description: string;
  id: number;
  is_available: boolean;
  name: string;
  price: number;
}

export interface OrderItem {
  id: number;
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  address: string;
  created_at: Date | string;
  date: Date | string;
  id: number;
  items: OrderItem[];
  status: OrderStatus;
  updated_at: Date | string;
  userId: number;
}

export interface CreateOrderPayload {
  address: string;
  date: string;
  email: string;
  orderItems: {
    menuItemId: number;
    quantity: number;
  }[];
}

export interface OrderWithUser extends Order {
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}
