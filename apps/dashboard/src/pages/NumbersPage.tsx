import { useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface PhoneNumber {
  id: string;
  phoneNumber: string;
  ddd: string;
  status: string;
  createdAt: string;
}

export default function NumbersPage() {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [ddd, setDdd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/numbers")
      .then((res) => setNumbers(res.data.numbers))
      .catch(() => {});
  }, []);

  async function handleBuy(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/numbers/buy", { ddd });
      setNumbers((prev) => [data.number, ...prev]);
      setDdd("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao comprar número");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Números</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Comprar número</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBuy} className="flex items-end gap-4">
            <div className="flex-1 max-w-xs space-y-2">
              <Label htmlFor="ddd">DDD desejado</Label>
              <Input
                id="ddd"
                value={ddd}
                onChange={(e) =>
                  setDdd(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                placeholder="11"
                required
                maxLength={2}
              />
            </div>
            <Button type="submit" disabled={loading || ddd.length !== 2}>
              {loading ? "Comprando..." : "Comprar número"}
            </Button>
          </form>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>DDD</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {numbers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-8"
                >
                  Nenhum número comprado ainda.
                </TableCell>
              </TableRow>
            ) : (
              numbers.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-mono">{n.phoneNumber}</TableCell>
                  <TableCell>{n.ddd}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        n.status === "active" ? "success" : "destructive"
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {n.status === "active" ? "Ativo" : n.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(n.createdAt).toLocaleDateString("pt-BR")}
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
