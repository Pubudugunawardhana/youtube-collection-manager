const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  youtubeId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  duration: {
    type: String,
    default: '00:00'
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['To Watch', 'Watching', 'Watched'],
    default: 'To Watch',
  },
  order: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
