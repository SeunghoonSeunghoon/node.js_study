// Express와 MongoDB 모듈을 불러옵니다.
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

// Express 애플리케이션을 생성합니다.
const app = express();
const port = 3000;

// POST 요청을 처리하기 위한 미들웨어를 등록합니다.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB 연결 문자열을 작성합니다.
const uri = 'mongodb://localhost:27017/myproject';

// 회원가입 API를 작성합니다.
app.post('/register', (req, res) => {
  // POST 요청으로부터 전달된 데이터를 추출합니다.
  const { name, email, password } = req.body;

  // MongoDB 클라이언트를 생성합니다.
  const client = new MongoClient(uri, { useNewUrlParser: true });

  // MongoDB 서버에 연결합니다.
  client.connect(err => {
    if (err) {
      console.error(err);
      res.status(500).send('서버 오류');
      return;
    }

    // myproject 데이터베이스에 users 컬렉션을 가져옵니다.
    const collection = client.db('myproject').collection('users');

    // users 컬렉션에 새로운 문서를 삽입합니다.
    collection.insertOne({ name, email, password }, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('서버 오류');
        return;
      }

      // 삽입된 문서의 ID를 응답합니다.
      res.send(result.insertedId.toString());

      // MongoDB 클라이언트를 종료합니다.
      client.close();
    });
  });
});

// 애플리케이션을 실행합니다.
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
