import React from 'react';
import { ShoppingBag, ChevronRight, User, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import { signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onCartToggle: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartToggle, cartCount }) => {
  const { user, profile, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-bottom border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-900 text-white p-1.5 rounded-lg">
            <span className="font-serif font-bold text-xl">聚</span>
          </div>
          <span className="font-serif font-semibold text-lg tracking-tight text-emerald-950">聚茗坊 Tea Shop</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-emerald-900/70 hover:text-emerald-900 font-medium transition-colors">菜單 Menu</a>
          <a href="#" className="text-emerald-900/70 hover:text-emerald-900 font-medium transition-colors">關於 About</a>
          {isAdmin && (
            <a href="#admin" className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm">
              <Settings size={14} />
              後台 Admin
            </a>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onCartToggle}
            className="relative p-2 text-emerald-900 hover:bg-emerald-50 rounded-full transition-colors group"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-emerald-950 leading-tight">{profile?.displayName || '用戶'}</p>
                <p className="text-[10px] text-emerald-600/70 leading-tight uppercase tracking-wider">{profile?.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 text-emerald-900 hover:text-red-600 rounded-full transition-all"
                title="登出 Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 bg-emerald-900 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-800 transition-all shadow-sm shadow-emerald-200 active:scale-95"
            >
              <User size={18} />
              <span>登入 Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
