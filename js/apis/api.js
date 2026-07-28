export async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.href = "/frontend/pages/login.html";
    return;
  }

  const requestOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(url, requestOptions);

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/frontend/pages/login.html";
    return;
  }

  return response;
}
