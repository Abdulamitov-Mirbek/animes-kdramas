import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Title from './src/models/Title.model.js';
import Episode from './src/models/Episode.model.js';

dotenv.config();

const testTitles = [
  {
    title: "Squid Game",
    originalTitle: "오징어 게임",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
    type: "drama",
    status: "completed",
    year: 2021,
    country: "South Korea",
    genres: ["Action", "Drama", "Thriller"],
    poster: {
      url: "https://image.tmdb.org/t/p/w500/4xy4lR2nJgQ4GPwNyHhqTaIrFjG.jpg",
      publicId: "squid-game"
    },
    totalEpisodes: 9,
    rating: { average: 8.9, count: 10000 }
  },
  {
    title: "Jujutsu Kaisen",
    originalTitle: "呪術廻戦",
    description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman school to be able to locate the demon's other body parts and thus exorcise himself.",
    type: "anime",
    status: "ongoing",
    year: 2020,
    country: "Japan",
    genres: ["Action", "Fantasy", "Supernatural"],
    poster: {
      url: "https://image.tmdb.org/t/p/w500/7qpyuqRKBpGJbB6y8WpE5xLtU4k.jpg",
      publicId: "jujutsu-kaisen"
    },
    totalEpisodes: 24,
    rating: { average: 9.1, count: 15000 }
  },
  {
    title: "Crash Landing on You",
    originalTitle: "사랑의 불시착",
    description: "A paragliding mishap drops a South Korean heiress in North Korea -- and into the life of an army officer, who decides to help her hide.",
    type: "drama",
    status: "completed",
    year: 2019,
    country: "South Korea",
    genres: ["Romance", "Comedy", "Drama"],
    poster: {
      url: "https://image.tmdb.org/t/p/w500/4yYVB0IAI1uUzBpZrPZvY9V2m7K.jpg",
      publicId: "crash-landing"
    },
    totalEpisodes: 16,
    rating: { average: 8.7, count: 8000 }
  },
  {
    title: "Attack on Titan",
    originalTitle: "進撃の巨人",
    description: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
    type: "anime",
    status: "completed",
    year: 2013,
    country: "Japan",
    genres: ["Action", "Drama", "Fantasy"],
    poster: {
      url: "https://image.tmdb.org/t/p/w500/8HpiKo4v5YHmBZz8jK7nZk1xXo7.jpg",
      publicId: "attack-on-titan"
    },
    totalEpisodes: 87,
    rating: { average: 9.2, count: 20000 }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing titles
    await Title.deleteMany({});
    console.log('Cleared existing titles');
    
    // Insert test titles
    const titles = await Title.insertMany(testTitles);
    console.log(`Added ${titles.length} test titles`);
    
    // Create test episodes for each title
    for (const title of titles) {
      const episodes = [];
      for (let i = 1; i <= Math.min(title.totalEpisodes, 3); i++) {
        episodes.push({
          titleId: title._id,
          number: i,
          title: `Episode ${i}`,
          description: `Watch ${title.title} Episode ${i}`,
          duration: 1800, // 30 minutes
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Sample video
          views: Math.floor(Math.random() * 1000)
        });
      }
      await Episode.insertMany(episodes);
      console.log(`Added ${episodes.length} episodes for ${title.title}`);
    }
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();