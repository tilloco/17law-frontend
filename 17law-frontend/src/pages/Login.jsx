import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLang } from "../context/LangContext.jsx";

export default function Login() {
  const { user, refreshUser } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate("/quizzes", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    function renderButton() {
      if (!window.google || !buttonRef.current) return;
      if (!clientId || clientId.includes("your-google-oauth-client-id")) {
        setError(
          "Add VITE_GOOGLE_CLIENT_ID to your .env file to enable Google sign-in."
        );
        return;
      }
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredential,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        text: "signin_with",
      });
    }

    if (window.google) {
      renderButton();
    } else {
      const script = document.querySelector('script[src*="gsi/client"]');
      script?.addEventListener("load", renderButton);
      return () => script?.removeEventListener("load", renderButton);
    }
  }, []);

  async function handleCredential(response) {
    setError(null);
    try {
      await api.googleSignIn(response.credential);
      await refreshUser();
      navigate("/quizzes");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="container">
      <div className="hero">
        <div className="hero-numeral">17</div>
        <div>
          <div className="hero-eyebrow">{t.heroEyebrow}</div>
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-sub">{t.heroSub}</p>
          <div id="google-btn" ref={buttonRef}></div>
          {error && <p className="error-note">{error}</p>}
        </div>
      </div>
    </div>
  );
}
