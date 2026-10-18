import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { getProducts } from "@/lib/api";
import { ProductList } from "@/components/ProductList";
import { Suspense } from "react";
function ProductSkeleton() { return <div className="product-grid">{[1,2,3].map((n)=><div className="skeleton-card" key={n}><div className="skeleton-image"/><div className="skeleton-line"/><div className="skeleton-line short"/></div>)}</div>; }
async function FeaturedProducts() {
  try { const products = (await getProducts()).slice(0, 3); return <ProductList products={products}/>; }
  catch { return <div className="alert alert-info">No se pudo cargar el catálogo. Comprueba que Laravel esté activo y revisa API_BASE_URL y API_PRODUCTS_PATH.</div>; }
}
export default function HomePage() {
  return <><section className="hero"><div className="hero-copy"><span className="hero-kicker"><Sparkles size={15}/> SELECCIÓN PARA TU DÍA A DÍA</span><h1>Encuentra eso que<br/><em>estabas buscando.</em></h1><p>Productos que combinan diseño, utilidad y pequeños detalles que hacen la diferencia.</p><div className="hero-actions"><Link href="/productos" className="button button-primary">Explorar productos <ArrowRight size={17}/></Link><Link href="/compras" className="text-link">Ver mis compras</Link></div><div className="hero-trust"><span><ShieldCheck size={16}/> Compra segura</span><span><Truck size={16}/> Proceso sencillo</span></div></div><div className="hero-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-sun"/><div className="art-card art-card-back"><span>OBJETOS CON INTENCIÓN</span><div className="art-shape shape-back"/></div><div className="art-card art-card-front"><div className="art-shape shape-front"/><span className="art-caption">Menos, pero mejor.</span><span className="art-number">01 / 03</span></div><div className="floating-badge">✳ Curado para ti</div></div></section>
  <section className="section section-featured"><div className="section-heading"><div><span className="eyebrow">NUESTRO CATÁLOGO</span><h2>Favoritos de la tienda</h2><p>Una selección para empezar a descubrir.</p></div><Link className="text-link" href="/productos">Ver todo <ArrowRight size={16}/></Link></div><Suspense fallback={<ProductSkeleton/>}><FeaturedProducts/></Suspense></section>
  <section className="bottom-banner"><div><span className="eyebrow">COMPRA CON CONFIANZA</span><h2>Una experiencia simple,<br/>de principio a fin.</h2></div><Link href="/productos" className="button button-light">Ver catálogo <ArrowRight size={17}/></Link></section></>;
}