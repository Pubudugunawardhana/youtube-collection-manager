const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: 'Folder',
  }
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);
