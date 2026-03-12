import { useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

const EVENT_TYPES = [
  { value: "incoming_call", label: "Ligação recebida" },
  { value: "incoming_sms", label: "SMS recebido" },
  { value: "incoming_whatsapp", label: "WhatsApp recebido" },
];

interface WebhookItem {
  id: string;
  url: string;
  eventType: string;
  active: boolean;
  createdAt: string;
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [url, setUrl] = useState("");
  const [eventType, setEventType] = useState("incoming_call");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/webhooks")
      .then((res) => setWebhooks(res.data.webhooks))
      .catch(() => {});
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/webhooks", { url, eventType });
      setWebhooks((prev) => [data.webhook, ...prev]);
      setUrl("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao criar webhook");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/webhooks/${id}`);
      setWebhooks((prev) => prev.filter((w) => w.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao remover webhook");
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Webhooks</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Novo webhook</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="flex items-end gap-4 flex-wrap"
          >
            <div className="flex-1 min-w-[250px] space-y-2">
              <Label htmlFor="url">URL do webhook</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://seu-n8n.com/webhook/xxx"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event">Evento</Label>
              <Select
                id="event"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar webhook"}
            </Button>
          </form>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {webhooks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Nenhum webhook configurado.
            </CardContent>
          </Card>
        ) : (
          webhooks.map((wh) => (
            <Card key={wh.id}>
              <CardContent className="py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-mono text-sm truncate">{wh.url}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {EVENT_TYPES.find((t) => t.value === wh.eventType)?.label ||
                      wh.eventType}
                    {" · "}
                    {new Date(wh.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(wh.id)}
                  className="text-red-400 hover:text-red-300 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
