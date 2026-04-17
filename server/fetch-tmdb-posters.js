import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Title from "./src/models/Title.model.js";

dotenv.config();

// Ваш TMDB API ключ
const TMDB_API_KEY = "45d1d56fc54beedb6c0207f9ac6cab7c";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Соответствие названий с поисковыми запросами
const searchQueries = {
  "Squid Game": { query: "Squid Game", type: "tv" },
  "Crash Landing on You": { query: "Crash Landing on You", type: "tv" },
  "Jujutsu Kaisen": { query: "Jujutsu Kaisen", type: "tv" },
  "Attack on Titan": { query: "Attack on Titan", type: "tv" },
  "My Demon": { query: "My Demon", type: "tv" },
  "Demon Slayer": { query: "Demon Slayer", type: "tv" },
  "One Piece": { query: "One Piece", type: "tv" },
  "The Glory": { query: "The Glory", type: "tv" },
  "Vinland Saga": { query: "Vinland Saga", type: "tv" },
};

// Поиск в TMDB
const searchTMDB = async (query, type) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/${type}`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
        language: "ru-RU",
        page: 1,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    }
    return null;
  } catch (error) {
    console.error(`Error searching for ${query}:`, error.message);
    return null;
  }
};

const fetchAndUpdatePosters = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    let updated = 0;
    let notFound = [];

    for (const [titleName, { query, type }] of Object.entries(searchQueries)) {
      console.log(`Searching for: ${titleName}...`);

      const result = await searchTMDB(query, type);

      if (result && result.poster_path) {
        const posterUrl = `https://image.tmdb.org/t/p/w500${result.poster_path}`;
        const backdropUrl = result.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${result.backdrop_path}`
          : null;

        const updateResult = await Title.findOneAndUpdate(
          { title: titleName },
          {
            $set: {
              "poster.url": posterUrl,
              "poster.tmdb_id": result.id,
              "backdrop.url": backdropUrl,
              // Обновляем рейтинг из TMDB
              "rating.average": result.vote_average,
              "rating.count": result.vote_count,
            },
          },
          { new: true },
        );

        if (updateResult) {
          console.log(`✅ Updated: ${titleName}`);
          console.log(`   Poster: ${posterUrl}`);
          console.log(
            `   Rating: ${result.vote_average} (${result.vote_count} votes)`,
          );
          updated++;
        }
      } else {
        console.log(`❌ Not found in TMDB: ${titleName}`);
        notFound.push(titleName);
      }

      // Задержка чтобы не перегружать API
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated: ${updated} titles`);
    if (notFound.length > 0) {
      console.log(`   ❌ Not found: ${notFound.length} titles`);
      notFound.forEach((title) => console.log(`      - ${title}`));
    }

    // Проверяем результат
    const titles = await Title.find({}, "title poster.url rating.average");
    console.log("\n📺 Updated posters:");
    titles.forEach((t) => {
      console.log(
        `   ${t.title}: ${t.poster?.url || "NO POSTER"} (⭐ ${t.rating?.average || "N/A"})`,
      );
    });

    console.log("\n✨ Done! Restart your server and refresh the page.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

fetchAndUpdatePosters();
