const express = require('express');
const app = express();
const port = 80;
const db = require('./db');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Server2 listening on port ${port}`));

app.get('', (req, res) => { res.sendFile(__dirname + '/index.html'); })
app.get('/insert', (req, res) => { res.sendFile(__dirname + '/insert.html'); })
app.get('/admin', (req, res) => { res.sendFile(__dirname + '/admin.html'); })

app.post('/insertS', async (req, res) => {
  const phone = req.body.phone + req.body.phone2 + req.body.phone3;
  try {
    const sql = 'INSERT INTO nkc (name, phone, birth, type) VALUES (?, ?, ?, ?)';
    const values = [req.body.name, phone, req.body.birth, req.body.join_type];

    await db.query(sql, values); // 쿼리 실행 및 결과 대기

    res.send(`
      <script>
        alert('예약이 완료되었습니다!');
        window.location.href = '/';
      </script>
    `);
  } catch (error) {
    console.log(error);
    res.send(`
      <script>
        alert('오류가 발생했습니다. 잠시 후에 다시 시도해 주세요');
        window.location.href = '/';
      </script>
    `);
  }
});

app.post('/admin', async (req, res) => {
  const password = req.body.password;
  const correct_password = 'ha80558055!';
  if (password === correct_password) {
    try {
      const sql = 'SELECT name, phone, birth, type FROM nkc';
      const result = await db.query(sql); // 쿼리 실행 및 결과 대기

      let table = '<table>'; // 결과 값을 출력하기 위한 Table 태그 초기화
      table += '<tr>';
      table += `<th>${'Name'}</th>`;
      table += `<th>${'Phone'}</th>`;
      table += `<th>${'Birth'}</th>`;
      table += `<th>${'Type'}</th>`;
      table += '</tr>';

      result.forEach(function (item) {
        table += '<tr>';
        table += `<td>${item.name || ''}</td>`;
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
    } catch (error) {
      console.log(error);
      res.send(`
        <script>
          alert('오류가 발생했습니다. 잠시 후에 다시 시도해 주세요');
          window.location.href = '/';
        </script>
      `);
    }
  } else {
    res.send(`
      <script>
        alert('암호가 틀렸습니다.');
        window.location.href = '/admin';
      </script>
    `);
  }
});
