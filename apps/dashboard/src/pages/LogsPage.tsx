import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface WebhookEvent {
  id: string;
  eventType: string;
  status: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export default function LogsPage() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);

  useEffect(() => {
    api
      .get("/webhooks/events")
      .then((res) => setEvents(res.data.events))
      .catch(() => {});
  }, []);

  function statusVariant(status: string) {
    if (status === "delivered") return "success" as const;
    if (status === "pending") return "warning" as const;
    return "destructive" as const;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Logs de eventos</h2>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payload</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-8"
                >
                  Nenhum evento registrado.
                </TableCell>
              </TableRow>
            ) : (
              events.map((evt) => (
                <TableRow key={evt.id}>
                  <TableCell>{evt.eventType}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(evt.status)}>
                      {evt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 max-w-xs truncate block">
                      {JSON.stringify(evt.payload).slice(0, 80)}
                    </code>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(evt.createdAt).toLocaleString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
