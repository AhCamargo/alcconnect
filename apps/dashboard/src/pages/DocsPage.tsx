import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const webhookPayloadExamples = [
  {
    event: "incoming_call",
    label: "Ligação recebida",
    payload: {
      event: "incoming_call",
      number: "+5511999990001",
      from: "+5511988887777",
      timestamp: "2025-01-15T14:30:00Z",
      duration: null,
    },
  },
  {
    event: "incoming_sms",
    label: "SMS recebido",
    payload: {
      event: "incoming_sms",
      number: "+5511999990001",
      from: "+5511988887777",
      message: "Olá, gostaria de mais informações.",
      timestamp: "2025-01-15T14:32:00Z",
    },
  },
  {
    event: "incoming_whatsapp",
    label: "WhatsApp recebido",
    payload: {
      event: "incoming_whatsapp",
      number: "+5511999990001",
      from: "+5511988887777",
      message: "Boa tarde!",
      mediaType: null,
      timestamp: "2025-01-15T14:35:00Z",
    },
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-2">Documentação</h2>
      <p className="text-gray-400 mb-8">
        Referência rápida da API e payloads de webhook.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Autenticação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-300">
          <p>Todas as requisições autenticadas devem incluir o header:</p>
          <code className="block bg-gray-800 rounded-lg p-3 text-purple-300">
            Authorization: Bearer &lt;seu_token_jwt&gt;
          </code>
          <p className="text-gray-400">
            Obtenha o token via{" "}
            <code className="text-purple-300">POST /auth/login</code> ou{" "}
            <code className="text-purple-300">POST /auth/register</code>.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            {[
              { method: "POST", path: "/auth/register", desc: "Criar conta" },
              { method: "POST", path: "/auth/login", desc: "Login" },
              { method: "GET", path: "/auth/me", desc: "Dados do usuário" },
              { method: "GET", path: "/numbers", desc: "Listar números" },
              { method: "POST", path: "/numbers/buy", desc: "Comprar número" },
              {
                method: "GET",
                path: "/numbers/:id",
                desc: "Detalhes do número",
              },
              {
                method: "GET",
                path: "/numbers/:id/events",
                desc: "Eventos do número",
              },
              { method: "POST", path: "/webhooks", desc: "Criar webhook" },
              { method: "GET", path: "/webhooks", desc: "Listar webhooks" },
              {
                method: "DELETE",
                path: "/webhooks/:id",
                desc: "Remover webhook",
              },
              {
                method: "GET",
                path: "/webhooks/events",
                desc: "Listar eventos",
              },
            ].map((ep) => (
              <div
                key={ep.path + ep.method}
                className="flex items-center gap-3 py-1.5 border-b border-gray-800/50 last:border-0"
              >
                <Badge
                  variant={
                    ep.method === "GET"
                      ? "success"
                      : ep.method === "POST"
                        ? "purple"
                        : "destructive"
                  }
                  className="w-16 justify-center"
                >
                  {ep.method}
                </Badge>
                <span className="text-gray-300">{ep.path}</span>
                <span className="text-gray-500 ml-auto font-sans text-xs">
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payloads de Webhook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-400">
            Quando um evento ocorre, enviamos um POST para a URL cadastrada com
            o seguinte payload:
          </p>
          {webhookPayloadExamples.map((ex) => (
            <div key={ex.event}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="purple">{ex.event}</Badge>
                <span className="text-sm text-gray-400">{ex.label}</span>
              </div>
              <pre className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(ex.payload, null, 2)}
              </pre>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
