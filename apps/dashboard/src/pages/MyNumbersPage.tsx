import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";
import { getMyNumbers, MyPhoneNumber } from "@/lib/phoneNumberService";
import { Link } from "react-router-dom";

function statusVariant(status: string) {
  if (status === "ativo") return "success";
  if (status === "suspenso") return "warning";
  return "destructive";
}

export default function MyNumbersPage() {
  const [numbers, setNumbers] = useState<MyPhoneNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getMyNumbers()
      .then((res) => setNumbers(res))
      .catch(() => setError("Erro ao carregar seus números"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-2">
        <Smartphone className="w-6 h-6" /> Meus Números
      </h2>
      {loading ? (
        <div className="text-center text-gray-400 py-12">Carregando...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-12">{error}</div>
      ) : numbers.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center">
            <div className="mb-4 text-lg text-gray-300">
              Você ainda não tem números.
              <br />
              Que tal contratar um?
            </div>
            <Link
              to="/catalog"
              className="inline-block bg-purple-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-purple-500 transition"
            >
              Ver catálogo
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {numbers.map((num) => (
            <Card key={num.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-lg font-mono">{num.phoneNumber}</span>
                  <Badge variant={statusVariant(num.status)}>
                    {num.status}
                  </Badge>
                </CardTitle>
                <div className="text-xs text-gray-400">
                  DDD: {num.ddd} | Tipo: {num.type}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <span className="text-sm text-gray-300">Ativado em:</span>
                  <span className="ml-2 text-purple-400 font-bold">
                    {new Date(num.activatedAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-300">Expira em:</span>
                  <span className="ml-2 text-purple-400 font-bold">
                    {new Date(num.expiresAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
