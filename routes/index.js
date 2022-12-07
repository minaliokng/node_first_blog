const express = require('express');
const router = express.Router();

const postRouter = require("./posts");
const commentRouter = require("./comments");
const loginAndJoin = require("./logNJoin");

router.use("/posts", postRouter);
router.use("/comments", commentRouter);
router.use("/", loginAndJoin);

module.exports = router;