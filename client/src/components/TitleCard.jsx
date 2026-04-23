import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Film, Tv } from "lucide-react";

const TitleCard = ({ title }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  // Fix TMDB URL if needed
  const getCorrectImageUrl = (url) => {
    if (!url) return null;
    if (url.includes("www.themoviedb.org")) {
      return url.replace("www.themoviedb.org", "image.tmdb.org");
    }
    return url;
  };

  const posterUrl = getCorrectImageUrl(title.poster?.url);

  // Generate a consistent color based on title name
  const getColorFromTitle = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const bgColor = getColorFromTitle(title.title);

  return (
    <Link to={`/title/${title._id}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-gray-800 aspect-[2/3]">
        {imgLoading && !imgError && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {imgError || !posterUrl ? (
          // CSS-only fallback - no external URLs needed
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
            style={{ backgroundColor: bgColor }}
          >
            {title.type === "drama" ? (
              <Film className="w-12 h-12 text-white mb-2" />
            ) : (
              <Tv className="w-12 h-12 text-white mb-2" />
            )}
            <h3 className="text-white font-bold text-sm line-clamp-2">
              {title.title}
            </h3>
            <p className="text-white/80 text-xs mt-1">{title.year}</p>
          </div>
        ) : (
          <img
            src={posterUrl}
            alt={title.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imgLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImgLoading(false)}
            onError={(e) => {
              console.error(
                `Failed to load image for ${title.title}:`,
                posterUrl,
              );
              setImgError(true);
              setImgLoading(false);
            }}
          />
        )}

        {/* Rating badge */}
        {title.rating?.average > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 text-xs font-semibold text-yellow-500">
            ★ {title.rating.average.toFixed(1)}
          </div>
        )}

        {/* Type badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1 text-xs">
          {title.type === "drama" ? "📺 Drama" : "🎌 Anime"}
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-white font-medium text-sm group-hover:text-red-500 transition line-clamp-1">
          {title.title}
        </h3>
        <p className="text-gray-400 text-xs">
          {title.year} • {title.totalEpisodes || 0} eps
        </p>
      </div>
    </Link>
  );
};

export default TitleCard;
