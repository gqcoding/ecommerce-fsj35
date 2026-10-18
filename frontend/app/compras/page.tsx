import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PackageOpen, ArrowRight } from "lucide-react";
import { getOrders } from "@/lib/api";
import { money } from "@/lib/types";
export const metadata = { title: "Mis compras — Nóva" };
async function OrderHistory() {
  let orders;
  try { orders = await getOrders(); } catch (error) { return <div className="alert alert-error">{error instanceof Error ? error.message : "No se pudo cargar el historial."} Revisa que la ruta de órdenes coincida con Swagger.</div>; }
  if (!orders.length) return <div className="empty-state"><PackageOpen size={38}/><h2>Aún no tienes compras</h2><p>Cuando realices tu primera compra, aparecerá aquí.</p><Link className="button button-primary" href="/productos">Explorar productos</Link></div>;
  return <div className="orders-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-icon"><PackageOpen size={21}/></div><div className="order-main"><span className="eyebrow">ORDEN #{order.id}</span><strong>{order.created_at ? new Date(order.created_at).toLocaleDateString("es-SV") : "Fecha no disponible"}</strong><span className="muted">{order.items?.length ?? 0} artículos</span></div><div className="order-end"><span className={`status-pill ${(order.status || "").toLowerCase()}`}>{order.status || "Registrada"}</span><strong>{money(order.total)}</strong></div></article>)}</div>;
}
export default async function OrdersPage() {
  const store = await cookies(); const token = store.get(process.env.AUTH_COOKIE_NAME || "ecommerce_token")?.value;
  if (!token) redirect("/login");
  return <section className="page-section"><div className="page-heading"><span className="eyebrow">TU CUENTA</span><h1>Mis compras</h1><p>Consulta el estado y el historial de tus pedidos.</p></div><OrderHistory/><div className="history-footer"><Link href="/productos" className="text-link">Seguir explorando <ArrowRight size={16}/></Link></div></section>;
}