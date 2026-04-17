import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Episode from './src/models/Episode.model.js';

dotenv.config();

const fixVideoUrl = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Рабочий URL видео
    const workingVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

    // Обновляем все эпизоды
    const result = await Episode.updateMany(
      {}, 
      { $set: { videoUrl: workingVideoUrl } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} episodes`);
    console.log(`🎬 New video URL: ${workingVideoUrl}`);

    // Проверяем
    const sample = await Episode.findOne();
    console.log(`\n📺 Sample episode: ${sample?.title} - ${sample?.videoUrl}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixVideoUrl();