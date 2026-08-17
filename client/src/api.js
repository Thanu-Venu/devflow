export const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Wraps fetch() so every call to a protected endpoint automatically carries
// the JWT. If the token is missing/expired the API replies 401 - instead of
// letting callers try to .filter()/.map() an error object (which is what
// was crashing the app), we clear the stale token and force back to the
// login screen.
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("devflow:unauthorized"));
    throw new Error("Not authorized");
  }

  return res;
}
