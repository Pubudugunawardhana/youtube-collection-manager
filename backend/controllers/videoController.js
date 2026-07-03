const Video = require('../models/Video');
const Collection = require('../models/Collection');
const { fetchVideoData } = require('../utils/youtubeFetcher');
const { categorizeVideo } = require('../utils/smartCategorizer');

const addVideo = async (req, res) => {
  try {
    const { url, collectionId } = req.body;
    
    // Ensure collection exists and belongs to user
    const collection = await Collection.findOne({ _id: collectionId, userId: req.user.id });
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const videoData = await fetchVideoData(url);
    
    // Check if video already exists in the collection
    const existingVideo = await Video.findOne({ youtubeId: videoData.youtubeId, collectionId });
    if (existingVideo) {
      return res.status(400).json({ message: 'Video already exists in this collection' });
    }

    // Auto-update category of collection if it's "General" (Smart Collections)
    if (collection.category === 'General') {
      const suggestedCategory = categorizeVideo(videoData.title);
      if (suggestedCategory !== 'General') {
        collection.category = suggestedCategory;
        await collection.save();
      }
    }

    const video = new Video({
      ...videoData,
      collectionId,
      userId: req.user.id
    });

    await video.save();
    res.status(201).json(video);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message || 'Server error' });
  }
};

const getVideos = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const videos = await Video.find({ collectionId, userId: req.user.id }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const updateVideoStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const video = await Video.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = { addVideo, getVideos, updateVideoStatus, deleteVideo };
