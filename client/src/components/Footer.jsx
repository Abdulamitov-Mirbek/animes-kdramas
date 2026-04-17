import React from "react";
import { Link } from "react-router-dom";
import { Heart, Twitter, Github, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black to-gray-900 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-bold text-gradient">
                Dramas & Animes
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your ultimate destination for streaming Korean dramas and anime in
              HD quality.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-red-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/titles"
                  className="hover:text-red-500 transition-colors"
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="hover:text-red-500 transition-colors"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
          <p>
            Made with <Heart className="w-4 h-4 inline text-red-500" /> for
            drama and anime lovers
          </p>
          <p className="mt-2">© 2024 Kdramas & Animes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
