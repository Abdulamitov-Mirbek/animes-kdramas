import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Title from './src/models/Title.model.js';

dotenv.config();

const fixImageUrls = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const titles = await Title.find({});
    let fixed = 0;
    
    for (const title of titles) {
      let needsUpdate = false;
      let newUrl = title.poster?.url;
      
      if (newUrl && newUrl.includes('www.themoviedb.org')) {
        newUrl = newUrl.replace('www.themoviedb.org', 'image.tmdb.org');
        needsUpdate = true;
      }
      
      // Also check for Amazon URLs (they often 404)
      if (newUrl && newUrl.includes('amazon.com')) {
        // Replace with placeholder or TMDB image
        newUrl = `https://image.tmdb.org/t/p/w500/placeholder.jpg`;
        needsUpdate = true;
      }
      
      if (needsUpdate && newUrl) {
        title.poster.url = newUrl;
        await title.save();
        fixed++;
        console.log(`✅ Fixed: ${title.title} - ${newUrl}`);
      }
    }
    
    console.log(`\n✨ Fixed ${fixed} titles!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixImageUrls();