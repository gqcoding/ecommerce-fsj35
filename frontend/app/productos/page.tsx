import { Suspense } from "react";
import { getProducts } from "@/lib/api";
import { ProductList } from "@/components/ProductList";
export const metadata = { title: "Productos — Nóva" };
async function Catalog() {
  const products = await getProducts();
  return <ProductList products={products}/>;
}
function LoadingGrid() { return <div className="product-grid">{[1,2,3,4].map((n)=><div className="skeleton-card" key={n}><div className="skeleton-image"/><div className="skeleton-line"/><div className="skeleton-line short"/></div>)}</div>; }
export default function ProductsPage() {
  return <section className="page-section"><div className="page-heading"><span className="eyebrow">DESCUBRE NÓVA</span><h1>Todos los productos</h1><p>Explora el catálogo y encuentra tu próximo favorito.</p></div><Suspense fallback={<LoadingGrid/>}><Catalog/></Suspense></section>;
}