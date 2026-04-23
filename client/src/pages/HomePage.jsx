import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Play, TrendingUp, Star, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import TitleCard from "../components/TitleCard";

const HomePage = () => {
  const { t } = useTranslation();

  const {
    data: titlesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["titles"],
    queryFn: () =>
      api.get("/titles").then((res) => {
        console.log("API Response:", res.data);
        return res.data;
      }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4 text-sm">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching titles:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-red-500">
          {t("common.error")}: {error.message}
        </div>
      </div>
    );
  }

  const allTitles = titlesData?.titles || [];
  const dramas = allTitles.filter((t) => t.type === "drama");
  const animes = allTitles.filter((t) => t.type === "anime");
  const trending = [...allTitles].sort(
    (a, b) => (b.rating?.average || 0) - (a.rating?.average || 0),
  );

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      {trending[0] && (
        <div className="relative h-[70vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
          <img
            src={
              trending[0].poster?.url || "https://via.placeholder.com/1920x1080"
            }
            alt={trending[0].title}
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-20 left-0 right-0 z-20 container mx-auto px-4 md:px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {trending[0].title}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-white">
                  {trending[0].rating?.average?.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300">{trending[0].year}</span>
              <span className="text-gray-300">
                {trending[0].totalEpisodes} {t("home.episodes")}
              </span>
            </div>
            <p className="text-gray-300 max-w-xl line-clamp-2">
              {trending[0].description}
            </p>
            <Link
              to={`/title/${trending[0]._id}`}
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              <Play className="w-4 h-4" />
              {t("home.watch_now")}
            </Link>
          </div>
        </div>
      )}

      {/* Trending Row */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            {t("home.trending_now")}
          </h2>
          <Link to="/titles" className="text-gray-400 hover:text-white text-sm">
            {t("home.view_all")} <ChevronRight className="inline w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {trending.slice(0, 12).map((title) => (
            <TitleCard key={title._id} title={title} />
          ))}
        </div>
      </div>

      {/* Korean Dramas Row */}
      {dramas.length > 0 && (
        <div className="container mx-auto px-4 md:px-8 py-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🇰🇷</span> {t("home.korean_dramas")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {dramas.slice(0, 12).map((title) => (
              <TitleCard key={title._id} title={title} />
            ))}
          </div>
        </div>
      )}

      {/* Anime Row */}
      {animes.length > 0 && (
        <div className="container mx-auto px-4 md:px-8 py-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🎌</span> {t("home.anime_series")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {animes.slice(0, 12).map((title) => (
              <TitleCard key={title._id} title={title} />
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="border-t border-white/10 py-12 mt-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-red-500">
                {allTitles.length}+
              </div>
              <div className="text-gray-400 text-sm">
                {t("home.stats.total_titles")}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">
                {allTitles.reduce((sum, t) => sum + (t.totalEpisodes || 0), 0)}+
              </div>
              <div className="text-gray-400 text-sm">
                {t("home.stats.episodes")}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">HD</div>
              <div className="text-gray-400 text-sm">
                {t("home.stats.quality")}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">24/7</div>
              <div className="text-gray-400 text-sm">
                {t("home.stats.streaming")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
