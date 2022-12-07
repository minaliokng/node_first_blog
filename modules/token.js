const jwt = require('jsonwebtoken');
require("dotenv").config();

const SECRET_KEY = process.env.RTKey;

const createToken = function (userId, nickname) {
  const accessToken = jwt.sign(
    {userId, nickname}, SECRET_KEY, {expiresIn: '1h'}
  )

  return accessToken;
}

const  validateToken = function (accessToken) {
  try {
    jwt.verify(accessToken, SECRET_KEY); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Access Token의 Payload를 가져옵니다.
const getAccessTokenPayload = function (accessToken) {
  try {
    const payload = jwt.verify(accessToken, SECRET_KEY); // JWT에서 Payload를 가져옵니다.
    return payload;
  } catch (error) {
    return null;
  }
}

module.exports = {createToken, validateToken, getAccessTokenPayload};