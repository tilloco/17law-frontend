import { useState } from "react";
import { api } from "../api.js";
import { useLang } from "../context/LangContext.jsx";

export default function Admin() {
  const { t } = useLang();

  // step 1: create quiz
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("en");
  const [category, setCategory] = useState("civil");
  const [difficulty, setDifficulty] = useState("easy");
  const [quiz, setQuiz] = useState(null);
  const [quizStatus, setQuizStatus] = useState(null);

  // step 2: questions built up locally, one "current" question in progress
  const [questions, setQuestions] = useState([]);
  const [qText, setQText] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [optText, setOptText] = useState("");
  const [optCorrect, setOptCorrect] = useState(false);
  const [optionCount, setOptionCount] = useState(0);
  const [status, setStatus] = useState(null);

  // step 3: publish
  const [published, setPublished] = useState(false);

  async function handleCreateQuiz(e) {
    e.preventDefault();
    setQuizStatus(null);
    try {
      const created = await api.createQuiz({
        category,
        difficulty,
        translations: [{ language_code: language, title, description }],
      });
      setQuiz(created);
      setQuizStatus({ ok: true, msg: `Quiz created (id: ${created.id ?? "?"})` });
    } catch (err) {
      setQuizStatus({ ok: false, msg: err.message });
    }
  }

  async function handleAddQuestion(e) {
    e.preventDefault();
    setStatus(null);
    try {
      const created = await api.addQuestion(quiz.id, {
        order_index: questions.length,
        points: 1,
        translations: [{ language_code: language, question_text: qText }],
      });
      // backend only returns { id }, so we keep the text locally for display
      const withText = { id: created.id, text: qText };
      setCurrentQuestion(withText);
      setQuestions((prev) => [...prev, withText]);
      setQText("");
      setOptionCount(0);
      setStatus({ ok: true, msg: "Question added — now add its options below." });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  }

  async function handleAddOption(e) {
    e.preventDefault();
    setStatus(null);
    try {
      await api.addOption(currentQuestion.id, {
        order_index: optionCount,
        is_correct: optCorrect,
        translations: [{ language_code: language, option_text: optText }],
      });
      setOptionCount((prev) => prev + 1);
      setOptText("");
      setOptCorrect(false);
      setStatus({ ok: true, msg: "Option added." });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  }

  async function handlePublish() {
    setStatus(null);
    try {
      await api.publishQuiz(quiz.id);
      setPublished(true);
      setStatus({ ok: true, msg: t.published });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-title">{t.admin}</h1>
      </div>

      <div className="admin-wrap">
        {/* Step 1 */}
        <div className="panel">
          <h2 className="panel-title">
            <span className="tag">1</span> {t.createQuiz}
          </h2>
          {!quiz ? (
            <form onSubmit={handleCreateQuiz}>
              <div className="field">
                <label>{t.title}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>{t.description}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="inline-row">
                <div className="field" style={{ flex: 1 }}>
                  <label>{t.language}</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                    <option value="uz">O'zbek</option>
                  </select>
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="civil">Civil</option>
                    <option value="criminal">Criminal</option>
                    <option value="constitutional">Constitutional</option>
                    <option value="administrative">Administrative</option>
                  </select>
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label>Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-gold" type="submit">
                {t.create}
              </button>
            </form>
          ) : (
            <p className="admin-status ok">
              "{quiz.title || title}" — id: {quiz.id ?? "?"}
            </p>
          )}
          {quizStatus && (
            <p className={"admin-status " + (quizStatus.ok ? "ok" : "err")}>
              {quizStatus.msg}
            </p>
          )}
        </div>

        {/* Step 2 */}
        {quiz && (
          <div className="panel">
            <h2 className="panel-title">
              <span className="tag">2</span> {t.addQuestion}
            </h2>

            {questions.length > 0 && (
              <ul className="list-plain">
                {questions.map((q) => (
                  <li key={q.id}>{q.text}</li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddQuestion}>
              <div className="field">
                <label>{t.questionText}</label>
                <input
                  type="text"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-ghost" type="submit">
                {t.add}
              </button>
            </form>

            {currentQuestion && (
              <div style={{ marginTop: 20 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--muted)",
                    marginBottom: 10,
                  }}
                >
                  {t.addOption} — "{currentQuestion.text}"
                </h3>
                <form onSubmit={handleAddOption}>
                  <div className="option-input-row">
                    <input
                      type="text"
                      placeholder={t.optionText}
                      value={optText}
                      onChange={(e) => setOptText(e.target.value)}
                      required
                    />
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={optCorrect}
                        onChange={(e) => setOptCorrect(e.target.checked)}
                      />
                      {t.correct}
                    </label>
                    <button className="btn btn-ghost" type="submit">
                      {t.add}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {status && (
              <p className={"admin-status " + (status.ok ? "ok" : "err")}>
                {status.msg}
              </p>
            )}
          </div>
        )}

        {/* Step 3 */}
        {quiz && questions.length > 0 && (
          <div className="panel">
            <h2 className="panel-title">
              <span className="tag">3</span> {t.publish}
            </h2>
            <button
              className="btn btn-gold"
              onClick={handlePublish}
              disabled={published}
            >
              {published ? t.published : t.publish}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}