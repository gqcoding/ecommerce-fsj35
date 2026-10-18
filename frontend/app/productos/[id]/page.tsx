import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ImageIcon, ShieldCheck } from "lucide-react";
import { getProduct } from "@/lib/api";
import { money, productImage, productName } from "@/lib/types";
import { AddToCart } from "@/components/AddToCart";
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const product = await getProduct(id); if (!product) notFound();
  const image = productImage(product);
  return <section className="page-section"><Link href="/productos" className="back-link"><ArrowLeft size={16}/> Volver al catálogo</Link><div className="detail-layout"><div className="detail-image">{image ? <img src={image} alt={productName(product)}/> : <div className="image-placeholder"><ImageIcon size={60}/><span>Producto</span></div>}</div><div className="detail-copy"><span className="eyebrow">{typeof product.category === "object" ? product.category?.name : product.category || "SELECCIÓN NÓVA"}</span><h1>{productName(product)}</h1><p className="detail-price">{money(product.price)}</p><p className="detail-description">{product.description || "Un producto seleccionado para combinar estilo, funcionalidad y calidad en tu día a día."}</p><div className="detail-divider"/><div className="detail-feature"><ShieldCheck size={18}/><span>Compra protegida mediante el proceso de pago seguro.</span></div><AddToCart product={product}/></div></div></section>;
}