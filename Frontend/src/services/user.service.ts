import { api } from "./api";
import { mapUser, type User } from "./auth.service";

function unwrap<T>(data: unknown): T {
  if (data && typeof data === "object" && "data" in (data as Record<string, unknown>)) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export const userService = {
  async updateAccount(payload: { fullName?: string; email?: string }): Promise<User> {
    const mappedPayload = {
      fullname: payload.fullName,
      email: payload.email,
    };
    const { data } = await api.patch("/users/update-account", mappedPayload);
    return mapUser(unwrap<any>(data))!;
  },

  async changePassword(payload: { oldPassword: string; newPassword: string }): Promise<void> {
    await api.post("/users/change-password", payload);
  },

  async updateAvatar(file: File): Promise<User> {
    const fd = new FormData();
    fd.append("avatar", file);
    const { data } = await api.patch("/users/avatar", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapUser(unwrap<any>(data))!;
  },

  async updateCover(file: File): Promise<User> {
    const fd = new FormData();
    fd.append("coverimage", file);
    const { data } = await api.patch("/users/cover-image", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapUser(unwrap<any>(data))!;
  },

  async getChannelProfile(username: string): Promise<any> {
    const { data } = await api.get(`/users/c/${username}`);
    return unwrap<any>(data);
  },
};
