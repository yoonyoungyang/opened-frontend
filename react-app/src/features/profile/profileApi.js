import { apiRequest } from "../../shared/api/client";

export async function getProfile() {
  const response = await apiRequest("/users/me", { auth: true });

  if (response.message !== "user_info_success") {
    throw new Error("회원정보를 불러오지 못했습니다.");
  }

  return response.data;
}

export function updateProfile(profile) {
  return apiRequest("/users/me", {
    method: "PATCH",
    auth: true,
    body: profile,
  });
}

export function updatePassword(passwords) {
  return apiRequest("/users/me/password", {
    method: "PATCH",
    auth: true,
    body: passwords,
  });
}

export function deleteProfile() {
  return apiRequest("/users/me", {
    method: "DELETE",
    auth: true,
  });
}
