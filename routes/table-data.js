const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const router = Router();
const bodyParser = require("body-parser");

router.get("/data", (req, res) => {
  fs.readFile(path.join(__dirname, "table-data.json"), (err, data) => {
    res.send(JSON.stringify(data.toString()));
  });
});

router.post("/data/add", async (req, res) => {
  console.log(req.body);
  const data = JSON.parse(Object.keys(req.body)[0]);
  const newObj = data.data;
  const dataFromJson = JSON.parse(await getDataFromJSON());
  dataFromJson.push(newObj);
  console.log(typeof dataFromJson, dataFromJson);
  updateJSON(JSON.stringify(dataFromJson));
  res.end();
});

router.post("/data/delete", async (req, res) => {
  const number = JSON.parse(Object.keys(req.body)[0]);
  let dataFromJSON = JSON.parse(await getDataFromJSON());
  dataFromJSON.splice(number, 1);
  updateJSON(JSON.stringify(dataFromJSON));
  res.end();
});

router.post("/data/change", async (req, res) => {
  let data = JSON.parse(Object.keys(req.body)[0]);
  const number = data.number;
  data = data.data;
  console.log(data, number);
  let dataFromJSON = JSON.parse(await getDataFromJSON());
  dataFromJSON[number] = data;
  updateJSON(JSON.stringify(dataFromJSON));
  res.end();
});

async function getDataFromJSON() {
  return await new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "table-data.json"), "utf-8", (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

function updateJSON(stringifiedDataFromJson) {
  fs.writeFile(path.join(__dirname, "table-data.json"), stringifiedDataFromJson, (err) => {
    if (err) throw err;
  });
}

module.exports = router;
