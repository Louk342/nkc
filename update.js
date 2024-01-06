const express = require("express");
const app = express();
const port = 80;

app.listen(port, () => console.log(`Server running on port ${port}`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/update.html");
});
