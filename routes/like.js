const express = require('express');
const router = express.Router();
const { getAccessTokenPayload } = require("../modules/token");

const { Post, Like } = require("../models");

router.get("/like", async (req, res) => {
  const {userId} = getAccessTokenPayload(req.cookies.accessToken);

  try{
    const likes = await Like.findAll({attributes: { exclude: ['content']}}, {where: {userId}}, {order: [['id', 'DESC']]});
    return res.status(200).json({data: likes});
  }
  catch{
    return res.status(400).json({errorMessage: "좋아요 게시글 조회에 실패하였습니다."})
  }
})

router.put("/:postId/like", async (req, res) => {
  const {userId} = getAccessTokenPayload(req.cookies.accessToken);
  const {postId} = req.params;

  const post = await Post.findOne({where: {postId}});
  if(!post) return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."})

  try{
    const likes = await Like.findOne({where : {userId, postId}});
    if(!likes){
      await Like.create({userId, postId});
      res.json({message: "게시글의 좋아요를 등록하였습니다."});
    }
    else{
      await Like.destroy({where : {userId, postId}});
      res.json({message: "게시글의 좋아요를 취소하였습니다."});
    }
    const posts = await Like.findAll({where: {postId}});
    await Post.update({likes: posts.length}, {where: {postId}});

    return res.status(200);
  }
  catch{
    return res.status(400).json({errorMessage: "게시글 좋아요에 실패하였습니다."})
  }
})

module.exports = router;

