export type Product = {
  id: number | string;
  name: string;
  title?: string;
  description?: string;
  price: number | string;
  image?: string | null;
  image_url?: string | null;
  stock?: number;
  category?: string | { name?: string };
};

export type CartItem = { product: Product; quantity: number };

export type Order = {
  id: number | string;
  status?: string;
  total?: number | string;
  created_at?: string;
  items?: Array<{ id?: number | string; name?: string; quantity?: number; price?: number | string }>;
};

export function productName(product: Product) {
  return product.name || product.title || `Producto ${product.id}`;
}
export function productImage(product: Product) {
  return product.image_url || product.image || "";
}
export function money(value: number | string | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" }).format(Number.isFinite(amount) ? amount : 0);
}