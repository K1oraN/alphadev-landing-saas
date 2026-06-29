import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { getMyLanding } from "../../services/adminLandingService";
import { deleteLead, getLeadById, getLeads } from "../../services/adminLeadService";
import type { AdminLanding } from "../../types/adminLanding";
import type { AdminLead, LeadFilters, PaginatedLeadsResponse } from "../../types/lead";
import { onlyNumbers } from "../../utils/formatPhone";
import { getErrorMessage } from "../../utils/getErrorMessage";

const initialResponse: PaginatedLeadsResponse = {
  leads: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getLeadWhatsAppUrl(phone: string) {
  const numbers = onlyNumbers(phone);
  const normalized = numbers.startsWith("55") ? numbers : `55${numbers}`;

  return `https://wa.me/${normalized}`;
}

export function AdminLeads() {
  const [landing, setLanding] = useState<AdminLanding | null>(null);
  const [data, setData] = useState(initialResponse);
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, limit: 10 });
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadLeads(nextFilters = filters) {
    try {
      setLoading(true);
      setError("");
      const [landingData, leadsData] = await Promise.all([
        landing ? Promise.resolve(landing) : getMyLanding(),
        getLeads(nextFilters),
      ]);
      setLanding(landingData);
      setData(leadsData);
      setFilters(nextFilters);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Nao foi possivel carregar os leads."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadLeads({ ...filters, page: 1 });
  }

  async function handleDetails(id: string) {
    try {
      setSelectedLead(await getLeadById(id));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Nao foi possivel abrir os detalhes."));
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Tem certeza que deseja remover este lead?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteLead(id);
      setMessage(response.message);
      setSelectedLead(null);
      await loadLeads(filters);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Nao foi possivel remover o lead."));
    }
  }

  return (
    <AdminLayout
      title="Leads Recebidos"
      description="Visualize contatos enviados pelo formulario publico da landing."
      publicSlug={landing?.slug}
    >
      <div className="space-y-6">
        <form
          className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:grid-cols-4"
          onSubmit={handleFilter}
        >
          <FormField label="Busca">
            <Input
              onChange={(event) => setFilters({ ...filters, search: event.target.value })}
              placeholder="Nome, telefone ou e-mail"
              value={filters.search ?? ""}
            />
          </FormField>
          <FormField label="Data inicial">
            <Input
              onChange={(event) => setFilters({ ...filters, startDate: event.target.value })}
              type="date"
              value={filters.startDate ?? ""}
            />
          </FormField>
          <FormField label="Data final">
            <Input
              onChange={(event) => setFilters({ ...filters, endDate: event.target.value })}
              type="date"
              value={filters.endDate ?? ""}
            />
          </FormField>
          <div className="flex items-end">
            <button className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700" type="submit">
              Filtrar
            </button>
          </div>
        </form>

        {message ? <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-100">{message}</p> : null}
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
        {loading ? <p className="text-slate-300">Carregando leads...</p> : null}

        {!loading && data.leads.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-slate-300">
            Nenhum lead recebido ainda.
          </div>
        ) : null}

        {data.leads.length > 0 ? (
          <div className="space-y-4">
            {data.leads.map((lead) => (
              <article
                className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
                key={lead.id}
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                      Nome
                    </p>
                    <h2 className="mt-2 break-words text-lg font-black">{lead.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">{formatDate(lead.createdAt)}</p>
                  </div>
                  <div className="text-sm leading-6 text-slate-300">
                    <p className="break-all"><strong>Telefone:</strong> {lead.phone}</p>
                    <p className="break-all"><strong>E-mail:</strong> {lead.email ?? "Nao informado"}</p>
                  </div>
                  <div className="text-sm leading-6 text-slate-300">
                    <p className="line-clamp-2"><strong>Mensagem:</strong> {lead.message ?? "Sem mensagem"}</p>
                    <p><strong>Origem:</strong> {lead.source ?? lead.utmSource ?? "Nao informada"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <button
                      className="rounded-lg bg-white/10 px-3 py-2 text-sm font-bold"
                      onClick={() => handleDetails(lead.id)}
                      type="button"
                    >
                      Ver detalhes
                    </button>
                    <a
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white"
                      href={getLeadWhatsAppUrl(lead.phone)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Chamar no WhatsApp
                    </a>
                    <button
                      className="rounded-lg bg-red-500/20 px-3 py-2 text-sm font-bold text-red-100"
                      onClick={() => handleDelete(lead.id)}
                      type="button"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Pagina {data.pagination.page} de {data.pagination.totalPages} - {data.pagination.total} lead(s)
          </p>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold disabled:opacity-50"
              disabled={data.pagination.page <= 1}
              onClick={() => loadLeads({ ...filters, page: data.pagination.page - 1 })}
              type="button"
            >
              Anterior
            </button>
            <button
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold disabled:opacity-50"
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() => loadLeads({ ...filters, page: data.pagination.page + 1 })}
              type="button"
            >
              Proxima
            </button>
          </div>
        </div>

        {selectedLead ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/10 bg-alpha-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                    Detalhes do lead
                  </p>
                  <h2 className="mt-2 text-2xl font-black">{selectedLead.name}</h2>
                </div>
                <button className="rounded-lg bg-white/10 px-3 py-2 text-sm font-bold" onClick={() => setSelectedLead(null)} type="button">
                  Fechar
                </button>
              </div>

              <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-300">
                <p><strong>Telefone:</strong> {selectedLead.phone}</p>
                <p><strong>E-mail:</strong> {selectedLead.email ?? "Nao informado"}</p>
                <p><strong>Mensagem:</strong> {selectedLead.message ?? "Sem mensagem"}</p>
                <p><strong>Source:</strong> {selectedLead.source ?? "Nao informado"}</p>
                <p><strong>UTM Source:</strong> {selectedLead.utmSource ?? "Nao informado"}</p>
                <p><strong>UTM Medium:</strong> {selectedLead.utmMedium ?? "Nao informado"}</p>
                <p><strong>UTM Campaign:</strong> {selectedLead.utmCampaign ?? "Nao informado"}</p>
                <p><strong>Enviado em:</strong> {formatDate(selectedLead.createdAt)}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white"
                  href={getLeadWhatsAppUrl(selectedLead.phone)}
                  rel="noreferrer"
                  target="_blank"
                >
                  Chamar no WhatsApp
                </a>
                <button
                  className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-bold text-red-100"
                  onClick={() => handleDelete(selectedLead.id)}
                  type="button"
                >
                  Excluir lead
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
}
