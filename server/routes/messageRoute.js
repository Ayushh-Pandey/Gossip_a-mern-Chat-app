const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, allMessages, deleteAllMessages } = require("../controllers/messageControllers");

const router = express.Router();

router.route('/').post(protect,sendMessage);
router.route('/:chatId').get(protect,allMessages);
router.route('/:chatId').delete(protect,deleteAllMessages);

module.exports = router;