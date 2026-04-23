import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import TitleCard from "../components/TitleCard";

const TitlesPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["titles"],
    queryFn: () => api.get("/titles").then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">{t("common.loading")}</div>
      </div>
    );
  }

  const allTitles = data?.titles || [];

  // Filter titles
  let filteredTitles = allTitles;

  if (searchTerm) {
    filteredTitles = filteredTitles.filter(
      (title) =>
        title.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        title.originalTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (selectedType !== "all") {
    filteredTitles = filteredTitles.filter(
      (title) => title.type === selectedType,
    );
  }

  // Get unique genres
  const allGenres = [
    ...new Set(allTitles.flatMap((title) => title.genres || [])),
  ];

  if (selectedGenre !== "all") {
    filteredTitles = filteredTitles.filter((title) =>
      title.genres?.includes(selectedGenre),
    );
  }

  const dramas = filteredTitles.filter((t) => t.type === "drama");
  const animes = filteredTitles.filter((t) => t.type === "anime");

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t("titles.browse_all")}
          </h1>
          <p className="text-gray-400">{t("titles.discover")}</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("titles.search_by_title")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">{t("titles.type")}:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm"
              >
                <option value="all">{t("titles.all")}</option>
                <option value="drama">{t("titles.korean_dramas")}</option>
                <option value="anime">{t("titles.anime")}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">
                {t("titles.genre")}:
              </span>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm"
              >
                <option value="all">{t("titles.all_genres")}</option>
                {allGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            {t("titles.found_titles")}: {filteredTitles.length}
          </p>
        </div>

        {/* Dramas Section */}
        {selectedType === "all" || selectedType === "drama"
          ? dramas.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🎬</span> {t("titles.korean_dramas")}
                  <span className="text-sm text-gray-400">
                    ({dramas.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {dramas.map((title) => (
                    <TitleCard key={title._id} title={title} />
                  ))}
                </div>
              </div>
            )
          : null}

        {/* Anime Section */}
        {selectedType === "all" || selectedType === "anime"
          ? animes.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🎨</span> {t("titles.anime")}
                  <span className="text-sm text-gray-400">
                    ({animes.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {animes.map((title) => (
                    <TitleCard key={title._id} title={title} />
                  ))}
                </div>
              </div>
            )
          : null}

        {/* No Results */}
        {filteredTitles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">{t("titles.no_results")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TitlesPage;
