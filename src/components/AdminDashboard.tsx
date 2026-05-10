import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ChevronRight,
  Database
} from 'lucide-react';
import { Order, OrderStatus, OrderStatusType } from '../types';
import { subscribeToOrders, updateOrderStatus, seedSampleData } from '../services/dataService';

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, status: OrderStatusType) => {
    await updateOrderStatus(id, status);
  };

  const handleSeed = async () => {
    if (!confirm("這將會加入初始範例資料，確定嗎？")) return;
    setSeeding(true);
    try {
      await seedSampleData();
      alert("範例資料已成功加入！");
    } catch (err) {
      alert("資料初始化失敗");
    } finally {
      setSeeding(false);
    }
  };

  const getStatusColor = (status: OrderStatusType) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'making': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ready': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div id="admin" className="max-w-7xl mx-auto px-4 py-12 border-t border-emerald-100 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif font-black text-emerald-950 mb-1 flex items-center gap-3">
            <Package className="text-emerald-600" />
            管裡後台 Management
          </h2>
          <p className="text-emerald-900/60 font-medium">即時控管訂單狀態與系統資料。</p>
        </div>
        
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all font-bold text-sm disabled:opacity-50"
        >
          <Database size={16} />
          {seeding ? '寫入中...' : '初始化範例資料 Seed Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-emerald-200">
            <RefreshCw className="animate-spin" size={48} />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-emerald-100 rounded-3xl py-20 text-center flex flex-col items-center">
            <Package size={64} className="text-emerald-50 mb-4" />
            <h3 className="text-lg font-bold text-emerald-950">尚無任何訂單</h3>
            <p className="text-emerald-900/40">開啟前台下單些飲料吧！</p>
          </div>
        ) : (
          orders.map(order => (
            <motion.div 
              layout
              key={order.id}
              className="bg-white border border-emerald-50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-grow space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-black text-emerald-950 font-mono">#{order.id.slice(-6).toUpperCase()}</span>
                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                    {order.customerName && (
                      <span className="text-sm font-bold bg-emerald-950 text-white px-2 py-0.5 rounded-md">{order.customerName}</span>
                    )}
                    <div className="flex items-center gap-1.5 text-emerald-900/40 text-xs font-bold font-mono">
                      <Clock size={12} />
                      {order.createdAt?.toDate().toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="space-y-2 pl-2 border-l-2 border-emerald-100">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <div className="flex gap-2">
                          <span className="font-black text-emerald-950">x{item.quantity}</span>
                          <span className="text-emerald-900/70">{item.name} ({item.size})</span>
                          <span className="text-[10px] text-emerald-600/50 uppercase font-bold self-center">
                            {item.sugar} / {item.ice}
                          </span>
                        </div>
                        <span className="font-bold text-emerald-950/40">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between py-2 border-t border-emerald-50 items-end">
                    <div className="text-[10px] text-emerald-900/30 font-bold uppercase tracking-widest">
                      Customer ID: {order.userId.slice(0, 8)}...
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none">Total Amount</p>
                      <p className="text-2xl font-serif font-black text-emerald-950 leading-none">${order.totalAmount}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:w-64 flex flex-col gap-2 bg-emerald-50/50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-2">更新狀態 Update Status</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <StatusButton 
                      active={order.status === 'making'} 
                      onClick={() => handleStatusUpdate(order.id, 'making')}
                      label="製作中"
                      color="bg-blue-600"
                    />
                    <StatusButton 
                      active={order.status === 'ready'} 
                      onClick={() => handleStatusUpdate(order.id, 'ready')}
                      label="待取餐"
                      color="bg-emerald-600"
                    />
                    <StatusButton 
                      active={order.status === 'completed'} 
                      onClick={() => handleStatusUpdate(order.id, 'completed')}
                      label="已完成"
                      color="bg-purple-600"
                    />
                    <StatusButton 
                      active={order.status === 'cancelled'} 
                      onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                      label="取消"
                      color="bg-red-600"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

const StatusButton = ({ active, onClick, label, color }: { active: boolean, onClick: () => void, label: string, color: string }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
      active 
        ? `${color} text-white shadow-lg` 
        : 'bg-white text-emerald-900/40 hover:text-emerald-900 border border-emerald-100 hover:border-emerald-200 shadow-sm'
    }`}
  >
    {active && <CheckCircle2 size={12} />}
    {label}
  </button>
);
