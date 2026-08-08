import { useState } from "react";
import { api } from "../api.js";
import { useLang } from "../context/LangContext.jsx";

export default function AdminMaterials() {
  const { t } = useLang();

  const [category, setCategory] = useState("civil");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPremium, setIsPremium] = useState(true);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setStatus({ ok: false, msg: "Please choose a PDF file." });
      return;
    }
    setUploading(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("is_premium", isPremium ? "true" : "false");
      formData.append("file", file);

      await api.uploadMaterial(formData);
      setStatus({ ok: true, msg: "Material uploaded successfully." });
      setTitle("");
      setDescription("");
      setFile(null);
      e.target.reset();
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-title">Materials</h1>
      </div>

      <div className="admin-wrap">
        <div className="panel">
          <h2 className="panel-title">
            <span className="tag">PDF</span> Upload study material
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="civil">Civil</option>
                <option value="criminal">Criminal</option>
                <option value="constitutional">Constitutional</option>
                <option value="administrative">Administrative</option>
              </select>
            </div>

            <div className="field">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="field">
              <label>PDF file</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0] || null)}
                required
              />
            </div>

            <label className="checkbox-row" style={{ marginBottom: 16 }}>
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
              />
              Premium (requires subscription)
            </label>

            <button className="btn btn-gold" type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
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