const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let urls = []; // In-memory store for demo

app.post("/shorten", (req, res) => {
  const { fullUrl, validity, preferredCode } = req.body;
  const short = preferredCode || Math.random().toString(36).substr(2, 6);
  const createdAt = new Date().toISOString();
  const urlObj = {
    fullUrl,
    validity,
    preferredCode,
    short,
    createdAt,
    clickCount: 0,
    lastClickedAt: null,
    clicks: [],
  };
  urls.push(urlObj);
  res.json({ short });
});

app.get("/:short", (req, res) => {
  const { short } = req.params;
  const urlObj = urls.find(u => u.short === short);
  if (!urlObj) return res.status(404).send("Not found");
  // Simulate click tracking
  const click = {
    timestamp: new Date().toISOString(),
    source: req.get("Referer") || "Direct",
    location: req.ip,
  };
  urlObj.clicks.push(click);
  urlObj.clickCount += 1;
  urlObj.lastClickedAt = click.timestamp;
  res.redirect(urlObj.fullUrl);
});

app.get("/urls", (req, res) => {
  res.json(urls);
});

app.listen(3000, () => console.log("Server running on 3000"));