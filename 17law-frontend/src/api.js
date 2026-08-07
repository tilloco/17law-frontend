// All calls to your Rust backend go through here.
// If your actual Rust structs use different field names than the ones
// below, this is the ONLY file you should need to edit to match them.

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // sends/receives the session cookie
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.error || data.message || message;
    } catch {
      // response wasn't JSON, keep the generic message
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const api = {
  // -- auth --
  googleSignIn: (idToken) =>
    request("/auth/google", {
      method: "POST",
      body: JSON.stringify({ id_token: idToken }),
    }),
  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }),

  // -- quizzes --
  listQuizzes: () => request("/quizzes"),
  getQuiz: (id) => request(`/quizzes/${id}`),
  submitAttempt: (id, answers) =>
    request(`/quizzes/${id}/attempt`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
  likeQuiz: (id) => request(`/quizzes/${id}/like`, { method: "POST" }),
  unlikeQuiz: (id) => request(`/quizzes/${id}/like`, { method: "DELETE" }),

  // -- admin --
  createQuiz: (payload) =>
    request("/admin/quizzes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  addQuestion: (quizId, payload) =>
    request(`/admin/quizzes/${quizId}/questions`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  addOption: (questionId, payload) =>
    request(`/admin/questions/${questionId}/options`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  publishQuiz: (quizId) =>
    request(`/admin/quizzes/${quizId}/publish`, { method: "POST" }),
};
