import { clearAccessToken, getAccessToken } from "../../features/auth/tokenStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function createUrl(path) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function moveToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function apiRequest(path, options = {}) {
  const { auth = false, headers, body, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (auth) {
    const token = getAccessToken();

    if (!token) {
      moveToLogin();
      throw new ApiError("로그인이 필요합니다.", { status: 401 });
    }

    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(createUrl(path), {
    ...requestOptions,
    headers: requestHeaders,
    body:
      body === undefined || body instanceof FormData ? body : JSON.stringify(body),
  });

  const responseBody = await parseResponse(response);

  if (response.status === 401 || response.status === 403) {
    clearAccessToken();
    moveToLogin();
    throw new ApiError("인증 정보가 유효하지 않습니다.", {
      status: response.status,
      body: responseBody,
    });
  }

  if (!response.ok) {
    throw new ApiError("요청을 처리하지 못했습니다.", {
      status: response.status,
      body: responseBody,
    });
  }

  return responseBody;
}
