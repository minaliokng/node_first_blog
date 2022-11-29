const express = require('express');
const router = express.Router();

const Comments = require('../schemas/comment');

router.post('/:postId', async (req, res) => {
    const {content, user, password} = req.body;
    const {postId} = req.params;
    if(postId.length !== 24) return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});

    if(!user || !password || !postId){
        return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});
    }
    if(!content || content.trim() === ''){
        return res.status(400).json({message: '댓글 내용을 입력해주세요.'});
    }

    const today = new Date();

    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
  
    const hours = ('0' + (Number(('0' + today.getHours()).slice(-2))+9) % 24).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    const seconds = ('0' + today.getSeconds()).slice(-2);
    const date = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    await Comments.create({user, content, date, password, postId});
    return res.status(200).json({message: '댓글을 생성하였습니다.'});
})

router.get('/:postId', async (req, res) => {
    const {postId} = req.params;
    if(postId.length !== 24) return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});

    if(!postId) return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});

    const comList = await Comments.find({"postId": postId}, {"password": 0}).sort({"_id": -1});
    return res.status(200).json({data: comList});
})

router.put('/:comId', async (req, res) => {
    const {comId} = req.params;
    const {password, content} = req.body;

    if(comId.length !== 24) return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});

    const thisCom = await Comments.find({"_id": comId});

    if(!thisCom.length) return res.status(400).json({message: '댓글 조회에 실패하였습니다.'});
    if(!content || content.trim() === '') return res.status(400).json({message: '댓글 내용을 입력해주세요.'});
    if(!password) return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});

    if(thisCom[0]["password"] !== password) return res.status(400).json({message: '비밀번호가 일치하지 않습니다.'});

    await Comments.updateOne({"_id": comId}, {$set: {"content": content}});
    return res.status(200).json({message: '댓글을 수정하였습니다.'});
})

router.delete('/:comId', async (req, res) => {
    const {comId} = req.params;
    const {password} = req.body;

    if(!comId || comId.length != 24) return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});

    const com = await Comments.findOne({"_id": comId});
    if(!com) return res.status(404).json({message: '댓글 조회에 실패하였습니다.'});

    if(com.password !== password) return res.status(404).json({message: '비밀번호가 일치하지 않습니다.'});

    await Comments.deleteOne({"_id": comId});
    return res.status(200).json({message: '댓글을 삭제하였습니다.'});
})

module.exports = router;