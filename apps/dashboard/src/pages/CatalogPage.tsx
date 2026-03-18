import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import {
  getAvailableNumbers,
  AvailablePhoneNumber,
  GetAvailableNumbersParams,
} from "@/lib/phoneNumberService";

const TYPES = ["ESIM", "VOIP", "WHATSAPP"] as const;

export default function CatalogPage() {
  const [numbers, setNumbers] = useState<AvailablePhoneNumber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<GetAvailableNumbersParams>({
    page: 1,
    pageSize: 12,
  });

  useEffect(() => {
    setLoading(true);
    getAvailableNumbers(filters)
      .then((res) => {
        setNumbers(res.numbers);
        setTotal(res.total);
      })
      .catch(() => setError("Erro ao carregar números"))
      .finally(() => setLoading(false));
  }, [filters]);

  function handleFilterChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  }

  function handlePageChange(page: number) {
    setFilters((prev) => ({ ...prev, page }));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-2">
        <Phone className="w-6 h-6" /> Catálogo de Números
      </h2>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm mb-1">DDD</label>
            <input
              type="text"
              name="ddd"
              maxLength={2}
              className="bg-gray-800 rounded-lg px-3 py-2 text-gray-200 w-20"
              value={filters.ddd || ""}
              onChange={handleFilterChange}
              placeholder="Ex: 11"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Tipo</label>
            <select
              name="type"
              className="bg-gray-800 rounded-lg px-3 py-2 text-gray-200"
              value={filters.type || ""}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
      {loading ? (
        <div className="text-center text-gray-400 py-12">Carregando...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-12">{error}</div>
      ) : numbers.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          Nenhum número disponível.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {numbers.map((num) => (
            <Card key={num.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-lg font-mono">
                    {num.phoneNumber.replace(
                      /(\d{2})(\d{3})(\d{2})(\d{2})/,
                      "+$1 ****-**" + num.phoneNumber.slice(-2),
                    )}
                  </span>
                  <Badge variant="purple">{num.type}</Badge>
                </CardTitle>
                <div className="text-xs text-gray-400">
                  DDD: {num.ddd} | Região: {num.region}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <span className="text-sm text-gray-300">Preço mensal:</span>
                  <span className="ml-2 text-purple-400 font-bold">
                    R$ {num.priceMonthly.toFixed(2)}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-sm text-gray-300">Ativação:</span>
                  <span className="ml-2 text-purple-400 font-bold">
                    R$ {num.priceActivation.toFixed(2)}
                  </span>
                </div>
                <Button variant="outline" disabled title="Em breve">
                  Contratar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Paginação */}
      {total > filters.pageSize! && (
        <div className="flex justify-center gap-2 mb-8">
          {Array.from(
            { length: Math.ceil(total / filters.pageSize!) },
            (_, i) => (
              <Button
                key={i + 1}
                variant={filters.page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
