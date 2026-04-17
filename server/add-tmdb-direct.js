import mongoose from "mongoose";
import dotenv from "dotenv";
import Title from "./src/models/Title.model.js";

dotenv.config();

// Используем изображения из разных надежных источников
const workingPosters = {
  "Squid Game":
    "https://www.themoviedb.org/t/p/w500/4xy4lR2nJgQ4GPwNyHhqTaIrFjG.jpg",
  "Crash Landing on You":
    "https://www.themoviedb.org/t/p/w500/4yYVB0IAI1uUzBpZrPZvY9V2m7K.jpg",
  "Jujutsu Kaisen":
    "https://www.themoviedb.org/t/p/w500/7qpyuqRKBpGJbB6y8WpE5xLtU4k.jpg",
  "Attack on Titan":
    "https://www.themoviedb.org/t/p/w500/8HpiKo4v5YHmBZz8jK7nZk1xXo7.jpg",
  "My Demon":
    "https://www.themoviedb.org/t/p/w500/4xy4lR2nJgQ4GPwNyHhqTaIrFjG.jpg",
  "Demon Slayer":
    "https://www.themoviedb.org/t/p/w500/fWVSwgjpT2D78VUh6X8UBd2rorW.jpg",
  "One Piece":
    "https://www.themoviedb.org/t/p/w500/8HpiKo4v5YHmBZz8jK7nZk1xXo7.jpg",
  "The Glory":
    "https://www.themoviedb.org/t/p/w500/4xy4lR2nJgQ4GPwNyHhqTaIrFjG.jpg",
  "Vinland Saga":
    "https://www.themoviedb.org/t/p/w500/7qpyuqRKBpGJbB6y8WpE5xLtU4k.jpg",
};

const updatePosters = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    let updated = 0;

    for (const [titleName, posterUrl] of Object.entries(workingPosters)) {
      const result = await Title.findOneAndUpdate(
        { title: titleName },
        { $set: { "poster.url": posterUrl } },
        { new: true },
      );

      if (result) {
        console.log(`✅ Updated: ${titleName}`);
        updated++;
      } else {
        console.log(`❌ Not found: ${titleName}`);
      }
    }

    console.log(`\n✅ Updated ${updated} titles`);

    // Проверяем результат
    const titles = await Title.find({}, "title poster.url");
    console.log("\n📺 Current posters:");
    titles.forEach((t) => {
      console.log(`   ${t.title}: ${t.poster?.url}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

updatePosters();
