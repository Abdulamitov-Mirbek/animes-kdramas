import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
} from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTranslate, setShowTranslate] = useState(false);

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

  const navLinks = [
    { path: "/", label: "Home", icon: Film },
    { path: "/titles", label: "Browse", icon: Tv },
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
              Dramas & Animes
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
                placeholder="Search dramas & animes..."
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

          {/* User Menu and Google Translate - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Google Translate Button */}
            <div className="relative">
              <button
                onClick={() => setShowTranslate(!showTranslate)}
                className="flex items-center gap-2 px-3 py-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-all duration-200"
              >
                <Languages size={18} className="text-gray-400" />
                <span className="text-sm text-white">Translate</span>
              </button>

              {showTranslate && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowTranslate(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-dark-200 rounded-lg shadow-xl border border-white/10 z-50 p-4">
                    <div
                      id="google_translate_element"
                      className="translate-widget"
                    ></div>
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
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all"
                >
                  Sign Up
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
                  placeholder="Search..."
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

              {/* Mobile Google Translate */}
              <div className="px-4 py-2">
                <div
                  id="google_translate_element_mobile"
                  className="translate-widget"
                ></div>
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
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-dark-200 transition-all text-red-400"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center rounded-lg bg-dark-200 hover:bg-dark-300 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 font-semibold"
                  >
                    Sign Up
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
