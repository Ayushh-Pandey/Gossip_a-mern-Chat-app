const express = require("express");
const router = express.Router();

const {userLogin,userSignup,getAllUsers} = require("../controllers/userController");
const {protect} = require("../middleware/authMiddleware");

router.post("/signup",userSignup);
router.post("/login",userLogin);

router.get("/",protect,getAllUsers);

module.exports = router;