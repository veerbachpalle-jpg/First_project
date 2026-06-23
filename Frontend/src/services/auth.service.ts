import { api, setAccessToken } from "./api";

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
  watchHistory?: unknown[];
}

interface LoginResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

export function mapUser(u: any): User | null {
  if (!u) return null;
  return {
    ...u,
    fullName: u.fullname ?? u.fullName,
    coverImage: u.coverimage ?? u.coverImage,
  };
}

function unwrap<T>(data: unknown): T {
  if (data && typeof data === "object" && "data" in (data as Record<string, unknown>)) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export const authService = {
  async register(form: FormData): Promise<User> {
    const { data } = await api.post("/users/register", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapUser(unwrap<any>(data))!;
  },

  async login(payload: { email?: string; username?: string; password: string }): Promise<User> {
    const { data } = await api.post("/users/login", payload);
    const res = unwrap<any>(data);
    if (res.accessToken) setAccessToken(res.accessToken);
    return mapUser(res.user)!;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/users/logout");
    } finally {
      setAccessToken(null);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data } = await api.get("/users/current-user");
      return mapUser(unwrap<any>(data));
    } catch {
      return null;
    }
  },
};
