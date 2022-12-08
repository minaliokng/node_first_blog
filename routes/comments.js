const express = require('express');
const router = express.Router();
const { validateToken } = require("../modules/token");
const { getAccessTokenPayload } = require("../modules/token");

const { Comment } = require("../models");

router.get('/:postId', async (req, res) => {
    const {postId} = req.params;

    try{
        const comList = await Comment.findAll({where : {"postId": postId}});
        return res.status(200).json({data: comList});
    }
    catch{
        return res.status(400).json({errorMessage: '댓글 조회에 실패하였습니다.'});
    }
})

router.use((req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken || !validateToken(accessToken)){
    return res.status(419).json({errorMessage: "로그인이 필요한 기능입니다."});
  }

  next();
})

router.post('/:postId', async (req, res) => {
    const {comment} = req.body;
    const {postId} = req.params;
    const {userId, nickname} = getAccessTokenPayload(req.cookies.accessToken);

    try{
        try{
            await Comment.create({userId, postId, nickname, comment});
            return res.status(200).json({message: "댓글을 작성하였습니다."})
        }
        catch{
            return res.status(400).json({message: "댓글을 작성에 실패하였습니다."})
        }
    }
    catch{
        return res.status(412).json({message: '데이터 형식이 올바르지 않습니다.'});
    }
})

router.put('/:commentId', async (req, res) => {
    const {commentId} = req.params;
    const {comment} = req.body;
    const {userId} = getAccessTokenPayload(req.cookies.accessToken);

    try{
        const com = await Comment.findOne({where: {"commentId": commentId}});
        if(!com) return res.status(404).json({message: '댓글이 존재하지 않습니다.'});

        if(com.userId !== userId) return res.status(403).json({errorMessage:"해당 댓글의 작성자가 아닙니다."});
        if(!comment || comment.trim() === '') return res.status(412).json({message: '댓글 내용을 입력해주세요.'});
    
        try{
            await Comment.update({"comment": comment}, {where: {"commentId": commentId}})
            return res.status(200).json({message:"댓글을 수정하였습니다."})
        }
        catch{
            return res.status(401).json({message:"댓글이 정상적으로 수정되지 않았습니다."})
        }
    }
    catch {
        return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});
    }
})

router.delete('/:commentId', async (req, res) => {
    const {commentId} = req.params;
    const {userId} = getAccessTokenPayload(req.cookies.accessToken);

    try{
        const com = await Comment.findOne({where: {"commentId": commentId}});
        if(!com) return res.status(404).json({message: '댓글이 존재하지 않습니다.'});
    
        if(com.userId !== userId) return res.status(403).json({errorMessage:"해당 댓글의 작성자가 아닙니다."});
    
        try{
            await Comment.destroy({where: {"commentId": commentId}});
            return res.status(200).json({message: '댓글을 삭제하였습니다.'});
        }
        catch{
            return res.status(400).json({message: '댓글 삭제가 정상적으로 처리되지 않았습니다.'});
        }
    }
    catch{
        return res.status(400).json({message: '댓글 삭제에 실패하였습니다.'});
    }
})

module.exports = router;