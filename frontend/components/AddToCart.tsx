"use client";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/types";
export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart(); const [added, setAdded] = useState(false);
  return <button className="button button-primary" onClick={() => { add(product); setAdded(true); window.setTimeout(() => setAdded(false), 1400); }}>{added ? <Check size={17}/> : <ShoppingCart size={17}/>} {added ? "Agregado" : "Agregar al carrito"}</button>;
}