import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Category, Product, Order, OrderStatusType, OperationType } from '../types';
import { handleFirestoreError } from './error-handler';

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const path = 'categories';
  try {
    const q = query(collection(db, path), where('active', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
};

// Products
export const getProducts = async (categoryId?: string): Promise<Product[]> => {
  const path = 'products';
  try {
    let q = query(collection(db, path), where('active', '==', true), orderBy('order', 'asc'));
    if (categoryId) {
      q = query(q, where('categoryId', '==', categoryId));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
};

// Orders
export const subscribeToOrders = (onUpdate: (orders: Order[]) => void, userId?: string) => {
  const path = 'orders';
  let q = query(collection(db, path), orderBy('createdAt', 'desc'));
  
  if (userId) {
    q = query(q, where('userId', '==', userId));
  }

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    onUpdate(orders);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, path);
  });
};

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const path = 'orders';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return '';
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatusType) => {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
};

// Seed Data (Admin only)
export const seedSampleData = async () => {
  const cats = [
    { name: '原沏茗茶', order: 1, active: true },
    { name: '醇乳奶茶', order: 2, active: true },
    { name: '特調果茶', order: 3, active: true }
  ];

  for (const cat of cats) {
    const cRef = await addDoc(collection(db, 'categories'), cat);
    if (cat.name === '原沏茗茶') {
      const prods = [
        { categoryId: cRef.id, name: '薩姆紅', description: '麥芽熟果', prices: { M: 30, L: 35 }, active: true, order: 1, options: { ice: ['正常', '少冰', '微冰', '去冰', '熱'], sugar: ['正常', '七分', '五分', '三分', '無糖'] } },
        { categoryId: cRef.id, name: '茉沏綠', description: '茉莉窨花', prices: { M: 30, L: 35 }, active: true, order: 2, options: { ice: ['正常', '少冰', '微冰', '去冰', '熱'], sugar: ['正常', '七分', '五分', '三分', '無糖'] } },
        { categoryId: cRef.id, name: '貴妃烏龍', description: '蜜果甜香', prices: { M: 40, L: 45 }, active: true, order: 3, options: { ice: ['正常', '少冰', '微冰', '去冰', '熱'], sugar: ['正常', '七分', '五分', '三分', '無糖'] } }
      ];
      for (const p of prods) await addDoc(collection(db, 'products'), p);
    }
  }
};
