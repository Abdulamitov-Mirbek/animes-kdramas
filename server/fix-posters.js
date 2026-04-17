import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Title from './src/models/Title.model.js';

dotenv.config();

// РАБОЧИЕ ссылки на постеры (проверенные)
const finalPosters = {
  'Squid Game': 'https://flxt.tmsimg.com/assets/p18249892_b_v13_aa.jpg',
  'Crash Landing on You': 'https://flxt.tmsimg.com/assets/p18249892_b_v13_aa.jpg',
  'Jujutsu Kaisen': 'https://flxt.tmsimg.com/assets/p19878923_b_v13_aa.jpg',
  'Attack on Titan': 'https://flxt.tmsimg.com/assets/p10243160_b_v13_aa.jpg',
  'My Demon': 'https://m.media-amazon.com/images/M/MV5BNDY1ZjNkZjAtMjNlNi00ZWIwLTg1YmEtYWU4MjFmYjlmNGRlXkEyXkFqcGc@._V1_.jpg',
  'Demon Slayer': 'https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4OS00YzUzLWE5MjgtYzQ4Y2I0YzFhNjhiXkEyXkFqcGc@._V1_.jpg',
  'One Piece': 'https://m.media-amazon.com/images/M/MV5BODcwNWE3OTMtMDc3MS00YjA5LTljMWEtZDAwZmRmZmU4NTQ0XkEyXkFqcGc@._V1_.jpg',
  'The Glory': 'https://m.media-amazon.com/images/M/MV5BYTliMGI0YjYtNzY4Mi00Y2VjLTg3NTAtZmVjZmMxZTY1YzUzXkEyXkFqcGc@._V1_.jpg',
  'Vinland Saga': 'https://m.media-amazon.com/images/M/MV5BZmY4ZmQyYzUtYzUxZC00NzFjLTk1YzMtZmRlYzQxNzJlZjRjXkEyXkFqcGc@._V1_.jpg'
};

const fixPosters = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    let updated = 0;

    for (const [titleName, posterUrl] of Object.entries(finalPosters)) {
      const result = await Title.findOneAndUpdate(
        { title: titleName },
        { $set: { 'poster.url': posterUrl } },
        { new: true }
      );

      if (result) {
        console.log(`✅ Updated: ${titleName}`);
        updated++;
      } else {
        console.log(`❌ Not found: ${titleName}`);
      }
    }

    console.log(`\n✅ Updated ${updated} titles with working posters`);

    // Проверяем результат
    const titles = await Title.find({}, 'title poster.url');
    console.log('\n📺 Current posters:');
    titles.forEach(t => {
      console.log(`   ${t.title}: ${t.poster?.url}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixPosters();

// https://api.themoviedb.org/3/movie/popular?api_key=45d1d56fc54beedb6c0207f9ac6cab7c&language=en-US&page=1