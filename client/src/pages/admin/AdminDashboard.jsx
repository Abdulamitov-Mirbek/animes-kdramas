import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("add-title");
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState([]);

  // Form states for adding title
  const [titleForm, setTitleForm] = useState({
    title: "",
    originalTitle: "",
    description: "",
    type: "drama",
    year: new Date().getFullYear(),
    country: "South Korea",
    genres: "",
    status: "ongoing",
  });

  const [posterFile, setPosterFile] = useState(null);

  // Form states for adding episode
  const [episodeForm, setEpisodeForm] = useState({
    titleId: "",
    number: 1,
    title: "",
    description: "",
    duration: 0,
    videoUrl: "",
    videoQuality: "720p",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [useUrl, setUseUrl] = useState(true);

  // Load titles for selection
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await api.get("/titles");
        setTitles(response.data.titles);
      } catch (error) {
        console.error("Failed to fetch titles:", error);
      }
    };
    fetchTitles();
  }, []);

  const handleTitleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", titleForm.title);
    formData.append("originalTitle", titleForm.originalTitle);
    formData.append("description", titleForm.description);
    formData.append("type", titleForm.type);
    formData.append("year", titleForm.year);
    formData.append("country", titleForm.country);
    formData.append(
      "genres",
      titleForm.genres.split(",").map((g) => g.trim()),
    );
    formData.append("status", titleForm.status);

    if (posterFile) {
      formData.append("poster", posterFile);
    }

    try {
      await api.post("/admin/titles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(t('admin.title_added_success'));
      setTitleForm({
        title: "",
        originalTitle: "",
        description: "",
        type: "drama",
        year: new Date().getFullYear(),
        country: "South Korea",
        genres: "",
        status: "ongoing",
      });
      setPosterFile(null);
      // Refresh titles list
      const response = await api.get("/titles");
      setTitles(response.data.titles);
    } catch (error) {
      toast.error(error.response?.data?.message || t('admin.add_title_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEpisodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const episodeData = {
      number: episodeForm.number,
      title: episodeForm.title,
      description: episodeForm.description,
      duration: episodeForm.duration,
      videoUrl: episodeForm.videoUrl,
      videoQuality: episodeForm.videoQuality,
    };

    try {
      await api.post(`/titles/${episodeForm.titleId}/episodes`, episodeData);
      toast.success(t('admin.episode_added_success'));
      setEpisodeForm({
        titleId: "",
        number: episodeForm.number + 1,
        title: "",
        description: "",
        duration: 0,
        videoUrl: "",
        videoQuality: "720p",
      });
      setVideoFile(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || t('admin.add_episode_error'));
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">
            {t('admin.access_denied')}
          </h1>
          <p className="text-gray-400">
            {t('admin.no_permission')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gradient mb-8">
          {t('admin.dashboard_title')}
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab("add-title")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "add-title"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t('admin.add_title_tab')}
          </button>
          <button
            onClick={() => setActiveTab("add-episode")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "add-episode"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t('admin.add_episode_tab')}
          </button>
        </div>

        {/* Add Title Form */}
        {activeTab === "add-title" && (
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t('admin.add_new_title')}</h2>
            <form onSubmit={handleTitleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.title')}</label>
                <input
                  type="text"
                  value={titleForm.title}
                  onChange={(e) =>
                    setTitleForm({ ...titleForm, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.original_title')}</label>
                <input
                  type="text"
                  value={titleForm.originalTitle}
                  onChange={(e) =>
                    setTitleForm({
                      ...titleForm,
                      originalTitle: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.description')}</label>
                <textarea
                  value={titleForm.description}
                  onChange={(e) =>
                    setTitleForm({ ...titleForm, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('admin.type')}</label>
                  <select
                    value={titleForm.type}
                    onChange={(e) =>
                      setTitleForm({ ...titleForm, type: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  >
                    <option value="drama">{t('admin.korean_drama')}</option>
                    <option value="anime">{t('admin.anime')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('admin.year')}</label>
                  <input
                    type="number"
                    value={titleForm.year}
                    onChange={(e) =>
                      setTitleForm({ ...titleForm, year: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('admin.country')}</label>
                  <input
                    type="text"
                    value={titleForm.country}
                    onChange={(e) =>
                      setTitleForm({ ...titleForm, country: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('admin.status')}</label>
                  <select
                    value={titleForm.status}
                    onChange={(e) =>
                      setTitleForm({ ...titleForm, status: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  >
                    <option value="ongoing">{t('admin.ongoing')}</option>
                    <option value="completed">{t('admin.completed')}</option>
                    <option value="hiatus">{t('admin.hiatus')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.genres_comma')}</label>
                <input
                  type="text"
                  value={titleForm.genres}
                  onChange={(e) =>
                    setTitleForm({ ...titleForm, genres: e.target.value })
                  }
                  placeholder={t('admin.genres_placeholder')}
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.poster_image')}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPosterFile(e.target.files[0])}
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
              >
                {loading ? t('admin.adding_title') : t('admin.add_title_button')}
              </button>
            </form>
          </div>
        )}

        {/* Add Episode Form */}
        {activeTab === "add-episode" && (
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t('admin.add_episode')}</h2>
            <form onSubmit={handleEpisodeSubmit} className="space-y-4">
              {/* Select Title from dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.select_title')}</label>
                <select
                  value={episodeForm.titleId}
                  onChange={(e) =>
                    setEpisodeForm({ ...episodeForm, titleId: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  required
                >
                  <option value="">{t('admin.select_title_placeholder')}</option>
                  {titles.map((title) => (
                    <option key={title._id} value={title._id}>
                      {title.title} ({title.type}) - {title.totalEpisodes} {t('admin.eps')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('admin.episode_number')}</label>
                  <input
                    type="number"
                    value={episodeForm.number}
                    onChange={(e) =>
                      setEpisodeForm({
                        ...episodeForm,
                        number: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('admin.duration_seconds')}</label>
                  <input
                    type="number"
                    value={episodeForm.duration}
                    onChange={(e) =>
                      setEpisodeForm({
                        ...episodeForm,
                        duration: parseInt(e.target.value),
                      })
                    }
                    placeholder={t('admin.duration_placeholder')}
                    className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.episode_title')}</label>
                <input
                  type="text"
                  value={episodeForm.title}
                  onChange={(e) =>
                    setEpisodeForm({ ...episodeForm, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.description')}</label>
                <textarea
                  value={episodeForm.description}
                  onChange={(e) =>
                    setEpisodeForm({
                      ...episodeForm,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.video_quality')}</label>
                <select
                  value={episodeForm.videoQuality}
                  onChange={(e) =>
                    setEpisodeForm({
                      ...episodeForm,
                      videoQuality: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                >
                  <option value="360p">360p</option>
                  <option value="480p">480p</option>
                  <option value="720p">720p (HD)</option>
                  <option value="1080p">1080p (Full HD)</option>
                  <option value="4k">4K</option>
                </select>
              </div>

              {/* Video URL Field */}
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.video_url')}</label>
                <input
                  type="url"
                  value={episodeForm.videoUrl}
                  onChange={(e) =>
                    setEpisodeForm({ ...episodeForm, videoUrl: e.target.value })
                  }
                  placeholder="https://example.com/video.mp4 or YouTube link"
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 <strong>{t('admin.test_video')}:</strong>{" "}
                  https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  📺 <strong>{t('admin.youtube')}:</strong>{" "}
                  https://www.youtube.com/watch?v=VIDEO_ID
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  🎬 <strong>{t('admin.local_file')}:</strong> /uploads/videos/your-video.mp4
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
              >
                {loading ? t('admin.adding_episode') : t('admin.add_episode_button')}
              </button>
            </form>

            {/* Quick Tips */}
            <div className="mt-8 p-4 bg-dark-200/50 rounded-lg">
              <h3 className="text-sm font-semibold text-white mb-2">
                📌 {t('admin.quick_tips')}:
              </h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• <strong>{t('admin.test_video_tip')}</strong> {t('admin.test_video_tip_desc')}</li>
                <li>• <strong>{t('admin.youtube_tip')}</strong> {t('admin.youtube_tip_desc')}</li>
                <li>• <strong>{t('admin.local_video_tip')}</strong> {t('admin.local_video_tip_desc')}</li>
                <li>• <strong>{t('admin.duration_tip')}</strong> {t('admin.duration_tip_desc')}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;