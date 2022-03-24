const express = require("express");
const commentCtrl = require('../controllers/commentCtrl');
const router = express.Router();

// get all comments
router.get("/", commentCtrl.getAllComments);

// post new comment(good)
router.post("/:id", commentCtrl.postComment );

// delete comment
router.delete("/delete/:id", commentCtrl.deleteComment);


module.exports = router;
