const express = require('express');
const router = express.Router();
const { getAccessTokenPayload } = require("../modules/token");
const { validateToken } = require("../modules/token");

const { Post } = require("../models");

const likes = require("./like");

router.get("/", async (req, res) => {
  try{
    const posts = await Post.findAll({attributes: { exclude: ['content']}}, {order: [['postId', 'DESC']]});
    return res.status(200).json({"data": posts});
  }
  catch{
    return res.status(400).json({errorMessage: "게시글 조회에 실패하였습니다."})
  }
});

router.get("/:postId", async (req, res, next) => {
  const {postId} = req.params;

  if(postId === 'like') next();
  else{
    try{
      const post = await Post.findOne({where : {"postId": postId}});
      if(!post) return res.status(200).json({message: "존재하지 않는 게시글입니다."});
      return res.status(200).json({data: post})
    }
    catch{
      return res.status(400).json({errorMessage: '게시글 조회에 실패하였습니다.'});
    }
  }  
});

router.use((req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken || !validateToken(accessToken)){
    return res.status(419).json({errorMessage: "로그인이 필요한 기능입니다."});
  }

  next();
})

router.use("/", likes);

router.post("/", async (req, res) => {
  const { title, content } = req.body;
  const {userId, nickname} = getAccessTokenPayload(req.cookies.accessToken);

  try{
    if(!title || !content) return res.status(412).json({errorMessage: "데이터 형식이 올바르지 않습니다."});
    if(!title.trim()) return res.status(412).json({errorMessage: '게시글 제목의 형식이 일치하지 않습니다.'});
    if(!content.trim()) return res.status(412).json({errorMessage: '게시글 내용의 형식이 일치하지 않습니다.'});

    await Post.create({userId, nickname, title, likes: 0, content});
  
    return res.status(200).json({message: '게시글을 생성하였습니다.'});
  }
  catch {
    return res.status(400).json({errorMessage: '게시글 작성에 실패하였습니다.'});
  }  
});

router.put("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const {userId} = getAccessTokenPayload(req.cookies.accessToken);

  try{
    if(!title || !content) return res.status(400).json({errorMessage: '데이터 형식이 올바르지 않습니다.'});
    if(!title.trim()) return res.status(412).json({errorMessage: '게시글 제목의 형식이 일치하지 않습니다.'});
    if(!content.trim()) return res.status(412).json({errorMessage: '게시글 내용의 형식이 일치하지 않습니다.'});
  
    const post = await Post.findOne({where: {"postId": postId}});
    if(!post){
      return res.status(404).json({errorMessage: '존재하지 않는 게시글입니다.'});
    }
    if(post.userId !== userId) return res.status(403).json({errorMessage:"해당 게시글의 작성자가 아닙니다."});
  
    try{
      await Post.update({"title": title, "content": content}, {where: {"postId": postId}})
      return res.status(200).json({message:"게시글을 수정하였습니다."})
    }
    catch{
      return res.status(401).json({message:"게시글이 정상적으로 수정되지 않았습니다."})
    }
  }
  catch{
    return res.status(400).json({errorMessage: '게시글 수정에 실패하였습니다.'});
  }
})

router.delete("/:postId", async (req, res) => {
  const {postId} = req.params;
  const {userId} = getAccessTokenPayload(req.cookies.accessToken);

  try{
    const post = await Post.findOne({where: {"postId": postId}});
    if(!post){
      return res.status(404).json({errorMessage: '게시글이 존재하지 않습니다.'});
    }
    if(post.userId !== userId) return res.status(403).json({errorMessage: "해당 게시글의 작성자가 아닙니다."});
  
    try{
      await Post.destroy({where: {"postId": postId}});
      return res.status(200).json({message: '게시글을 삭제하였습니다.'})
    }
    catch{
      return res.status(401).json({errorMessage: "게시글이 정상적으로 삭제되지 않았습니다."})
    }
  }
  catch{
    return res.status(400).json({errorMessage: '게시글 삭제에 실패하였습니다.'});
  }
})

module.exports = router;