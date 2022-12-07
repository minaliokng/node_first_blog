const express = require('express');
const router = express.Router();
require("dotenv").config();
const crypto = require('crypto');   //암호화 모듈
const { User } = require("../models");
const { validateToken } = require("../modules/token");

const hashKey = process.env.secretKey;

router.get("/logout", (req, res) => {
  return res.clearCookie('accessToken').end();
})

router.use((req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (validateToken(accessToken)){
    return res.status(403).json({errorMessage: "이미 로그인이 되어있습니다."});
  }

  next();
})

router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;

  try {
    const hashPw = crypto.createHmac('sha256', hashKey).update(password).digest('hex');
    const userInfo = await User.findOne({ where: { nickname, "password": hashPw }, });

    if (!userInfo) return res.status(412).json({ message: "닉네임 또는 패스워드를 확인해주세요." });

    const { createToken } = require("../modules/token");
    const accessToken = createToken(userInfo.userId, nickname);

    res.cookie('accessToken', accessToken); // Access Token을 Cookie에 전달한다.

    return res.status(200).send({token: accessToken});
  }
  catch {
    return res.status(400).json({ message: "로그인에 실패하였습니다." });
  }
})

router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;

  try {
    const userInfo = await User.findOne({ where: { nickname } });
    if (userInfo) return res.status(412).json({ message: "중복된 닉네임입니다." });
    if (/[^a-zA-Z0-9]/.test(nickname) || nickname.length < 3) return res.status(412).json({ message: "ID의 형식이 일치하지 않습니다." });

    if (password !== confirm) return res.status(412).json({ message: "패스워드가 일치하지 않습니다." });
    if (password.length < 4) return res.status(412).json({ message: "패스워드 형식이 일치하지 않습니다." });
    if (password.includes(nickname)) return res.status(412).json({ message: "패스워드에 닉네임이 포함되어 있습니다." });

    const hashPw = crypto.createHmac('sha256', hashKey).update(password).digest('hex');
    await User.create({ nickname, "password": hashPw });
    return res.status(201).json({ message: "회원가입에 성공하였습니다." });
  }
  catch {
    return res.status(400).json({ message: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;