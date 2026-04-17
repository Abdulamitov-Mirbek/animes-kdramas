import React, { useState, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("language") || "ru";
  });

  const translatePage = (targetLang) => {
    if (targetLang === "ru") {
      localStorage.removeItem("language");
      window.location.reload();
      return;
    }

    localStorage.setItem("language", targetLang);

    // Используем Яндекс переводчик
    const currentUrl = window.location.href;
    const translateUrl = `https://translate.yandex.ru/translate?url=${encodeURIComponent(currentUrl)}&lang=${targetLang}`;

    window.location.href = translateUrl;
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    translatePage(langCode);
  };

  const currentLanguage =
    languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-all duration-200"
      >
        <Globe size={18} className="text-gray-400" />
        <span className="text-sm text-white">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-dark-200 rounded-lg shadow-xl border border-white/10 z-50 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  currentLang === lang.code
                    ? "bg-primary-600/20 text-primary-500"
                    : "text-gray-300 hover:bg-dark-300"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                {currentLang === lang.code && (
                  <span className="ml-auto text-primary-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
