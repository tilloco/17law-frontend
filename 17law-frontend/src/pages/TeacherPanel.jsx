import { useState } from "react";
import { api } from "../api.js";

export default function TeacherPanel() {
  const [category, setCategory] = useState("civil");
  const [price, setPrice] = useState("");
  const [titleUz, setTitleUz] = useState("");
  const [descUz, setDescUz] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [descRu, setDescRu] = useState("");
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    const translations = [];
    if (titleUz.trim()) {
      translations.push({
        language_code: "uz",
        title: titleUz,
        description: descUz || null,
      });
    }
    if (titleRu.trim()) {
      translations.push({
        language_code: "ru",
        title: titleRu,
        description: descRu || null,
      });
    }

    if (translations.length === 0) {
      setStatus({ ok: false, msg: "Add a title in at least one language." });
      return;
    }

    setSaving(true);
    try {
      await api.createCourse({
        category,
        price_usd: price ? parseFloat(price) : null,
        translations,
      });
      setStatus({ ok: true, msg: "Course created." });
      setTitleUz("");
      setDescUz("");
      setTitleRu("");
      setDescRu("");
      setPrice("");
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-title">Teacher Panel</h1>
      </div>

      <div className="admin-wrap">
        <div className="panel">
          <h2 className="panel-title">
            <span className="tag">New</span> Create a course
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="inline-row">
              <div className="field" style={{ flex: 1 }}>
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="civil">Civil</option>
                  <option value="criminal">Criminal</option>
                  <option value="constitutional">Constitutional</option>
                  <option value="administrative">Administrative</option>
                </select>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Price (USD, leave blank for free)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="field">
              <label>Title (O'zbek)</label>
              <input
                type="text"
                value={titleUz}
                onChange={(e) => setTitleUz(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Description (O'zbek)</label>
              <textarea
                value={descUz}
                onChange={(e) => setDescUz(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Title (Русский)</label>
              <input
                type="text"
                value={titleRu}
                onChange={(e) => setTitleRu(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Description (Русский)</label>
              <textarea
                value={descRu}
                onChange={(e) => setDescRu(e.target.value)}
              />
            </div>

            <button className="btn btn-gold" type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create Course"}
            </button>
          </form>

          {status && (
            <p className={"admin-status " + (status.ok ? "ok" : "err")}>
              {status.msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}