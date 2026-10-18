import "server-only";
import { cookies } from "next/headers";
import type { Order, Product } from "@/lib/types";

const base = (process.env.API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
export const apiPaths = {
  products: process.env.API_PRODUCTS_PATH || "/api/products",
  register: process.env.API_REGISTER_PATH || "/api/register",
  login: process.env.API_LOGIN_PATH || "/api/login",
  logout: process.env.API_LOGOUT_PATH || "/api/logout",
  orders: process.env.API_ORDERS_PATH || "/api/orders",
  history: process.env.API_ORDER_HISTORY_PATH || process.env.API_ORDERS_PATH || "/api/orders",
  stripeCheckout: process.env.API_STRIPE_CHECKOUT_PATH || "/api/checkout/session",
};

type ApiResult<T> = { data: T; error?: never } | { data?: never; error: string; status?: number };

function unwrap<T>(json: any): T {
  if (json && typeof json === "object" && "data" in json) return json.data as T;
  return json as T;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}, authenticated = false): Promise<ApiResult<T>> {
  try {
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    if (authenticated) {
      const cookieStore = await cookies();
      const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "ecommerce_token")?.value;
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }
    const response = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init, headers, cache: "no-store",
    });
    const text = await response.text();
    let json: any = {};
    try { json = text ? JSON.parse(text) : {}; } catch { json = { message: text }; }
    if (!response.ok) {
      return { error: json?.message || json?.error || `La API respondió con estado ${response.status}.`, status: response.status };
    }
    return { data: unwrap<T>(json) };
  } catch {
    return { error: "No se pudo conectar con la API. Verifica API_BASE_URL y que Laravel esté ejecutándose." };
  }
}

export async function getProducts(): Promise<Product[]> {
  const result = await apiFetch<any>(apiPaths.products);
  if ("error" in result) throw new Error(result.error);
  const raw = result.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.products)) return raw.products;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

export async function getProduct(id: string): Promise<Product | null> {
  const result = await apiFetch<any>(`${apiPaths.products}/${encodeURIComponent(id)}`);
  if ("error" in result) return null;
  const raw = result.data;
  return (raw?.product || raw) as Product;
}

export async function getOrders(): Promise<Order[]> {
  const result = await apiFetch<any>(apiPaths.history, {}, true);
  if ("error" in result) throw new Error(result.error);
  const raw = result.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.orders)) return raw.orders;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}