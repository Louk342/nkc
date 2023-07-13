const express = require('express');
//const bodyParser = require('body-parser');
const app = express();
//var cors = require('cors');
const port = 3000;
const db = require('./db');

app.use(express.json());
//app.use(cors());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Server2 listening on port ${port}`));

app.post('/insertS', (req, res) => {
  const values = req.body.values;
  const insertQuery = `INSERT INTO nkc (name,mobile1,mobile2,mobile3,birth,type)VALUES (?,?,?,?,?,?)`;
  const queries = values.map((value, index) => {
    return [index + 1, value];
  });
  db.beginTransaction((error) => {
    if (error) throw error;
    queries.forEach((query) => {
      db.query(insertQuery, query, function (error) {
        if (error) {
          // rollback and return error message
          db.rollback(() => {
            res.status(500).send(`Insert error: ${error.toString()}`);
          });
        }
      });
    });
    db.commit((error) => {
      if (error) {
        db.rollback(() => {
          res.status(500).send(`Commit error: ${error.toString()}`);
        });
      }
      res.status(200).send(`Inserted: ${values.join(',')}`);
    });
  });
});

app.post('/adminS', (req, res) => {
  var sendData = [];
  db.query('SELECT * FROM nkc', function (error, results) {
    if (error) {
      console.log('Error while select:', error);
      res.status(500).send({ error: error.toString() });
      return;
    }
    sendData.push(results[0]);
    if (sendData.length === 5) {
      console.log(sendData);
      res.json(sendData);
    }
  })
});