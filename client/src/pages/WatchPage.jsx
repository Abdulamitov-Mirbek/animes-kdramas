import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import Comments from "../components/Comment";

const WatchPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubtitle, setSelectedSubtitle] = useState("");

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await api.get(`/episodes/${id}`);
        setEpisode(response.data.episode);
        if (response.data.episode.subtitles?.length) {
          setSelectedSubtitle(response.data.episode.subtitles[0].url);
        }
      } catch (error) {
        console.error("Failed to fetch episode:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisode();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">{t("common.loading")}</div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">{t("watch.episode_not_found")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md p-4">
        <div className="container mx-auto px-4">
          <Link
            to={`/title/${episode.titleId._id}`}
            className="text-white hover:text-red-500"
          >
            ← {t("watch.back_to")} {episode.titleId.title}
          </Link>
        </div>
      </div>

      <div className="pt-20">
        <div className="aspect-video bg-black">
          <ReactPlayer
            url={episode.videoUrl}
            controls
            width="100%"
            height="100%"
            playing={false}
            config={{
              file: {
                tracks: episode.subtitles?.map((sub) => ({
                  kind: "subtitles",
                  src: sub.url,
                  srcLang: sub.language,
                  label: sub.language === "ru" ? "Русский" : "English",
                  default: sub.language === "ru",
                })),
              },
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-2xl font-bold text-white">
            {t("watch.episode")} {episode.number}: {episode.title}
          </h1>

          {episode.subtitles?.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-gray-400 text-sm">
                {t("watch.subtitles")}:
              </span>
              <select
                value={selectedSubtitle}
                onChange={(e) => setSelectedSubtitle(e.target.value)}
                className="bg-gray-800 text-white text-sm rounded-lg px-2 py-1"
              >
                {episode.subtitles.map((sub, i) => (
                  <option key={i} value={sub.url}>
                    {sub.language === "ru" ? "Русский" : "English"}
                  </option>
                ))}
              </select>
            </div>
          )}

          <p className="text-gray-400 mt-4">{episode.description}</p>

          <Comments episodeId={id} />
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
