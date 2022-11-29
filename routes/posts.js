const express = require('express');
const router = express.Router();

const Posts = require("../schemas/post");

router.post("/", async (req, res) => {
  const { title, user, password, content } = req.body;

  if(!title || !user || !password || !content){
    return res.status(400).json({
      message: '데이터 형식이 올바르지 않습니다.'
    });
  }

  const today = new Date();

  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);

  const hours = ('0' + (Number(('0' + today.getHours()).slice(-2))+9) % 24).slice(-2);
  const minutes = ('0' + today.getMinutes()).slice(-2);
  const seconds = ('0' + today.getSeconds()).slice(-2);
  const date = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

  await Posts.create({title, user, date, password, content});

  res.status(200).json({message: '게시글을 생성하였습니다.'});
});

router.get("/", async (req, res) => {
  const posts = await Posts.find({}, {"password": 0, "content": 0, "__v": 0}).sort({"_id": -1});
  const postsList = posts.map((post) => {
    const postId = post["_id"].toString();
    return {"id": postId, title: post["title"], user: post["user"], date: post["date"]}
  })
  res.status(200).json({"data": postsList});
});

router.get("/:postId", async (req, res) => {
  const {postId} = req.params;
  if(postId.length !== 24) return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});
  const post = await Posts.find({"_id": postId}, {"password": 0, "__v": 0});
  
  if(!post.length){
    return res.status(400).json({
      message: '데이터 형식이 올바르지 않습니다.'
    });
  }

  return res.status(200).json({
    data: post
  })
});

router.put("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, password, content } = req.body;

  if(postId.length !== 24) return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});
  if(!title || !password || !content){
    return res.status(400).json({
      message: '데이터 형식이 올바르지 않습니다.'
    });
  }

  const post = await Posts.find({"_id": postId});
  if(!post.length){
    return res.status(400).json({
      message: '게시글 조회에 실패하였습니다.'
    });
  }

  if(post[0]["password"] !== password) return res.status(400).json({
    message: '비밀번호가 일치하지 않습니다.'
  })

  await Posts.updateOne({"_id": postId}, {$set: {title, content}})
  return res.status(200).json({
    message: '게시글을 수정하였습니다.'
  })
})

router.delete("/:postId", async (req, res) => {
  const { password } = req.body;
  const {postId} = req.params;
  
  if(postId.length !== 24) return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});
  if(!password){
    return res.status(400).json({
      message: '데이터 형식이 올바르지 않습니다.'
    });
  }
  
  const post = await Posts.find({"_id": postId});
  if(!post.length){
    return res.status(400).json({
      message: '게시글 조회에 실패하였습니다.'
    });
  }

  if(post[0]["password"] !== password) return res.status(400).json({
    message: '비밀번호가 일치하지 않습니다.'
  })

  await Posts.deleteOne({postId});
  return res.status(200).json({
    message: '게시글을 삭제하였습니다.'
  })
})

module.exports = router;