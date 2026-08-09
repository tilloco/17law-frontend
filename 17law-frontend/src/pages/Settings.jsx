import { useAuth } from "../context/AuthContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Settings() {
  const { user } = useAuth();
  const { lang, setLang, t } = useLang();
  const { theme, setTheme } = useTheme();

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="admin-wrap">
        {/* Account info */}
        <div className="panel">
          <h2 className="panel-title">
            <span className="tag">Account</span>
          </h2>
          {user ? (
            <div className="settings-account-row">
              {user.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt=""
                  className="user-avatar"
                  style={{ width: 48, height: 48 }}
                />
              )}
              <div>
                <div className="settings-account-name">
                  {user.display_name || "—"}
                </div>
                <div className="settings-account-email">{user.email}</div>
              </div>
            </div>
          ) : (
            <p className="state-note">Not signed in.</p>
          )}
        </div>

        {/* Appearance */}
        <div className="panel">
          <h2 className="panel-title">
            <span className="tag">Appearance</span>
          </h2>
          <div className="field">
            <label>Theme</label>
            <div className="theme-toggle-row">
              <button
                className={"btn " + (theme === "dark" ? "btn-gold" : "btn-ghost")}
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
              <button
                className={"btn " + (theme === "light" ? "btn-gold" : "btn-ghost")}
                onClick={() => setTheme("light")}
              >
                Light
              </button>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="panel">
          <h2 className="panel-title">
            <span className="tag">Language</span>
          </h2>
          <div className="field">
            <label>{t.language || "Language"}</label>
            <div className="theme-toggle-row">
              <button
                className={"btn " + (lang === "en" ? "btn-gold" : "btn-ghost")}
                onClick={() => setLang("en")}
              >
                English
              </button>
              <button
                className={"btn " + (lang === "ru" ? "btn-gold" : "btn-ghost")}
                onClick={() => setLang("ru")}
              >
                Русский
              </button>
              <button
                className={"btn " + (lang === "uz" ? "btn-gold" : "btn-ghost")}
                onClick={() => setLang("uz")}
              >
                O'zbek
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}