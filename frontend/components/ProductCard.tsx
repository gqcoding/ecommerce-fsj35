import Link from "next/link";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import type { Product } from "@/lib/types";
import { money, productImage, productName } from "@/lib/types";
import { AddToCart } from "@/components/AddToCart";
export function ProductCard({ product }: { product: Product }) {
  const image = productImage(product);
  return <article className="product-card">
    <Link className="product-image" href={`/productos/${product.id}`} aria-label={`Ver ${productName(product)}`}>
      {image ? <img src={image} alt={productName(product)} loading="lazy"/> : <div className="image-placeholder"><ImageIcon size={38}/><span>Producto</span></div>}
      <span className="image-arrow"><ArrowUpRight size={18}/></span>
    </Link>
    <div className="product-info"><span className="eyebrow">{typeof product.category === "object" ? product.category?.name : product.category || "Selección"}</span><Link href={`/productos/${product.id}`}><h3>{productName(product)}</h3></Link><p className="product-description">{product.description || "Diseñado para acompañarte todos los días."}</p>
    <div className="product-bottom"><strong>{money(product.price)}</strong><AddToCart product={product}/></div></div>
  </article>;
}