const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { addVideo, getVideos, updateVideoStatus, deleteVideo, reorderVideos, updateVideoNotes } = require('../controllers/videoController');

router.use(authMiddleware);

router.post('/', addVideo);
router.get('/collection/:collectionId', getVideos);
router.put('/:id/status', updateVideoStatus);
router.put('/:id/notes', updateVideoNotes);
router.delete('/:id', deleteVideo);
router.put('/reorder', reorderVideos);

module.exports = router;
