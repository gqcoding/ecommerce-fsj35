"use client";
import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/lib/actions";
const initial = {};
export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, initial);
  return <section className="auth-page"><div className="auth-card"><span className="eyebrow">BIENVENIDO A NÓVA</span><h1>Crea tu cuenta</h1><p>Regístrate para realizar compras y consultar tus pedidos.</p><form action={action} className="form-stack"><label>Nombre completo<input name="name" autoComplete="name" required placeholder="Tu nombre"/></label><label>Correo electrónico<input type="email" name="email" autoComplete="email" required placeholder="tu@correo.com"/></label><label>Contraseña<input type="password" name="password" autoComplete="new-password" minLength={8} required placeholder="Mínimo 8 caracteres"/></label>{state?.error && <p className="alert alert-error">{state.error}</p>}<button className="button button-primary button-wide" disabled={pending}>{pending ? "Creando cuenta..." : "Crear cuenta"}</button></form><div className="auth-switch">¿Ya tienes cuenta? <Link href="/login">Iniciar sesión</Link></div></div></section>;
}