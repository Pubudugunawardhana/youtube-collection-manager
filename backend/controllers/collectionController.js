const mongoose = require('mongoose');
const Collection = require('../models/Collection');
const Video = require('../models/Video');

const createCollection = async (req, res) => {
  try {
    const { name, icon, category } = req.body;
    const collection = new Collection({
      name,
      icon: icon || 'Folder',
      category: category || 'General',
      userId: req.user.id
    });
    await collection.save();
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(collections);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const getCollectionProgress = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const collectionId = new mongoose.Types.ObjectId(req.params.id);

    const progress = await Video.aggregate([
      { $match: { collectionId, userId } },
      { 
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          watchedVideos: { 
            $sum: { $cond: [{ $eq: ["$status", "Watched"] }, 1, 0] } 
          }
        }
      }
    ]);

    if (progress.length === 0) {
      return res.json({ totalVideos: 0, watchedVideos: 0, percentage: 0 });
    }

    const { totalVideos, watchedVideos } = progress[0];
    const percentage = totalVideos === 0 ? 0 : Math.round((watchedVideos / totalVideos) * 100);

    res.json({ totalVideos, watchedVideos, percentage });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    
    // Also delete all videos in this collection
    await Video.deleteMany({ collectionId: req.params.id, userId: req.user.id });
    
    res.json({ message: 'Collection removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const updateCollection = async (req, res) => {
  try {
    const { name, category, isFavorite, icon } = req.body;
    const collection = await Collection.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (name !== undefined) collection.name = name;
    if (category !== undefined) collection.category = category;
    if (isFavorite !== undefined) collection.isFavorite = isFavorite;
    if (icon !== undefined) collection.icon = icon;

    await collection.save();
    res.json(collection);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = { createCollection, getCollections, getCollectionProgress, deleteCollection, updateCollection };
