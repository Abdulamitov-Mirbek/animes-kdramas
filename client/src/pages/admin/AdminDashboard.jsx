import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
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
    videoUrl: "", // Добавлено поле для URL
    videoQuality: "720p", // Добавлено качество видео
  });

  const [videoFile, setVideoFile] = useState(null);
  const [useUrl, setUseUrl] = useState(true); // По умолчанию используем URL

  // Загружаем список тайтлов для выбора
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
      toast.success("Title added successfully!");
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
      // Обновляем список тайтлов
      const response = await api.get("/titles");
      setTitles(response.data.titles);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add title");
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
      toast.success("Episode added successfully!");
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
      toast.error(error.response?.data?.message || "Failed to add episode");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gradient mb-8">
          Admin Dashboard
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
            Add Title
          </button>
          <button
            onClick={() => setActiveTab("add-episode")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "add-episode"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Add Episode
          </button>
        </div>

        {/* Add Title Form */}
        {activeTab === "add-title" && (
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Title</h2>
            <form onSubmit={handleTitleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
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
                <label className="block text-sm font-medium mb-2">
                  Original Title
                </label>
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
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
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
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={titleForm.type}
                    onChange={(e) =>
                      setTitleForm({ ...titleForm, type: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  >
                    <option value="drama">Korean Drama</option>
                    <option value="anime">Anime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
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
                  <label className="block text-sm font-medium mb-2">
                    Country
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={titleForm.status}
                    onChange={(e) =>
                      setTitleForm({ ...titleForm, status: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="hiatus">Hiatus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Genres (comma separated)
                </label>
                <input
                  type="text"
                  value={titleForm.genres}
                  onChange={(e) =>
                    setTitleForm({ ...titleForm, genres: e.target.value })
                  }
                  placeholder="Action, Romance, Comedy, Drama"
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Poster Image
                </label>
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
                {loading ? "Adding..." : "Add Title"}
              </button>
            </form>
          </div>
        )}

        {/* Add Episode Form */}
        {activeTab === "add-episode" && (
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Add Episode</h2>
            <form onSubmit={handleEpisodeSubmit} className="space-y-4">
              {/* Select Title from dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Title
                </label>
                <select
                  value={episodeForm.titleId}
                  onChange={(e) =>
                    setEpisodeForm({ ...episodeForm, titleId: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  required
                >
                  <option value="">Select a title...</option>
                  {titles.map((title) => (
                    <option key={title._id} value={title._id}>
                      {title.title} ({title.type}) - {title.totalEpisodes} eps
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Episode Number
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={episodeForm.duration}
                    onChange={(e) =>
                      setEpisodeForm({
                        ...episodeForm,
                        duration: parseInt(e.target.value),
                      })
                    }
                    placeholder="1800 = 30 min"
                    className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Episode Title
                </label>
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
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
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
                <label className="block text-sm font-medium mb-2">
                  Video Quality
                </label>
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
                <label className="block text-sm font-medium mb-2">
                  Video URL
                </label>
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
                  💡 <strong>Test video URL:</strong>{" "}
                  https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  📺 <strong>YouTube:</strong>{" "}
                  https://www.youtube.com/watch?v=VIDEO_ID
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  🎬 <strong>Local file:</strong> /uploads/videos/your-video.mp4
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Episode"}
              </button>
            </form>

            {/* Quick Tips */}
            <div className="mt-8 p-4 bg-dark-200/50 rounded-lg">
              <h3 className="text-sm font-semibold text-white mb-2">
                📌 Quick Tips:
              </h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>
                  • <strong>Test video:</strong> Use the sample URL above to
                  test
                </li>
                <li>
                  • <strong>YouTube:</strong> Paste any YouTube link - it will
                  work automatically
                </li>
                <li>
                  • <strong>Local videos:</strong> Put files in
                  server/uploads/videos/ folder
                </li>
                <li>
                  • <strong>Duration:</strong> 1800 seconds = 30 minutes, 3600 =
                  1 hour
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
