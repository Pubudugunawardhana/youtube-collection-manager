const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createCollection, getCollections, getCollectionProgress, deleteCollection, updateCollection } = require('../controllers/collectionController');

router.use(authMiddleware);

router.post('/', createCollection);
router.get('/', getCollections);
router.get('/:id/progress', getCollectionProgress);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);

module.exports = router;
