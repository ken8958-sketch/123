/**
 * Shared types for the Tea Shop application.
 */

export enum OrderStatus {
  PENDING = 'pending',
  MAKING = 'making',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export type OrderStatusType = 'pending' | 'making' | 'ready' | 'completed' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  order: number;
  active: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  prices: { [size: string]: number };
  imageUrl: string;
  active: boolean;
  order: number;
  options?: {
    ice?: string[];
    sugar?: string[];
    toppings?: { name: string; price: number }[];
  };
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  ice: string;
  sugar: string;
  toppings: { name: string; price: number }[];
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatusType;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  note?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'customer';
  displayName: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
