/**
 * Order type definition
 */
export interface Order {
  address: string;
  created_at: Date | string;
  date: Date | string;
  description: string;
  id: number;
  status: 'CANCELLED' | 'COMPLETED' | 'CONFIRMED' | 'IN_PROGRESS' | 'PENDING';
  updated_at: Date | string;
  userId: number;
}

/**
 * Input type for creating a new order
 */
export interface CreateOrderPayload {
  address: string;
  date: string;
  description: string;
  email: string;
} 
