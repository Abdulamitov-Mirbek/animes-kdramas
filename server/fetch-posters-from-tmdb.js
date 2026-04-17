import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Title from "./src/models/Title.model.js";

dotenv.config();

// Ваш API ключ TMDB
const TMDB_API_KEY = "45d1d56fc54beedb6c0207f9ac6cab7c";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Соответствие названий с поисковыми запросами
const searchQueries = {
  "Squid Game": "Squid Game",
  "Crash Landing on You": "Crash Landing on You",
  "Jujutsu Kaisen": "Jujutsu Kaisen",
  "Attack on Titan": "Attack on Titan",
  "My Demon": "My Demon",
  "Demon Slayer": "Demon Slayer",
  "One Piece": "One Piece",
  "The Glory": "The Glory",
  "Vinland Saga": "Vinland Saga",
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

    for (const [titleName, searchQuery] of Object.entries(searchQueries)) {
      console.log(`Searching for: ${titleName}...`);

      // Определяем тип (tv series или movie)
      const isTvSeries = [
        "Squid Game",
        "Crash Landing on You",
        "My Demon",
        "The Glory",
      ].includes(titleName);
      const type = isTvSeries ? "tv" : "movie";

      const result = await searchTMDB(searchQuery, type);

      if (result && result.poster_path) {
        const posterUrl = `https://image.tmdb.org/t/p/w500${result.poster_path}`;

        const updateResult = await Title.findOneAndUpdate(
          { title: titleName },
          {
            $set: {
              "poster.url": posterUrl,
              "poster.tmdb_id": result.id,
              "poster.rating": result.vote_average,
              "backdrop.url": result.backdrop_path
                ? `https://image.tmdb.org/t/p/w1280${result.backdrop_path}`
                : null,
            },
          },
          { new: true },
        );

        if (updateResult) {
          console.log(`✅ Updated: ${titleName}`);
          console.log(`   Poster: ${posterUrl}`);
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
    const titles = await Title.find({}, "title poster.url");
    console.log("\n📺 Updated posters in database:");
    titles.forEach((t) => {
      console.log(`   ${t.title}: ${t.poster?.url || "NO POSTER"}`);
    });

    console.log("\n✨ Done! Now restart your server and refresh the page.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

fetchAndUpdatePosters();
