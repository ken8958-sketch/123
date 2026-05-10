import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ChevronRight, CreditCard } from 'lucide-react';
import { OrderItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onRemove: (idx: number) => void;
  onCheckout: () => void;
  loading?: boolean;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onCheckout, loading }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-emerald-950/30 backdrop-blur-sm z-[200]" 
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[201] flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-900 text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <h2 className="font-serif font-bold text-xl">購物車 Cart</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-emerald-50 p-6 rounded-full">
                    <ShoppingBag size={48} className="text-emerald-200" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900">購物車還是空的</h3>
                    <p className="text-sm text-emerald-900/50">快去探索美味茶飲吧！</p>
                  </div>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-emerald-950">{item.name}</h4>
                        <span className="font-bold text-emerald-950">${item.price * item.quantity}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-2 text-[11px] font-bold text-emerald-700/50 uppercase tracking-tighter">
                        <span>{item.size}</span>
                        <span>•</span>
                        <span>{item.ice}</span>
                        <span>•</span>
                        <span>{item.sugar}</span>
                        {item.quantity > 1 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-900">x{item.quantity}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemove(idx)}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg self-center transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-emerald-50 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-emerald-900/50 uppercase tracking-widest">總計 Total</span>
                  <span className="font-serif font-black text-3xl text-emerald-950">${total}</span>
                </div>
                <button
                  disabled={loading}
                  onClick={onCheckout}
                  className="w-full bg-emerald-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <CreditCard size={20} />
                      立即下單 Order Now
                    </>
                  )}
                </button>
                <button 
                  onClick={onClose}
                  className="w-full text-center text-sm font-bold text-emerald-900/50 py-2 hover:text-emerald-900 transition-colors"
                >
                  繼續選購 Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
