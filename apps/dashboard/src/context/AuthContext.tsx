import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Tipos do usuário e contexto
export type User = {
  id: string;
  email: string;
  role: "admin" | "user";
  tenantId: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para decodificar JWT (payload base64)
function decodeJWT(token: string): User | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      tenantId: decoded.tenantId,
    };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("alcconnect_token");
    if (storedToken) {
      setToken(storedToken);
      setUser(decodeJWT(storedToken));
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("alcconnect_token", newToken);
    setToken(newToken);
    setUser(decodeJWT(newToken));
  };

  const logout = () => {
    localStorage.removeItem("alcconnect_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

