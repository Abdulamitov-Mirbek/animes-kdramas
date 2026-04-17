import cron from 'node-cron';
import logger from './src/utils/logger.js';
import { processPendingVideos } from './src/services/processors/index.js';
import { updateSearchIndex } from './src/services/search.service.js';

// Запуск каждые 30 минут для обработки видео
cron.schedule('*/30 * * * *', async () => {
  logger.info('Running video processing scheduler');
  try {
    await processPendingVideos();
  } catch (error) {
    logger.error('Scheduler error:', error);
  }
});

// Запуск каждый час для обновления поискового индекса
cron.schedule('0 * * * *', async () => {
  logger.info('Updating search index');
  try {
    await updateSearchIndex();
  } catch (error) {
    logger.error('Search index update error:', error);
  }
});

logger.info('Scheduler started');