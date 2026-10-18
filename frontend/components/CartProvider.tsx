"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/lib/types";

type CartContextValue = { items: CartItem[]; add: (product: Product) => void; remove: (id: Product["id"]) => void; setQuantity: (id: Product["id"], quantity: number) => void; clear: () => void; count: number };
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const saved = localStorage.getItem("fsj35-cart"); if (saved) setItems(JSON.parse(saved)); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("fsj35-cart", JSON.stringify(items)); }, [items, ready]);
  const value = useMemo<CartContextValue>(() => ({
    items,
    add: (product) => setItems((old) => {
      const found = old.find((item) => String(item.product.id) === String(product.id));
      return found ? old.map((item) => String(item.product.id) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item) : [...old, { product, quantity: 1 }];
    }),
    remove: (id) => setItems((old) => old.filter((item) => String(item.product.id) !== String(id))),
    setQuantity: (id, quantity) => setItems((old) => quantity <= 0 ? old.filter((item) => String(item.product.id) !== String(id)) : old.map((item) => String(item.product.id) === String(id) ? { ...item, quantity } : item)),
    clear: () => setItems([]),
    count: items.reduce((sum, item) => sum + item.quantity, 0),
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}