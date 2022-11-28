const express = require('express');
const router = express.Router();

const postRouter = require("./posts");
const commentRouter = require("./comments")

router.use("/posts", [postRouter]);
router.use("/comments", commentRouter);

module.exports = router;