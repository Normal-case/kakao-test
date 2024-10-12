const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');

const app = express();
const PORT = 8080;

const KAKAO_CLIENT_ID = 'fd538002f3e6453e09a290408463d00f'; // Kakao Developers에서 발급받은 클라이언트 ID
const KAKAO_REDIRECT_URI = 'http://localhost:3000'; // 인증 후 리디렉션될 URI

// Body parser 설정 (JSON 및 URL-encoded 데이터를 파싱)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// 간단한 홈 라우트
app.get('/', (req, res) => {
    res.send('Welcome to Express Login Test');
});

// Kakao 로그인 페이지로 리디렉션하는 라우트
app.get('/auth/kakao', (req, res) => {
    // Kakao OAuth 인증 URL 구성
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  
    // 사용자에게 Kakao 인증 페이지로 리디렉션
    res.status(200).json({ url: kakaoAuthUrl });
});
  
// 리다이렉트 URI에서 응답 처리
app.post('/login/kakao', async (req, res) => {
    const authCode = req.body.code;
    if (!authCode) {
        return res.status(400).json({ error: 'Authorization code not found' });
      }
    
      try {
        // Kakao로 액세스 토큰 요청
        const tokenResponse = await axios.post(
          'https://kauth.kakao.com/oauth/token',
          querystring.stringify({
            grant_type: 'authorization_code',
            client_id: KAKAO_CLIENT_ID,
            redirect_uri: KAKAO_REDIRECT_URI,
            code: authCode,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
    
        const { access_token, refresh_token } = tokenResponse.data;

        // 해당 토큰에 대한 처리
    
        // 액세스 토큰 응답 처리
        res.status(200).json({ access_token, refresh_token });
      } catch (error) {
        console.error('Error requesting access token:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get access token' });
      }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});