import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useLang } from "../context/LangContext.jsx";
import SealStamp from "../components/SealStamp.jsx";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function QuizTake() {
  const { id } = useParams();
  const { t } = useLang();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: optionId }
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .getQuiz(id)
      .then((data) => setQuiz(data))
      .catch((e) => setError(e.message || t.loadError));
  }, [id]);

  if (error) {
    return (
      <div className="container">
        <p className="state-note error">{error}</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container">
        <p className="state-note">{t.loading}</p>
      </div>
    );
  }

  const questions = quiz.questions || [];

  if (result) {
    const passed = result.passed ?? (result.score >= result.total * 0.6);
    return (
      <div className="container">
        <div className="results-wrap">
          <SealStamp passed={passed} label={passed ? "✓" : "✕"} />
          <div className="score-line">
            {t.yourScore}: <strong>{result.score ?? "—"}</strong> {t.of}{" "}
            {result.total ?? questions.length}
          </div>
          <div className="score-line">{passed ? t.passed : t.failed}</div>
          <div className="results-actions">
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/quizzes")}
            >
              {t.backToQuizzes}
            </button>
            <button
              className="btn btn-gold"
              onClick={() => {
                setResult(null);
                setAnswers({});
                setIndex(0);
              }}
            >
              {t.retake}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[index];
  const progressPct = questions.length
    ? Math.round(((index + 1) / questions.length) * 100)
    : 0;

  async function selectOption(optionId) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  }

  async function goNext() {
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      submitQuiz();
    }
  }

  function goPrev() {
    if (index > 0) setIndex(index - 1);
  }

  async function submitQuiz() {
    setSubmitting(true);
    setError(null);
    const payload = Object.entries(answers).map(
      ([question_id, option_id]) => ({ question_id, option_id })
    );
    try {
      const data = await api.submitAttempt(id, payload);
      setResult(data || { score: 0, total: questions.length });
    } catch (e) {
      setError(e.message || t.loadError);
    } finally {
      setSubmitting(false);
    }
  }

  if (!question) {
    return (
      <div className="container">
        <p className="state-note">{t.noQuizzes}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="quiz-take">
        <div className="progress-row">
          <span className="progress-label">
            {t.questions.toUpperCase()} {index + 1} {t.of} {questions.length}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <h2 className="question-text">{question.text}</h2>

        <div className="option-list">
          {(question.options || []).map((opt, i) => (
            <button
              key={opt.id}
              className={
                "option-row" +
                (answers[question.id] === opt.id ? " selected" : "")
              }
              onClick={() => selectOption(opt.id)}
            >
              <span className="option-letter">{LETTERS[i] || i + 1}</span>
              <span>{opt.text}</span>
            </button>
          ))}
        </div>

        {error && <p className="state-note error">{error}</p>}

        <div className="quiz-nav-row">
          <button
            className="btn btn-ghost"
            onClick={goPrev}
            disabled={index === 0}
          >
            {t.previous}
          </button>
          <button
            className="btn btn-gold"
            onClick={goNext}
            disabled={!answers[question.id] || submitting}
          >
            {index === questions.length - 1 ? t.finish : t.next}
          </button>
        </div>
      </div>
    </div>
  );
}
