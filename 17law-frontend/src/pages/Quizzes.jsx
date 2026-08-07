import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useLang } from "../context/LangContext.jsx";

export default function Quizzes() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setError(null);
    try {
      const data = await api.listQuizzes();
      setQuizzes(Array.isArray(data) ? data : data?.quizzes || []);
    } catch (e) {
      setError(e.message || t.loadError);
    }
  }

  async function toggleLike(quiz, e) {
    e.stopPropagation();
    const wasLiked = quiz.liked;
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quiz.id
          ? {
              ...q,
              liked: !wasLiked,
              likes_count: (q.likes_count || 0) + (wasLiked ? -1 : 1),
            }
          : q
      )
    );
    try {
      if (wasLiked) await api.unlikeQuiz(quiz.id);
      else await api.likeQuiz(quiz.id);
    } catch {
      load(); // out of sync with server - just refetch
    }
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-title">{t.quizzes}</h1>
        {quizzes && (
          <span className="page-count">
            {quizzes.length} {t.questions === "questions" ? "total" : ""}
          </span>
        )}
      </div>

      {!quizzes && !error && <p className="state-note">{t.loading}</p>}
      {error && <p className="state-note error">{error}</p>}
      {quizzes && quizzes.length === 0 && (
        <p className="state-note">{t.noQuizzes}</p>
      )}

      {quizzes && quizzes.length > 0 && (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              className="quiz-card"
              onClick={() => navigate(`/quizzes/${quiz.id}`)}
            >
              <div className="quiz-card-top">
                <h3 className="quiz-title">{quiz.title}</h3>
                {quiz.language && (
                  <span className="tag">{quiz.language}</span>
                )}
              </div>
              {quiz.description && (
                <p className="quiz-desc">{quiz.description}</p>
              )}
              <div className="quiz-card-bottom">
                <span>
                  {quiz.question_count ?? "—"} {t.questions}
                </span>
                <button
                  className={"like-btn" + (quiz.liked ? " liked" : "")}
                  onClick={(e) => toggleLike(quiz, e)}
                >
                  {quiz.liked ? "♥" : "♡"} {quiz.likes_count ?? 0}
                </button>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
