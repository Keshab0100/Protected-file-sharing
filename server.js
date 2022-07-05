require("dotenv").config();
const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const { rawListeners } = require("./models/file");
const app = express();
const File = require("./models/file");
const bcrypt = require("bcrypt");
const upload = multer({ dest: "uploads" });
const port = process.env.PORT;
mongoose.connect(process.env.DB_URL);
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };
  if (req.body.password != null && req.body.password != "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }
  const filed = await File.create(fileData);
  res.render("index", { fileLink: `${req.headers.origin}/file/${filed.id}` });
});

app.route("/file/:id").get(handleDownload).post(handleDownload);

async function handleDownload(req, res) {
  const file = await File.findById(req.params.id);

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password");
      return;
    }
    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true });
      return;
    }
  }

  file.downCount++;
  await file.save();
  console.log(file.downCount);
  res.download(file.path, file.originalName);
}

app.listen(port, () => {
  console.log("listening");
});
