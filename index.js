import http from "http";
import express from "express";

import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/Styles", express.static(__dirname + "/Styles"));
app.use("/Javascript", express.static(__dirname + "/Javascript"));

/// HTTP Verbs , POST , GET , PUT , DELETE, PATCH

// sending index.html
app.get("/", (req, res) => {
  // res.sendFile(path.join(path.dirname('index.html')));
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/api/v1/info", async (req, res) => {
  res.send(JSON.stringify({ info: db.data.info }));
});

// endpoint
app.post("/api/v1/info", async (req, res) => {
  const { apiKey, apiSecret, username } = req.body;
  const dataObj = {
    id: uuidv4(),
    apiKey,
    apiSecret,
    username,
  };

  db.data.info.push(dataObj);
  await db.write();
  await db.read();

  res.send({ ok: true });
});

app.put("/api/v1/info/:id", async (req, res) => {
  const { id } = req.params;
  const { username, apiKey, apiSecret } = req.body;

  const index = db.data.info.findIndex((item) => item.id === id);

  if (index === -1)
    return res.send({ ok: false, message: "Such item doesn't exist ..." });

  db.data.info.splice(index, 1, {
    id: id,
    username: username,
    apiKey: apiKey,
    apiSecret: apiSecret,
  });
  await db.write();
  await db.read();

  res.send({ ok: true });
});

app.delete("/api/v1/info/:id", async (req, res) => {
  const { id } = req.params;
  const index = db.data.info.findIndex((item) => item.id === id);

  if (index === -1)
    return res.send({ ok: false, message: "Such item doesn't exist ..." });

  db.data.info = db.data.info.filter((item) => item.id !== id);
  await db.write();
  await db.read();

  res.send({ ok: true });
});

// create server
const server = http.createServer(app, (req, res) => {
  res.setHeader("Content-Type", "application/json");
});
const PORT = 5000;
server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
