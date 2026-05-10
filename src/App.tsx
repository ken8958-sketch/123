import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MenuDisplay } from './components/MenuDisplay';
import { Cart } from './components/Cart';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderItem, Order } from './types';
import { createOrder } from './services/dataService';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, ChevronDown, CheckCircle2 } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './services/firebase';

function MainApp() {
  const { user, profile, isAdmin, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const handleAddToCart = (item: OrderItem) => {
    setCartItems(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (idx: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCheckout = async () => {
    if (!user) {
      if (confirm("請先登入後再下單 Choose Login?")) {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
      return;
    }

    setOrderLoading(true);
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user.uid,
      customerName: profile?.displayName || user.displayName || 'Customer',
      items: cartItems,
      totalAmount: total,
      status: 'pending',
    };

    const id = await createOrder(orderData);
    if (id) {
      setLastOrderId(id);
      setCartItems([]);
      setIsCartOpen(false);
      
      setTimeout(() => setLastOrderId(null), 5000);
    }
    setOrderLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-emerald-950 font-sans">
      <Navbar onCartToggle={() => setIsCartOpen(true)} cartCount={cartItems.length} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 border-b border-emerald-50 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] aspect-square bg-emerald-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] aspect-square bg-emerald-50 rounded-full blur-[80px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="md:w-3/5 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-emerald-900 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
            >
              <Coffee size={14} />
              <span>工藝茶飲 聚在這一刻</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-serif font-black leading-[0.9] tracking-tighter mb-8 bg-gradient-to-br from-emerald-950 to-emerald-800 bg-clip-text text-transparent"
            >
              聚茗盛宴<br />
              <span className="text-4xl md:text-6xl opacity-80 italic">The Tea Collection</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-emerald-900/60 max-w-xl mb-10 leading-relaxed font-medium"
            >
              精選高山原葉，秉持古法冷泡萃取。每一杯，皆是對茶道的極致敬意。
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 justify-center md:justify-start"
            >
              <button className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-emerald-200 hover:bg-emerald-800 transition-all flex items-center gap-3 active:scale-95 group">
                立即點餐 Shop Now
                <ChevronDown className="group-hover:translate-y-1 transition-transform" />
              </button>
              <div className="flex -space-x-4">
                {[1, 2, 3].map(i => (
                  <img 
                    key={i} 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                    className="w-12 h-12 rounded-full border-4 border-[#FDFCF9] bg-white" 
                    alt="user"
                    referrerPolicy="no-referrer"
                  />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-[#FDFCF9] bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                  +1.2k
                </div>
              </div>
              <p className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest pl-2">已服務超過 1200+ 位品茗客</p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.4 }}
            className="md:w-2/5 aspect-[4/5] bg-emerald-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-100 relative group"
          >
            <img 
              src="https://images.unsplash.com/photo-1544787210-282aa518d613?q=80&w=1974&auto=format&fit=crop" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
              alt="Tea hero"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20 relative overflow-hidden">
        <MenuDisplay onAddToCart={handleAddToCart} />
      </section>

      {/* Admin Section (Conditional) */}
      {isAdmin && <AdminDashboard />}

      <footer className="py-12 bg-white border-t border-emerald-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-serif font-black text-2xl text-emerald-950 mb-2">聚茗坊</h3>
            <p className="text-emerald-900/40 text-sm font-medium">© 2026 聚茗坊 Tea Shop. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-emerald-900/60 font-bold text-sm uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-900 transition-colors">Instagram</a>
            <a href="#" className="hover:text-emerald-900 transition-colors">Line</a>
            <a href="#" className="hover:text-emerald-900 transition-colors">Facebook</a>
          </div>
        </div>
      </footer>

      {/* Overlays / Modals */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
        loading={orderLoading}
      />

      {/* Order Success Toast */}
      <AnimatePresence>
        {lastOrderId && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-emerald-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-700/50 backdrop-blur"
          >
            <div className="bg-emerald-500 rounded-full p-1">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-bold">訂單已成功送出！</p>
              <p className="text-xs text-white/60 font-mono">訂單編號: #{lastOrderId.slice(-6).toUpperCase()}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Blocking Overlay */}
      {authLoading && (
        <div className="fixed inset-0 z-[1000] bg-white flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-50 border-t-emerald-900 rounded-full"
          />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
