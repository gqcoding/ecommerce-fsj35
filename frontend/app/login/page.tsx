"use client";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
const initial = {};
export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initial);
  return <section className="auth-page"><div className="auth-card"><span className="eyebrow">QUÉ BUENO VERTE</span><h1>Inicia sesión</h1><p>Ingresa a tu cuenta para consultar tus compras y continuar tu experiencia.</p><form action={action} className="form-stack"><label>Correo electrónico<input type="email" name="email" autoComplete="email" required placeholder="tu@correo.com"/></label><label>Contraseña<input type="password" name="password" autoComplete="current-password" required placeholder="Tu contraseña"/></label>{state?.error && <p className="alert alert-error">{state.error}</p>}<button className="button button-primary button-wide" disabled={pending}>{pending ? "Ingresando..." : "Iniciar sesión"}</button></form><div className="auth-switch">¿Aún no tienes cuenta? <Link href="/registro">Crear cuenta</Link></div></div></section>;
}