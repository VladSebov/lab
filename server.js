const path = require("path");
const express = require("express");
const app = express();
const dataRoutes = require("./routes/table-data");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(dataRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "students.html"));
});

app.listen(3001, () => {
  console.log("server started port: 3001");
});
