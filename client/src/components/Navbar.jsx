import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  LogOut,
  Film,
  Tv,
  Menu,
  X,
  Languages,
  Globe,
} from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setShowLanguageMenu(false);
  };

  const navLinks = [
    { path: "/", label: t("nav.home"), icon: Film },
    { path: "/titles", label: t("nav.titles"), icon: Tv },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-effect"
          : "bg-gradient-to-b from-dark-100 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">K</span>
            </motion.div>
            <span className="text-2xl font-bold gradient-text hidden sm:inline">
              {t("app.name")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 transition-colors ${
                  location.pathname === link.path
                    ? "text-primary-500"
                    : "text-gray-300 hover:text-primary-400"
                }`}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav.search_placeholder")}
                className="w-64 px-4 py-2 bg-dark-200 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-500"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* User Menu and Language Switcher - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-all duration-200"
              >
                <Globe size={18} className="text-gray-400" />
                <span className="text-sm text-white">
                  {i18n.language === "en" ? "EN" : "RU"}
                </span>
                <Languages size={14} className="text-gray-400" />
              </button>

              {showLanguageMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLanguageMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-dark-200 rounded-lg shadow-xl border border-white/10 z-50 overflow-hidden">
                    <button
                      onClick={() => changeLanguage("en")}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-300 transition-all ${
                        i18n.language === "en"
                          ? "bg-primary-600/20 text-primary-500"
                          : "text-white"
                      }`}
                    >
                      <span className="text-xl">🇬🇧</span>
                      <span>English</span>
                      {i18n.language === "en" && (
                        <span className="ml-auto text-primary-500">✓</span>
                      )}
                    </button>
                    <button
                      onClick={() => changeLanguage("ru")}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-300 transition-all ${
                        i18n.language === "ru"
                          ? "bg-primary-600/20 text-primary-500"
                          : "text-white"
                      }`}
                    >
                      <span className="text-xl">🇷🇺</span>
                      <span>Русский</span>
                      {i18n.language === "ru" && (
                        <span className="ml-auto text-primary-500">✓</span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-dark-200 hover:bg-dark-300 transition-all"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium">{user?.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-dark-200 transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all"
                >
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-dark-200"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-effect"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("nav.search_placeholder")}
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <Search size={20} />
                </button>
              </form>

              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === link.path
                      ? "bg-primary-600/20 text-primary-500"
                      : "hover:bg-dark-200"
                  }`}
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Mobile Language Switcher */}
              <div className="px-4 py-2 space-y-2">
                <div className="text-sm text-gray-400 mb-2">
                  {t("nav.language")}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      changeLanguage("en");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      i18n.language === "en"
                        ? "bg-primary-600 text-white"
                        : "bg-dark-200 text-gray-300 hover:bg-dark-300"
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>EN</span>
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage("ru");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      i18n.language === "ru"
                        ? "bg-primary-600 text-white"
                        : "bg-dark-200 text-gray-300 hover:bg-dark-300"
                    }`}
                  >
                    <span>🇷🇺</span>
                    <span>RU</span>
                  </button>
                </div>
              </div>

              {/* Mobile User Menu */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-dark-200 transition-all"
                  >
                    <User size={20} />
                    <span>{t("nav.profile")}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-dark-200 transition-all text-red-400"
                  >
                    <LogOut size={20} />
                    <span>{t("nav.logout")}</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center rounded-lg bg-dark-200 hover:bg-dark-300 transition-all"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 font-semibold"
                  >
                    {t("nav.register")}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
  