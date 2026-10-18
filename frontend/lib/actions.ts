"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch, apiPaths } from "@/lib/api";

const cookieName = () => process.env.AUTH_COOKIE_NAME || "ecommerce_token";

export type ActionState = { error?: string; success?: string };

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!name || !email || password.length < 8) return { error: "Completa todos los campos. La contraseña debe tener al menos 8 caracteres." };
  const result = await apiFetch<any>(apiPaths.register, { method: "POST", body: JSON.stringify({ name, email, password, password_confirmation: password }) });
  if ("error" in result) return { error: result.error };
  const token = result.data?.token || result.data?.access_token || result.data?.data?.token;
  if (token) {
    const store = await cookies();
    store.set(cookieName(), String(token), { httpOnly: true, secure: process.env.COOKIE_SECURE === "true", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  }
  redirect(token ? "/compras" : "/login?registered=1");
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Ingresa tu correo y contraseña." };
  const result = await apiFetch<any>(apiPaths.login, { method: "POST", body: JSON.stringify({ email, password }) });
  if ("error" in result) return { error: result.error };
  const token = result.data?.token || result.data?.access_token || result.data?.data?.token;
  if (!token) return { error: "La API respondió, pero no se encontró un token. Revisa el formato de respuesta en Swagger." };
  const store = await cookies();
  store.set(cookieName(), String(token), { httpOnly: true, secure: process.env.COOKIE_SECURE === "true", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  redirect("/compras");
}

export async function logoutAction() {
  const store = await cookies();
  const token = store.get(cookieName())?.value;
  if (token) await apiFetch(apiPaths.logout, { method: "POST" }, true);
  store.delete(cookieName());
  revalidatePath("/");
  redirect("/");
}

export async function createOrderAction(payload: { items: Array<{ product_id: number | string; quantity: number }> }): Promise<ActionState & { checkoutUrl?: string }> {
  if (!payload.items?.length || payload.items.some((i) => !i.product_id || !Number.isInteger(i.quantity) || i.quantity < 1)) {
    return { error: "El carrito está vacío o contiene cantidades inválidas." };
  }
  const order = await apiFetch<any>(apiPaths.orders, { method: "POST", body: JSON.stringify({ items: payload.items }) }, true);
  if ("error" in order) return { error: order.error };
  const orderData = order.data?.order || order.data;
  const orderId = orderData?.id;
  const payment = await apiFetch<any>(apiPaths.stripeCheckout, {
    method: "POST",
    body: JSON.stringify({ order_id: orderId, items: payload.items, success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout` }),
  }, true);
  if ("error" in payment) return { error: `La orden se creó, pero no se pudo iniciar el pago: ${payment.error}` };
  revalidatePath("/compras");
  try { revalidateTag("products", "max"); } catch { /* compatible con instalaciones sin cache tags */ }
  const url = payment.data?.url || payment.data?.checkout_url || payment.data?.checkoutUrl || payment.data?.data?.url;
  if (url) return { success: "Orden creada.", checkoutUrl: url };
  return { success: `Orden ${orderId ?? ""} creada, pero la API no devolvió una URL de Stripe. Revisa el endpoint de pago en Swagger.` };
}