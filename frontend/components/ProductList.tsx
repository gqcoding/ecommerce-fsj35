import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
export function ProductList({ products }: { products: Product[] }) {
  if (!products.length) return <div className="empty-state"><h3>Aún no hay productos</h3><p>Verifica que la API de Laravel esté activa y que API_PRODUCTS_PATH coincida con Swagger.</p></div>;
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product}/>)}</div>;
}