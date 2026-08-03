import { apiRequest } from "../../shared/api/client";

export function login(credentials) {
  return apiRequest("/users/login", {
    method: "POST",
    body: credentials,
  });
}

export function signup(user) {
  return apiRequest("/users/signup", {
    method: "POST",
    body: user,
  });
}
