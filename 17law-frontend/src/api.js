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

// The backend sends `liked_by_me` / `like_count`, but the quiz list/detail
// UI was built expecting `liked` / `likes_count`. Normalized here so we
// only have to fix it in one place instead of every component that reads
// a quiz object.
function normalizeQuiz(q) {
  if (!q) return q;
  return {
    ...q,
    liked: q.liked_by_me ?? q.liked ?? false,
    likes_count: q.like_count ?? q.likes_count ?? 0,
  };
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
  listQuizzes: async () => {
    const data = await request("/quizzes");
    const list = Array.isArray(data) ? data : data?.quizzes || [];
    return list.map(normalizeQuiz);
  },
  getQuiz: async (id) => normalizeQuiz(await request(`/quizzes/${id}`)),
  submitAttempt: (id, answers) =>
    request(`/quizzes/${id}/attempt`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
  likeQuiz: (id) => request(`/quizzes/${id}/like`, { method: "POST" }),
  unlikeQuiz: (id) => request(`/quizzes/${id}/like`, { method: "DELETE" }),

  // -- my dashboard (stats + history) --
  myStats: () => request("/me/stats"),
  myAttempts: (limit) =>
    request(`/me/attempts${limit ? `?limit=${limit}` : ""}`),

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
  adminStats: () => request("/admin/stats"),
  adminListUsers: () => request("/admin/users"),
  adminListQuizzes: () => request("/admin/quizzes"),
  adminDeleteQuiz: (id) =>
    request(`/admin/quizzes/${id}`, { method: "DELETE" }),
};