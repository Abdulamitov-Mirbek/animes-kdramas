import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Title from './src/models/Title.model.js';

dotenv.config();

const titlesData = [
  {
    title: "Squid Game",
    originalTitle: "오징어 게임",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games.",
    type: "drama",
    status: "completed",
    year: 2021,
    country: "South Korea",
    genres: ["Action", "Drama", "Thriller"],
    poster: { url: "https://m.media-amazon.com/images/M/MV5BYWYzZjk5Y2QtYzQzNy00N2IxLTkzNTAtMjI3NzZlYzJkYzFhXkEyXkFqcGc@._V1_.jpg" },
    totalEpisodes: 9,
    rating: { average: 8.9, count: 10000 }
  },
  {
    title: "Crash Landing on You",
    originalTitle: "사랑의 불시착",
    description: "A paragliding mishap drops a South Korean heiress in North Korea.",
    type: "drama",
    status: "completed",
    year: 2019,
    country: "South Korea",
    genres: ["Romance", "Comedy", "Drama"],
    poster: { url: "https://m.media-amazon.com/images/M/MV5BNjMyMDBjYTgtNjUzMC00MTUwLTk5NmQtNDQ1MTQ1YzU2MjVkXkEyXkFqcGc@._V1_.jpg" },
    totalEpisodes: 16,
    rating: { average: 8.7, count: 8000 }
  },
  {
    title: "Jujutsu Kaisen",
    originalTitle: "呪術廻戦",
    description: "A boy swallows a cursed talisman and becomes cursed himself.",
    type: "anime",
    status: "ongoing",
    year: 2020,
    country: "Japan",
    genres: ["Action", "Fantasy", "Supernatural"],
    poster: { url: "https://m.media-amazon.com/images/M/MV5BNzQyYzU3Y2MtOWYwZi00Y2Q4LWE1NTQtMmFhNzFhZjYzZmQ5XkEyXkFqcGc@._V1_.jpg" },
    totalEpisodes: 24,
    rating: { average: 9.1, count: 15000 }
  },
  {
    title: "Attack on Titan",
    originalTitle: "進撃の巨人",
    description: "Young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.",
    type: "anime",
    status: "completed",
    year: 2013,
    country: "Japan",
    genres: ["Action", "Drama", "Fantasy"],
    poster: { url: "https://m.media-amazon.com/images/M/MV5BNDFjYTIxMjctYTQ2ZC00OGQ4LWE3OGYtNDdiMzNiNDZlM2ZmXkEyXkFqcGc@._V1_.jpg" },
    totalEpisodes: 87,
    rating: { average: 9.2, count: 20000 }
  }
];

const insertTitles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Optional: Clear existing titles
    // await Title.deleteMany({});
    // console.log('Cleared existing titles');
    
    let added = 0;
    let skipped = 0;
    
    for (const titleData of titlesData) {
      const existing = await Title.findOne({ title: titleData.title });
      if (!existing) {
        const title = new Title(titleData);
        await title.save();
        console.log(`✅ Added: ${titleData.title}`);
        added++;
      } else {
        console.log(`⏭️ Skipped: ${titleData.title} (already exists)`);
        skipped++;
      }
    }
    
    console.log(`\n✨ Done! Added ${added} titles, skipped ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

insertTitles();