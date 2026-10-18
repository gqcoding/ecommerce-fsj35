"use client";
import { useCart } from "@/components/CartProvider";
export function CartCount() { const { count } = useCart(); return <span className="cart-count">{count}</span>; }