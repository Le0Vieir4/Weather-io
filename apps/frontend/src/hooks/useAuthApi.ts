import { useAuth } from "@/hooks/useAuth";
import {
  CreateUserSchema,
  LoginSchema,
  UpdateUserSchema,
  ChangePasswordSchema,
  type CreateUserDto,
  type Login,
  type UpdateUserDto,
  type User,
} from "@/types/schemas/user-schema";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface TokenPayload {
  sub: string;
  email: string;
  exp?: number;
  // Campos OAuth
  isOAuth?: boolean;
  provider?: string;
  username?: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
}

export function useAuthApi() {
  const { token, userId, login, logout } = useAuth();

  async function getUser(): Promise<User> {
    if (!userId || !token) {
      throw new Error("Usuário não autenticado");
    }

    try {
      // Decodifica o token para verificar se é OAuth
      const decoded = jwtDecode<TokenPayload>(token);

      // Se for usuário OAuth, retorna os dados do token
      if (decoded.isOAuth) {
        console.log("👤 Usuário OAuth detectado, retornando dados do token");
        return {
          id: decoded.sub,
          email: decoded.email,
          username: decoded.username,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          picture: decoded.picture,
          provider: decoded.provider,
          isOAuth: true,
        };
      }

      // Se for usuário normal, busca no banco de dados
      const data = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "GET",
      });

      if (!data.ok) {
        const error = await data
          .json()
          .catch(() => ({ message: "Erro ao buscar usuários" }));
        throw new Error(error.message || "Falha ao buscar usuários");
      }
      return data.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao conectar com o servidor");
    }
  }

  async function signIn(user: Login) {
    const parsed = LoginSchema.safeParse(user);
    if (!parsed.success) {
      throw new Error("Email ou senha inválidos.");
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Erro ao fazer login" }));
        throw new Error(error.message || "Credenciais inválidas");
      }

      const data = await res.json();
      login(data.access_token);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao conectar com o servidor");
    }
  }

  async function register(user: CreateUserDto) {
    const parsed = CreateUserSchema.safeParse(user);
    if (!parsed.success) {
      throw new Error("Verifique as informações e tente novamente.");
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Erro ao registrar" }));
        throw new Error(error.message || "Erro ao criar conta");
      }

      const data = await res.json();
      login(data.access_token);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao conectar com o servidor");
    }
  }

  async function update(user: Partial<UpdateUserDto>) {
    if (!userId || !token) {
      throw new Error("Usuário não autenticado");
    }

    // Verifica se é usuário OAuth
    const decoded = jwtDecode<TokenPayload>(token);
    if (decoded.isOAuth) {
      console.warn(
        "⚠️ Tentativa de atualizar usuário OAuth - operação não permitida"
      );
      throw new Error("Usuários autenticados via OAuth não podem ser editados");
    }

    const cleaned = Object.fromEntries(
      Object.entries(user).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined
      )
    );

    if (Object.keys(cleaned).length === 0) {
      throw new Error("Nenhum dado para atualizar");
    }

    const parsed = UpdateUserSchema.safeParse(cleaned);
    if (!parsed.success) {
      throw new Error("Dados inválidos");
    }

    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed.data),
      });

      // Se o token expirou ou não é válido, fazer logout
      if (res.status === 401) {
        logout();
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Erro ao atualizar" }));
        throw new Error(error.message || "Falha ao atualizar usuário");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao conectar com o servidor");
    }
  }

  async function deleteUser() {
    if (!userId || !token) {
      throw new Error("Usuário não autenticado");
    }

    // Verifica se é usuário OAuth
    const decoded = jwtDecode<TokenPayload>(token);
    if (decoded.isOAuth) {
      console.warn(
        "⚠️ Tentativa de deletar usuário OAuth - operação não permitida"
      );
      throw new Error(
        "Usuários autenticados via OAuth não podem deletar a conta por aqui"
      );
    }

    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Se o token expirou ou não é válido, fazer logout
      if (res.status === 401) {
        logout();
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Erro ao deletar" }));
        throw new Error(error.message || "Falha ao deletar usuário");
      }

      logout();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao conectar com o servidor");
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    if (!userId || !token) {
      throw new Error("Usuário não autenticado");
    }

    const parsed = ChangePasswordSchema.safeParse({
      currentPassword,
      newPassword,
    });
    if (!parsed.success) {
      throw new Error(
        "Senhas inválidas. Ambas devem ter no mínimo 8 caracteres."
      );
    }

    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      // Se o token expirou ou não é válido, fazer logout
      if (res.status === 401) {
        logout();
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Erro ao alterar senha" }));
        throw new Error(error.message || "Falha ao alterar senha");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao conectar com o servidor");
    }
  }

  return {
    signIn,
    register,
    update,
    deleteUser,
    changePassword,
    logout,
    getUser,
  };
}
