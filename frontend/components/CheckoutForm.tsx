"use client";
import { useState, useTransition } from "react";
import { CreditCard, ShieldCheck, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { createOrderAction } from "@/lib/actions";
import { money, productName } from "@/lib/types";

export function CheckoutForm() {
  const { items, remove, setQuantity, clear } = useCart();
  const [error, setError] = useState(""); const [info, setInfo] = useState(""); const [pending, startTransition] = useTransition();
  const total = items.reduce((sum, item) => sum + Number(item.product.price || 0) * item.quantity, 0);
  function checkout() {
    setError(""); setInfo("");
    startTransition(async () => {
      const result = await createOrderAction({ items: items.map(({ product, quantity }) => ({ product_id: product.id, quantity })) });
      if (result.error) setError(result.error);
      else if (result.checkoutUrl) { window.location.assign(result.checkoutUrl); }
      else setInfo(result.success || "Revisa el estado de la orden.");
    });
  }
  return <div className="checkout-layout"><section className="panel"><div className="panel-heading"><div><span className="eyebrow">TU SELECCIÓN</span><h2>Resumen del carrito</h2></div><span className="muted">{items.length} productos</span></div>
    {!items.length ? <div className="empty-state"><h3>Tu carrito está vacío</h3><p>Explora el catálogo y agrega tus productos favoritos.</p><a className="button button-primary" href="/productos">Ver productos</a></div> :
    <div className="cart-items">{items.map(({ product, quantity }) => <div className="cart-item" key={product.id}><div className="cart-thumb">{(product.image_url || product.image) ? <img src={product.image_url || product.image || ""} alt=""/> : <span>✳</span>}</div><div className="cart-item-main"><strong>{productName(product)}</strong><span>{money(product.price)} c/u</span><div className="quantity-control"><button aria-label="Restar" onClick={() => setQuantity(product.id, quantity - 1)}><Minus size={13}/></button><span>{quantity}</span><button aria-label="Sumar" onClick={() => setQuantity(product.id, quantity + 1)}><Plus size={13}/></button></div></div><div className="cart-item-end"><strong>{money(Number(product.price) * quantity)}</strong><button className="icon-button danger" aria-label="Eliminar producto" onClick={() => remove(product.id)}><Trash2 size={16}/></button></div></div>)}</div>}
  </section><aside className="panel order-summary"><span className="eyebrow">TOTAL DE COMPRA</span><h2>Tu pedido</h2><div className="summary-line"><span>Subtotal</span><span>{money(total)}</span></div><div className="summary-line"><span>Envío</span><span className="free">Por confirmar</span></div><div className="summary-total"><span>Total estimado</span><strong>{money(total)}</strong></div><p className="small-note">El total definitivo se calcula y valida en el servidor de la API.</p>
    {error && <p className="alert alert-error">{error}</p>}{info && <p className="alert alert-info">{info}</p>}
    <button className="button button-primary button-wide" disabled={!items.length || pending} onClick={checkout}>{pending ? "Procesando..." : <>Continuar al pago <ArrowRight size={17}/></>}</button>
    <div className="secure-note"><ShieldCheck size={18}/><span>Transacción procesada mediante la API y Stripe.</span></div>
  </aside></div>;
}