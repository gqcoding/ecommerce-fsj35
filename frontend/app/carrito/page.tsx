import { CheckoutForm } from "@/components/CheckoutForm";
export const metadata = { title: "Carrito y checkout — Nóva" };
export default function CartPage() { return <section className="page-section"><div className="page-heading"><span className="eyebrow">CASI TUYO</span><h1>Tu carrito</h1><p>Revisa tu selección antes de continuar al pago.</p></div><CheckoutForm/></section>; }