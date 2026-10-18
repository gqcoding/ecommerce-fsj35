import Link from "next/link";
import { ShoppingBag, Package, Store } from "lucide-react";
import { CartCount } from "@/components/CartCount";

export function Header() {
  return <header className="site-header"><div className="header-inner">
    <Link className="brand" href="/"><span className="brand-mark"><Store size={20}/></span><span>nóva<span className="brand-dot">.</span><small>TIENDA ONLINE</small></span></Link>
    <nav><Link href="/productos">Productos</Link><Link href="/compras"><Package size={16}/> Mis compras</Link><Link className="cart-link" href="/carrito"><ShoppingBag size={17}/> Carrito <CartCount/></Link></nav>
  </div></header>;
}