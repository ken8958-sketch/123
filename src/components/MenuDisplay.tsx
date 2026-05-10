import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, X, Check } from 'lucide-react';
import { Category, Product, OrderItem } from '../types';
import { getCategories, getProducts } from '../services/dataService';

interface MenuDisplayProps {
  onAddToCart: (item: OrderItem) => void;
}

export const MenuDisplay: React.FC<MenuDisplayProps> = ({ onAddToCart }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.categoryId === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 gap-3 mb-8 no-scrollbar scroll-smooth">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
            selectedCategory === 'all' 
              ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-200' 
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          全系列
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat.id 
                ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-200' 
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-32 bg-emerald-50 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group bg-white border border-emerald-50 rounded-2xl p-4 flex gap-4 cursor-pointer hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50/50 transition-all active:scale-[0.98]"
            >
              <div className="w-24 h-24 rounded-xl bg-emerald-50 overflow-hidden flex-shrink-0 relative">
                <img 
                  src={product.imageUrl || `https://picsum.photos/seed/${product.name}/200`} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-1 right-1 bg-emerald-900/90 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                  ${Object.values(product.prices)[0]}+
                </div>
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-emerald-950 font-serif font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-emerald-900/60 text-sm line-clamp-2 leading-relaxed italic">{product.description}</p>
                <div className="mt-auto flex justify-between items-end">
                  <span className="text-xs uppercase tracking-widest text-emerald-700/50 font-bold">Details</span>
                  <div className="bg-emerald-900 text-white p-1 rounded-lg">
                    <Plus size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <DrinkModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAdd={onAddToCart}
        />
      )}
    </div>
  );
};

interface DrinkModalProps {
  product: Product;
  onClose: () => void;
  onAdd: (item: OrderItem) => void;
}

const DrinkModal: React.FC<DrinkModalProps> = ({ product, onClose, onAdd }) => {
  const [size, setSize] = useState('M');
  const [ice, setIce] = useState('正常');
  const [sugar, setSugar] = useState('正常');
  const [qty, setQty] = useState(1);

  const price = product.prices[size] || Object.values(product.prices)[0];

  const handleAdd = () => {
    onAdd({
      productId: product.id,
      name: product.name,
      price,
      quantity: qty,
      size,
      ice,
      sugar,
      toppings: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm" 
      />
      
      <motion.div 
        layoutId={product.id}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur hover:bg-emerald-50 rounded-full z-10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="h-48 relative">
          <img 
            src={product.imageUrl || `https://picsum.photos/seed/${product.name}/400/300`} 
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <h2 className="text-white text-2xl font-serif font-bold">{product.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Size */}
          <div>
            <label className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest block mb-3">容量 Size</label>
            <div className="flex gap-3">
              {Object.keys(product.prices).map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-2 rounded-xl border-2 transition-all font-bold ${
                    size === s ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-emerald-50 text-emerald-900/50 hover:border-emerald-100'
                  }`}
                >
                  {s} 號
                </button>
              ))}
            </div>
          </div>

          {/* Ice / Sugar */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest block mb-3">冰度 Ice</label>
              <select 
                value={ice}
                onChange={e => setIce(e.target.value)}
                className="w-full bg-emerald-50 border-none rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-emerald-200 outline-none"
              >
                {product.options?.ice?.map(i => <option key={i} value={i}>{i}</option>) || (
                  ['正常', '少冰', '微冰', '去冰', '熱'].map(i => <option key={i} value={i}>{i}</option>)
                )}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest block mb-3">甜度 Sugar</label>
              <select 
                value={sugar}
                onChange={e => setSugar(e.target.value)}
                className="w-full bg-emerald-50 border-none rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-emerald-200 outline-none"
              >
                {product.options?.sugar?.map(s => <option key={s} value={s}>{s}</option>) || (
                  ['正常', '七分', '五分', '三分', '無糖'].map(s => <option key={s} value={s}>{s}</option>)
                )}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-emerald-50">
            <div className="flex items-center gap-4 bg-emerald-50 p-1 rounded-xl">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-1.5 text-emerald-900 hover:bg-white rounded-lg transition-colors shadow-sm"
              >
                <Minus size={18} />
              </button>
              <span className="font-bold text-lg min-w-[2ch] text-center">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="p-1.5 text-emerald-900 hover:bg-white rounded-lg transition-colors shadow-sm"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <div className="text-right">
              <p className="text-emerald-950 font-serif font-black text-2xl">${price * qty}</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">總金額 Total</p>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-emerald-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Check size={20} />
            加入購物車 Add to Cart
          </button>
        </div>
      </motion.div>
    </div>
  );
};
