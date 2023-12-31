const express = require("express");
const app = express();
const port = 80;
const db = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("img"));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/advRes", (req, res) => {
  res.sendFile(__dirname + "/advRes.html");
});
app.get("/conRes", (req, res) => {
  res.sendFile(__dirname + "/conRes.html");
});
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/admin.html");
});
app.get("/slide.js", (req, res) => {
  res.sendFile(__dirname + "/slide.js");
});
app.post("/reservation", async (req, res) => {
  const phone = req.body.phone + "-" + req.body.phone2 + "-" + req.body.phone3;
  let model = req.body.model;
  if (model == "other") model = req.body.othermodel;
  try {
    const sql =
      "INSERT INTO reservation (resTime, resKind, name, phone, birth, appType, model, receive, storage, color) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      req.body.resKind,
      req.body.name,
      phone,
      req.body.birth,
      req.body.join_type,
      model,
      req.body.receive,
      req.body.storage,
      req.body.color,
    ];

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

app.post("/admin", async (req, res) => {
  const password = req.body.password;
  const correct_password = "ha80558055!";
  if (password === correct_password) {
    try {
      const sql =
        "SELECT DATE_FORMAT(DATE_ADD(resTime, INTERVAL 9 HOUR), '%Y-%m-%d %H:%i:%s') AS time, resKind, name, phone, birth, appType, model, receive, storage, color FROM reservation";
      const result = await db.query(sql);
      let table = "<table>";
      table += "<tr>";
      table += `<th>${"예약날짜"}</th>`;
      table += `<th>${"예약방식"}</th>`;
      table += `<th>${"성함"}</th>`;
      table += `<th>${"전화번호"}</th>`;
      table += `<th>${"생년월일"}</th>`;
      table += `<th>${"변경유형"}</th>`;
      table += `<th>${"희망모델"}</th>`;
      table += `<th>${"저장용량"}</th>`;
      table += `<th>${"색상"}</th>`;
      table += `<th>${"수령방식"}</th>`;
      table += "</tr>";

      result.forEach(function (item) {
        table += "<tr>";
        table += `<td>${item.time || ""}</td>`;
        table += `<td>${item.resKind || ""}</td>`;
        table += `<td>${item.name || ""}</td>`;
        table += `<td>${item.phone || ""}</td>`;
        table += `<td>${item.birth || ""}</td>`;
        table += `<td>${item.appType || ""}</td>`;
        table += `<td>${item.model || ""}</td>`;
        table += `<td>${item.storage || ""}</td>`;
        table += `<td>${item.color || ""}</td>`;
        table += `<td>${item.receive || ""}</td>`;
        table += "</tr>";
      });

      table += "</table>";
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
