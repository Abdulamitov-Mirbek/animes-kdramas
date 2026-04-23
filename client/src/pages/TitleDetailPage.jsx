import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Play, Calendar, Clock, Film, Star, PlusCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import RatingCircle from "../components/RatingCircle";

const TitleDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["title", id],
    queryFn: () => api.get(`/titles/${id}`).then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const title = data?.title;
  const rating = title?.rating?.average || 0;

  if (!title) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">{t('title_detail.title_not_found')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={
                  title.poster?.url ||
                  "https://placehold.co/300x450/1a1a1a/ffffff?text=No+Poster"
                }
                alt={title.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {title.title}
                </h1>
                <p className="text-gray-400 mb-4">{title.originalTitle}</p>
              </div>
              {rating > 0 && (
                <div className="ml-4">
                  <RatingCircle rating={rating} size={80} />
                </div>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{title.year}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Film className="w-4 h-4" />
                <span>{title.type === "drama" ? t('title_detail.korean_drama') : t('title_detail.anime')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{title.totalEpisodes} {t('title_detail.episodes')}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {title.genres?.map((genre, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">
                {t('title_detail.synopsis')}
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {title.description}
              </p>
            </div>

            {/* Admin Button - Add Episode */}
            {isAdmin && (
              <div className="mb-8">
                <Link
                  to={`/admin/add-episode?titleId=${title._id}&titleName=${encodeURIComponent(title.title)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  {t('title_detail.add_episode_to')} {title.title}
                </Link>
              </div>
            )}

            {/* Episodes List */}
            {title.episodes && title.episodes.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('title_detail.episodes')}
                </h2>
                <div className="space-y-3">
                  {title.episodes.map((episode) => (
                    <Link
                      key={episode._id}
                      to={`/watch/${episode._id}`}
                      className="block bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-red-500 font-semibold">
                            {t('title_detail.episode')} {episode.number}
                          </span>
                          <h3 className="text-white font-medium mt-1">
                            {episode.title}
                          </h3>
                          {episode.duration > 0 && (
                            <p className="text-gray-400 text-sm mt-1">
                              {Math.floor(episode.duration / 60)} {t('title_detail.minutes')}
                            </p>
                          )}
                        </div>
                        <Play className="w-8 h-8 text-red-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800/30 rounded-lg">
                <p className="text-gray-400">{t('title_detail.no_episodes')}</p>
                {isAdmin && (
                  <Link
                    to={`/admin/add-episode?titleId=${title._id}&titleName=${encodeURIComponent(title.title)}`}
                    className="inline-block mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
                  >
                    {t('title_detail.add_first_episode')}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleDetailPage;