const express = require("express");
const fastFolderSize = require("fast-folder-size");
const multer = require("multer");
const app = express();
app.use(express.urlencoded({ extended: false }));
const path = require("path");
const fs = require("fs");
let baseFileSize;
let baseFileName;
let date = Date.now();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(
      null,
      "/home/jasjitbansia/Local-Storage-Server/Upload-server/files"
    );
  },
  filename: function (req, file, cb) {
    cb(null, `${date}-${file.originalname}`);
  },
});
const multerObj = multer({ storage });
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.get("/getFileList", (req, res) => {
  let fileArray = [];
  let files = fs.readdirSync(
    "/home/jasjitbansia/Local-Storage-Server/Upload-server/files"
  );
  for (let file of files) {
    let size = fs.statSync(
      `/home/jasjitbansia/Local-Storage-Server/Upload-server/files/${file}`
    );
    fileArray.push({
      name: file,
      size: size.size,
    });
  }
  fastFolderSize(
    "/home/jasjitbansia/Local-Storage-Server/Upload-server/files",
    (e, bytes) => {
      res.send({
        fileList: fileArray,
        dirSize: (bytes / 1000000000).toFixed(2) + "GB",
      });
    }
  );
});
app.post("/upload", multerObj.single("uploadedFile"), async (req, res) => {
  return res.send({
    url: `http://jasjitbansia.ddns.net:5050/files/${date}-${baseFileName}`,
  });
});
app.post("/baseFileInfo", express.json(), (req, res) => {
  baseFileSize = req.body.size;
  baseFileName = req.body.name;
});
app.get("/uploadProgress", (req, res) => {
  let uploadedSize;
  try {
    let file = fs.statSync(
      `/home/jasjitbansia/Local-Storage-Server/Upload-server/files/${date}-${baseFileName}`
    );
    uploadedSize = file.size;
  } catch (e) {}
  res.send({
    uploadPercentage: ((uploadedSize / baseFileSize) * 100).toFixed(2),
  });
});
app.delete("/delete/:file", (req, res) => {
  try {
    fs.unlinkSync(
      `/home/jasjitbansia/Local-Storage-Server/Upload-server/files/${req.params.file}`
    );
    res.send({ content: "Deleted" });
  } catch (e) {}
});
app.listen(6060, () => {
  console.log("Listening on port 6060");
});
