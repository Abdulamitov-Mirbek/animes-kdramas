import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import RatingCircle from "./RatingCircle";

const TitleCard = ({ title }) => {
  const posterUrl = title.poster?.url;
  const rating = title.rating?.average || 0;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative cursor-pointer"
    >
      <Link to={`/title/${title._id}`}>
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl">
          <div className="aspect-[2/3] overflow-hidden">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title.title)}`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center p-4">
                  <div className="text-5xl mb-3">
                    {title.type === "drama" ? "🎬" : "🎌"}
                  </div>
                  <h3 className="text-white font-bold text-lg">
                    {title.title}
                  </h3>
                </div>
              </div>
            )}
          </div>

          {/* Rating Circle */}
          {rating > 0 && (
            <div className="absolute bottom-2 right-2">
              <RatingCircle rating={rating} size={50} />
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button className="w-full py-2 bg-red-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
                <Play className="w-4 h-4" />
                Watch Now
              </button>
            </div>
          </div>

          {/* Type Badge */}
          <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-xs font-semibold text-white">
              {title.type === "drama" ? "DRAMA" : "ANIME"}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-red-500 transition-colors">
            {title.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
            <span>{title.year}</span>
            <span>{title.totalEpisodes} eps</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TitleCard;
