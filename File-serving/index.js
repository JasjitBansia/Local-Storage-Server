const express = require("express");
const app = express();
app.use(
  "/files",
  express.static("/home/jasjitbansia/Local-Storage-Server/Upload-server/files")
);
app.listen(5050, () => {
  console.log("Listening on port 5050");
});
