import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  titleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Title',
    required: true,
  },
  episodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Episode',
    required: true,
  },
  progress: {
    type: Number, // seconds watched
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  lastWatched: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
historySchema.index({ userId: 1, lastWatched: -1 });
historySchema.index({ userId: 1, titleId: 1 }, { unique: true });

const History = mongoose.model('History', historySchema);
export default History;