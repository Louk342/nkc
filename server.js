const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 80;
const db = require('./db');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => console.log(`Server2 listening on port ${port}`));

app.get('', (req, res) => { res.sendFile(__dirname + '/index.html'); })
app.get('/insert', (req, res) => { res.sendFile(__dirname + '/insert.html'); })
app.get('/admin', (req, res) => { res.sendFile(__dirname + '/admin.html'); })

app.post('/insertS', (req, res) => {
  const phone = req.body.phone + req.body.phone2 + req.body.phone3;
  db.query('INSERT INTO nkc (name,phone,birth,type)VALUES (?,?,?,?)', [req.body.name, phone, req.body.birth, req.body.join_type], (error, results, fields) => {
    if (error) { // 데이터 삽입 중 오류가 발생한 경우
      console.log(error);
      res.send(`
        <script>
          alert('오류가 발생했습니다. 잠시 후에 다시 시도해 주세요');
          window.location.href = '/';
        </script>
      `);
    } else { // 데이터 삽입이 성공적으로 이루어진 경우
      res.send(`
        <script>
          alert('예약이 완료되었습니다!');
          window.location.href = '/';
        </script>
      `);
    }
  });
});
app.post('/admin', async (req, res) => {
  const password = req.body.password;
  const correct_password = 'ha80558055!';
  if (password === correct_password) {
    db.query('select name,phone,birth,type from nkc', function (error, result) {
      let table = '<table>'; // 결과 값을 출력하기 위한 Table 태그 초기화

      // 데이터 처리를 위한 반복문
      table += '<tr>';
      table += `<th>${'Name'}</th>`;
      table += `<th>${'Phone'}</th>`;
      table += `<th>${'Birth'}</th>`;
      table += `<th>${'Type'}</th>`;
      table += '</tr>';

      result.forEach(function (item) {
        table += '<tr>';
        table += `<td>${item.name || ''}</td>`; // 값이 비어있을 경우 빈 문자열을 입력합니다.
        table += `<td>${item.phone || ''}</td>`;
        table += `<td>${item.birth || ''}</td>`;
        table += `<td>${item.type || ''}</td>`;
        table += '</tr>';
      });

      table += '</table>';
      res.send(`
      <html>
        <head>
          <style>
          table {
            width: 100%;
            border-top: 1px solid #444444;
            border-collapse: collapse;
          }
          th, td {
            border-bottom: 1px solid #444444;
            padding: 10px;
          }
          </style>
        </head>
        <body>
          ${table}
        </body>
      </html>
    `);
    });
  } else {
    res.alert('암호가 틀렸습니다.');
  }
});