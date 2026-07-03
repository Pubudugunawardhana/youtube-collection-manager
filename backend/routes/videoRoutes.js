const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { addVideo, getVideos, updateVideoStatus, deleteVideo } = require('../controllers/videoController');

router.use(authMiddleware);

router.post('/', addVideo);
router.get('/collection/:collectionId', getVideos);
router.put('/:id/status', updateVideoStatus);
router.delete('/:id', deleteVideo);

module.exports = router;
