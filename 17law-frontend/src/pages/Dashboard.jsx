import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useLang } from "../context/LangContext.jsx";

export default function Dashboard() {
  const { t } = useLang();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [attempts, setAttempts] = useState(null);
  const [quizzes, setQuizzes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setError(null);
    try {
      const [statsData, attemptsData, quizzesData] = await Promise.all([
        api.myStats(),
        api.myAttempts(5),
        api.listQuizzes(),
      ]);
      setStats(statsData);
      setAttempts(attemptsData);
      setQuizzes(quizzesData.slice(0, 6));
    } catch (e) {
      setError(e.message || t.loadError || "Failed to load");
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
      load();
    }
  }

  const loading = !stats && !attempts && !quizzes && !error;

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-title">{t.dashboard || "Dashboard"}</h1>
      </div>

      {loading && <p className="state-note">{t.loading}</p>}
      {error && <p className="state-note error">{error}</p>}

      {stats && (
        <div className="stats-grid">
          <StatCard
            label={t.totalAttempts || "Total attempts"}
            value={stats.total_attempts}
          />
          <StatCard
            label={t.quizzesCompleted || "Quizzes completed"}
            value={stats.quizzes_completed}
          />
          <StatCard
            label={t.averageScore || "Average score"}
            value={`${Math.round(stats.average_score_pct)}%`}
          />
          <StatCard
            label={t.bestScore || "Best score"}
            value={`${Math.round(stats.best_score_pct)}%`}
          />
          <StatCard
            label={t.attemptsThisWeek || "This week"}
            value={stats.attempts_this_week}
          />
        </div>
      )}

      {attempts && (
        <div className="dashboard-section">
          <h2 className="section-title">{t.recentActivity || "Recent activity"}</h2>
          {attempts.length === 0 ? (
            <p className="state-note">
              {t.noAttemptsYet || "No attempts yet — take your first quiz below."}
            </p>
          ) : (
            <div className="attempt-list">
              {attempts.map((a) => {
                const pct = a.total_points > 0
                  ? Math.round((a.score / a.total_points) * 100)
                  : 0;
                return (
                  <button
                    key={a.attempt_id}
                    className="attempt-row"
                    onClick={() => navigate(`/quizzes/${a.quiz_id}`)}
                  >
                    <div className="attempt-row-main">
                      <span className="attempt-title">{a.quiz_title}</span>
                      <span className="tag">{a.category}</span>
                    </div>
                    <div className="attempt-row-score">
                      <span className={pct >= 60 ? "score-good" : "score-low"}>
                        {a.score}/{a.total_points} ({pct}%)
                      </span>
                      <span className="attempt-date">
                        {new Date(a.completed_at).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {quizzes && (
        <div className="dashboard-section">
          <div className="page-head">
            <h2 className="section-title">{t.continueLearning || "Take a quiz"}</h2>
            <button className="link-btn" onClick={() => navigate("/quizzes")}>
              {t.viewAll || "View all"}
            </button>
          </div>

          {quizzes.length === 0 ? (
            <p className="state-note">{t.noQuizzes}</p>
          ) : (
            <div className="quiz-grid">
              {quizzes.map((quiz) => (
                <button
                  key={quiz.id}
                  className="quiz-card"
                  onClick={() => navigate(`/quizzes/${quiz.id}`)}
                >
                  <div className="quiz-card-top">
                    <h3 className="quiz-title">{quiz.title}</h3>
                    {quiz.language && <span className="tag">{quiz.language}</span>}
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
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}