import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import toast from "react-hot-toast";

const AddEpisode = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedTitleId = searchParams.get("titleId");
  const preselectedTitleName = searchParams.get("titleName");

  const [selectedTitle, setSelectedTitle] = useState(preselectedTitleId || "");
  const [episodeData, setEpisodeData] = useState({
    number: 1,
    title: "",
    description: "",
    duration: 0,
    videoUrl: "",
    videoQuality: "720p",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploadType, setUploadType] = useState("url");
  const [loading, setLoading] = useState(false);

  const { data: titlesData } = useQuery({
    queryKey: ["titles"],
    queryFn: () => api.get("/titles").then((res) => res.data),
  });

  const titles = titlesData?.titles || [];

  useEffect(() => {
    if (preselectedTitleId) {
      const fetchLastEpisodeNumber = async () => {
        try {
          const response = await api.get(
            `/episodes/title/${preselectedTitleId}`,
          );
          const episodes = response.data.episodes || [];
          const maxNumber = episodes.reduce(
            (max, ep) => Math.max(max, ep.number),
            0,
          );
          setEpisodeData((prev) => ({ ...prev, number: maxNumber + 1 }));
        } catch (error) {
          console.error("Failed to fetch episodes:", error);
        }
      };
      fetchLastEpisodeNumber();
    }
  }, [preselectedTitleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTitle) {
      toast.error(t('admin.select_title_error'));
      return;
    }

    setLoading(true);

    try {
      if (uploadType === "file" && videoFile) {
        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("number", episodeData.number);
        formData.append("title", episodeData.title);
        formData.append("description", episodeData.description);
        formData.append("duration", episodeData.duration);
        formData.append("videoQuality", episodeData.videoQuality);

        await api.post(`/titles/${selectedTitle}/episodes`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(`/titles/${selectedTitle}/episodes`, {
          number: episodeData.number,
          title: episodeData.title,
          description: episodeData.description,
          duration: episodeData.duration,
          videoUrl: episodeData.videoUrl,
          videoQuality: episodeData.videoQuality,
        });
      }

      toast.success(t('admin.episode_added_success'));
      setEpisodeData({
        number: episodeData.number + 1,
        title: "",
        description: "",
        duration: 0,
        videoUrl: "",
        videoQuality: "720p",
      });
      setVideoFile(null);

      if (preselectedTitleId) {
        setTimeout(() => navigate(`/title/${preselectedTitleId}`), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('admin.add_episode_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            {t('admin.add_episode')} {preselectedTitleName && `${t('admin.for')} ${preselectedTitleName}`}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('admin.select_title')}
              </label>
              <select
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                required
                disabled={!!preselectedTitleId}
              >
                <option value="">{t('admin.select_title_placeholder')}</option>
                {titles.map((title) => (
                  <option key={title._id} value={title._id}>
                    {title.title} ({title.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('admin.episode_number')}
              </label>
              <input
                type="number"
                value={episodeData.number}
                onChange={(e) =>
                  setEpisodeData({
                    ...episodeData,
                    number: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('admin.episode_title')}
              </label>
              <input
                type="text"
                value={episodeData.title}
                onChange={(e) =>
                  setEpisodeData({ ...episodeData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('admin.description')}
              </label>
              <textarea
                value={episodeData.description}
                onChange={(e) =>
                  setEpisodeData({
                    ...episodeData,
                    description: e.target.value,
                  })
                }
                rows="3"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('admin.duration')}
              </label>
              <input
                type="number"
                value={episodeData.duration}
                onChange={(e) =>
                  setEpisodeData({
                    ...episodeData,
                    duration: parseInt(e.target.value),
                  })
                }
                placeholder={t('admin.duration_placeholder')}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('admin.video_quality')}
              </label>
              <select
                value={episodeData.videoQuality}
                onChange={(e) =>
                  setEpisodeData({
                    ...episodeData,
                    videoQuality: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="360p">360p</option>
                <option value="480p">480p</option>
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
                <option value="4k">4K</option>
              </select>
            </div>

            {/* Toggle Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('admin.video_source')}
              </label>
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadType("url")}
                  className={`flex-1 py-2 rounded-lg ${uploadType === "url" ? "bg-red-600" : "bg-gray-700"}`}
                >
                  {t('admin.video_url')}
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType("file")}
                  className={`flex-1 py-2 rounded-lg ${uploadType === "file" ? "bg-red-600" : "bg-gray-700"}`}
                >
                  {t('admin.upload_file')}
                </button>
              </div>

              {uploadType === "url" ? (
                <input
                  type="url"
                  value={episodeData.videoUrl}
                  onChange={(e) =>
                    setEpisodeData({ ...episodeData, videoUrl: e.target.value })
                  }
                  placeholder="https://example.com/video.mp4 or YouTube link"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  required
                />
              ) : (
                <div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('admin.file_requirements')}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? t('admin.adding') : t('admin.add_episode_button')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEpisode;