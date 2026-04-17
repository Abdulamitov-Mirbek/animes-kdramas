import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Title from './src/models/Title.model.js';
import Episode from './src/models/Episode.model.js';

dotenv.config();

const fixEpisodes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Получаем все тайтлы
    const titles = await Title.find({});
    console.log('Available titles:');
    titles.forEach(t => {
      console.log(`   ${t.title}: ${t._id}`);
    });
    console.log();

    // Создаем маппинг названий на ID
    const titleMap = {
      'Squid Game': '69c2268fe035c9f4002cfe82',
      'Crash Landing on You': '69c2268fe035c9f4002cfe84',
      'Jujutsu Kaisen': '69c2268fe035c9f4002cfe83',
      'Attack on Titan': '69c2268fe035c9f4002cfe85',
      'One Piece': '69c26ac99d999d76ac8eeb0e'
    };

    // Получаем все эпизоды
    const episodes = await Episode.find({});
    console.log(`Found ${episodes.length} episodes\n`);

    let updated = 0;
    let deleted = 0;

    // Обновляем или удаляем эпизоды с неправильными ID
    for (const episode of episodes) {
      const titleIdStr = episode.titleId.toString();
      
      // Проверяем, существует ли тайтл с таким ID
      const existingTitle = await Title.findById(titleIdStr);
      
      if (!existingTitle) {
        console.log(`❌ Episode ${episode.number} has invalid titleId: ${titleIdStr}`);
        
        // Пытаемся определить правильный тайтл по названию из эпизода
        let correctTitleId = null;
        
        if (episode.title.includes('Squid Game')) {
          correctTitleId = titleMap['Squid Game'];
        } else if (episode.title.includes('Crash Landing')) {
          correctTitleId = titleMap['Crash Landing on You'];
        } else if (episode.title.includes('Jujutsu')) {
          correctTitleId = titleMap['Jujutsu Kaisen'];
        } else if (episode.title.includes('Attack on Titan')) {
          correctTitleId = titleMap['Attack on Titan'];
        } else if (episode.title.includes('One Piece')) {
          correctTitleId = titleMap['One Piece'];
        }
        
        if (correctTitleId) {
          episode.titleId = correctTitleId;
          await episode.save();
          console.log(`   ✅ Fixed: Episode ${episode.number} now linked to correct title`);
          updated++;
        } else {
          // Удаляем эпизод, если не можем определить
          await Episode.deleteOne({ _id: episode._id });
          console.log(`   🗑️ Deleted orphaned episode: ${episode.title}`);
          deleted++;
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Updated: ${updated} episodes`);
    console.log(`   Deleted: ${deleted} orphaned episodes`);

    // Теперь связываем эпизоды с тайтлами
    const allEpisodes = await Episode.find({ isActive: true });
    const episodesByTitle = {};
    
    allEpisodes.forEach(ep => {
      const titleId = ep.titleId.toString();
      if (!episodesByTitle[titleId]) {
        episodesByTitle[titleId] = [];
      }
      episodesByTitle[titleId].push(ep._id);
    });

    // Обновляем каждый тайтл
    for (const [titleId, episodeIds] of Object.entries(episodesByTitle)) {
      const title = await Title.findById(titleId);
      if (title) {
        title.episodes = episodeIds;
        title.totalEpisodes = episodeIds.length;
        await title.save();
        console.log(`✅ Linked ${episodeIds.length} episodes to ${title.title}`);
      }
    }

    // Проверяем результат
    const titlesWithEpisodes = await Title.find({}, 'title totalEpisodes episodes');
    console.log('\n📺 Final result:');
    titlesWithEpisodes.forEach(t => {
      console.log(`   ${t.title}: ${t.totalEpisodes} episodes (${t.episodes.length} linked)`);
    });

    console.log('\n✨ Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixEpisodes();