"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name?: string;
  // Add other user properties as needed
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Move this inside the component

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      // Use js-cookie to set cookie on initialization
      Cookies.set("auth-token", storedToken, {
        expires: 7,
        path: "/",
        sameSite: "strict",
      });
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    console.log("Login called with:", { token, user });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Use js-cookie for reliable cookie handling
    Cookies.set("auth-token", token, {
      expires: 7, // 7 days
      path: "/",
      sameSite: "strict",
    });

    setToken(token);
    setUser(user);

    console.log("Redirecting to dashboard...");
    router.replace("/dashboard");
  };

  const logout = () => {
    console.log("Logout called");

    try {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Use js-cookie for reliable cookie removal (works on all browsers including Safari)
      Cookies.remove("auth-token", { path: "/" });

      // Clear React state
      setToken(null);
      setUser(null);

      console.log("Logout successful, redirecting to login...");
      router.replace("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      setToken(null);
      setUser(null);
      router.replace("/login");
    }
  };

  // Don't render children until we've checked localStorage
  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
