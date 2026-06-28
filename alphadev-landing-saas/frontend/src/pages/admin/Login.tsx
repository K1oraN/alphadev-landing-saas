import { isAxiosError } from "axios";
import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const loginErrorMessage = "Nao foi possivel entrar. Confira seu e-mail e senha.";

export function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, login } = useAuth();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("123456");
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
    } catch (requestError) {
      if (isAxiosError(requestError) && requestError.response?.data?.message) {
        setError(requestError.response.data.message);
      } else {
        setError(loginErrorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(239,29,47,0.25),_transparent_35%),#07070a] px-4 py-10 text-slate-50">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-alpha-panel p-6 shadow-glow sm:p-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-alpha-red">
          AlphaDev Landing SaaS
        </p>
        <h1 className="text-3xl font-black">Entrar no painel</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Acesse com o usuario dono da landing para visualizar o painel protegido.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">E-mail</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-red-500"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@demo.com"
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">Senha</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-red-500"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <button
            className="w-full rounded-lg bg-alpha-red px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-xs leading-6 text-slate-300">
          <strong className="text-white">Credenciais demo</strong>
          <br />
          E-mail: admin@demo.com
          <br />
          Senha: 123456
        </div>
      </div>
    </div>
  );
}
