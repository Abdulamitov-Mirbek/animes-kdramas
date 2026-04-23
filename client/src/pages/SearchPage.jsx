import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import TitleCard from "../components/TitleCard";

const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (term) => {
    if (!term.trim()) return;

    setLoading(true);
    try {
      const response = await api.get(`/search?q=${encodeURIComponent(term)}`);
      setResults(response.data.titles || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('search.search_button')}
            </button>
          </form>
        </div>

        {query && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">
              {t('search.results_for')}:{" "}
              <span className="text-red-500">"{query}"</span>
            </h1>
            <p className="text-gray-400 mt-2">{results.length} {t('search.found_titles')}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="text-white">{t('search.searching')}</div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((title) => (
              <TitleCard key={title._id} title={title} />
            ))}
          </div>
        ) : (
          query && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                {t('search.no_results')} "{query}"
              </p>
              <p className="text-gray-500 mt-2">
                {t('search.try_different')}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPage;