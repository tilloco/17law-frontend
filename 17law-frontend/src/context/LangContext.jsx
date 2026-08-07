import { createContext, useContext, useMemo, useState } from "react";
import { STRINGS } from "../i18n.js";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("17law_lang") || "en"
  );

  function changeLang(next) {
    setLang(next);
    localStorage.setItem("17law_lang", next);
  }

  const t = useMemo(() => STRINGS[lang] || STRINGS.en, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
