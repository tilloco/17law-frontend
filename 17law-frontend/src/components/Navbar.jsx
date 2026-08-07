import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import { LANGS } from "../i18n.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const location = useLocation();

  return (
    <div className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-seal">17</span>
          <span className="brand-word">LAW</span>
        </Link>

        <div className="nav-links">
          {user && (
            <Link
              to="/quizzes"
              className={
                "nav-link" +
                (location.pathname.startsWith("/quizzes") ? " active" : "")
              }
            >
              {t.quizzes}
            </Link>
          )}
          {user && (
            <Link
              to="/admin"
              className={
                "nav-link" +
                (location.pathname.startsWith("/admin") ? " active" : "")
              }
            >
              {t.admin}
            </Link>
          )}

          <div className="lang-switch">
            {LANGS.map((code) => (
              <button
                key={code}
                className={"lang-pill" + (lang === code ? " active" : "")}
                onClick={() => setLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          {user ? (
            <div className="user-chip">
              {user.avatar_url && (
                <img className="user-avatar" src={user.avatar_url} alt="" />
              )}
              <button className="btn btn-ghost" onClick={logout}>
                {t.logout}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
