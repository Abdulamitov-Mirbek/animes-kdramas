import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 rounded transition-colors ${
          currentLanguage === "en"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
        }`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => changeLanguage("ru")}
        className={`px-3 py-1 rounded transition-colors ${
          currentLanguage === "ru"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
        }`}
      >
        🇷🇺 RU
      </button>
    </div>
  );
};

export default LanguageSwitcher;
