import { FormEvent, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const loginErrorMessage = "Nao foi possivel entrar. Confira seu e-mail e senha.";

export function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch {
      setError(loginErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.16),_transparent_32%),#f8fafc] px-4 py-10 text-slate-900">
      <Helmet>
        <title>Acesso administrativo | SuaMarca</title>
      </Helmet>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            S
          </span>
          <span className="text-lg font-black text-slate-950">SuaMarca</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Acesso administrativo
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Gerencie textos, imagens, cores e contatos da sua landing page.
        </p>

        <form autoComplete="off" className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">E-mail</span>
            <input
              autoComplete="off"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              name="login_email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Digite seu e-mail"
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Senha</span>
            <input
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              name="login_password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>
      </div>
    </div>
  );
}
