import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import { LANGS } from "../i18n.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
              to="/dashboard"
              className={
                "nav-link" +
                (location.pathname.startsWith("/dashboard") ? " active" : "")
              }
            >
              {t.dashboard || "Dashboard"}
            </Link>
          )}
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
          {user && user.role === "admin" && (
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
            <div className="account-menu" ref={menuRef}>
              <button
                className="account-trigger"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {user.avatar_url && (
                  <img className="user-avatar" src={user.avatar_url} alt="" />
                )}
                <span className="account-name">
                  {user.display_name || user.email}
                </span>
                <svg
                  className={"account-chevron" + (menuOpen ? " open" : "")}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                >
                  <path
                    d="M1 3L5 7L9 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {menuOpen && (
                <div className="account-dropdown">
                  <button
                    className="account-dropdown-item"
                    onClick={() => navigate("/settings")}
                  >
                    {t.settings || "Settings"}
                  </button>
                  <div className="account-dropdown-divider" />
                  <button
                    className="account-dropdown-item danger"
                    onClick={logout}
                  >
                    {t.logout}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}