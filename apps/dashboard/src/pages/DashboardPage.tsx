import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Webhook, Zap } from "lucide-react";

interface Stats {
  numbers: number;
  webhooks: number;
  events: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    numbers: 0,
    events: 0,
    webhooks: 0,
  });

  useEffect(() => {
    Promise.all([
      api.get("/numbers"),
      api.get("/webhooks/events"),
      api.get("/webhooks"),
    ])
      .then(([numRes, evtRes, whRes]) => {
        setStats({
          numbers: numRes.data.numbers.length,
          events: evtRes.data.events.length,
          webhooks: whRes.data.webhooks.length,
        });
      })
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "Números ativos",
      value: stats.numbers,
      icon: Phone,
      color: "text-purple-400",
    },
    {
      label: "Webhooks",
      value: stats.webhooks,
      icon: Webhook,
      color: "text-blue-400",
    },
    {
      label: "Eventos recebidos",
      value: stats.events,
      icon: Zap,
      color: "text-green-400",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">{card.label}</span>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Início rápido</h3>
          <div className="space-y-3 text-gray-400 text-sm">
            <div className="flex items-center gap-3">
              <span className="bg-purple-600/20 text-purple-300 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                1
              </span>
              Compre um número virtual na aba Números
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-purple-600/20 text-purple-300 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                2
              </span>
              Configure um webhook na aba Webhooks
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-purple-600/20 text-purple-300 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                3
              </span>
              Receba eventos em tempo real na sua aplicação
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
