import { isAxiosError } from "axios";
import { FormEvent, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const loginErrorMessage = "Nao foi possivel entrar. Confira seu e-mail e senha.";

export function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, login } = useAuth();
  const [email, setEmail] = useState("admin@suaempresa.com");
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
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_35%),#0f172a] px-4 py-10 text-slate-50">
      <Helmet>
        <title>Login Admin | Painel da Landing</title>
      </Helmet>
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-blue-950/30 sm:p-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-blue-400">
          Painel da Landing
        </p>
        <h1 className="text-3xl font-black">Entrar no painel</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Acesse com o usuario dono da landing para visualizar o painel protegido.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">E-mail</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@suaempresa.com"
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">Senha</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
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
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-xs leading-6 text-slate-300">
          <strong className="text-white">Credenciais de acesso</strong>
          <br />
          E-mail: admin@suaempresa.com
          <br />
          Senha: 123456
        </div>
      </div>
    </div>
  );
}
