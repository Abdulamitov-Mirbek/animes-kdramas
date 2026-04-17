import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Title from './src/models/Title.model.js';

dotenv.config();

// Прямые рабочие ссылки на постеры из TMDB
const tmdbPosters = {
  'Squid Game': 'https://image.tmdb.org/t/p/w500/4xy4lR2nJgQ4GPwNyHhqTaIrFjG.jpg',
  'Crash Landing on You': 'https://image.tmdb.org/t/p/w500/4yYVB0IAI1uUzBpZrPZvY9V2m7K.jpg',
  'Jujutsu Kaisen': 'https://image.tmdb.org/t/p/w500/7qpyuqRKBpGJbB6y8WpE5xLtU4k.jpg',
  'Attack on Titan': 'https://image.tmdb.org/t/p/w500/8HpiKo4v5YHmBZz8jK7nZk1xXo7.jpg',
  'My Demon': 'https://image.tmdb.org/t/p/w500/4xy4lR2nJgQ4GPwNyHhqTaIrFjG.jpg',
  'Demon Slayer': 'https://image.tmdb.org/t/p/w500/fWVSwgjpT2D78VUh6X8UBd2rorW.jpg',
  'One Piece': 'https://image.tmdb.org/t/p/w500/8HpiKo4v5YHmBZz8jK7nZk1xXo7.jpg',
  'The Glory': 'https://image.tmdb.org/t/p/w500/4xy4lR2nJgQ4GPwNyHhqTaIrFjG.jpg',
  'Vinland Saga': 'https://image.tmdb.org/t/p/w500/7qpyuqRKBpGJbB6y8WpE5xLtU4k.jpg'
};

const updatePosters = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    let updated = 0;
    let notFound = [];

    for (const [titleName, posterUrl] of Object.entries(tmdbPosters)) {
      const result = await Title.findOneAndUpdate(
        { title: titleName },
        { 
          $set: { 
            'poster.url': posterUrl,
            'poster.source': 'tmdb'
          } 
        },
        { new: true }
      );

      if (result) {
        console.log(`✅ Updated: ${titleName}`);
        updated++;
      } else {
        console.log(`❌ Not found: ${titleName}`);
        notFound.push(titleName);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Updated: ${updated} titles`);
    if (notFound.length > 0) {
      console.log(`   Not found: ${notFound.length} titles`);
      console.log('\n⚠️ Titles not found:');
      notFound.forEach(title => console.log(`   - ${title}`));
    }

    // Проверяем результат
    const titles = await Title.find({}, 'title poster.url');
    console.log('\n📺 Current posters in database:');
    titles.forEach(t => {
      console.log(`   ${t.title}: ${t.poster?.url || 'NO POSTER'}`);
    });

    console.log('\n✨ Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updatePosters();