const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createCollection, getCollections, getCollectionProgress, deleteCollection } = require('../controllers/collectionController');

router.use(authMiddleware);

router.post('/', createCollection);
router.get('/', getCollections);
router.get('/:id/progress', getCollectionProgress);
router.delete('/:id', deleteCollection);

module.exports = router;
