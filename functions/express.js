const express = require("express");
const serverless = require("serverless-http");
const path = require("path");
const fs = require("fs").promises; // Using promises version of fs for async/await
const app = express();
const router = express.Router();

const baseDir = path.join(__dirname, "../files");
app.use(express.static(baseDir));
// Array of files to ignore (add more if needed)
const ignoreFiles = ["index.html"];

// Function to recursively get directory contents
async function getDirectoryContents(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (let entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (ignoreFiles.includes(entry.name)) {
      continue; // Skip ignored files
    }

    const file = { name: entry.name, path: relativePath };

    if (entry.isDirectory()) {
      file.type = "directory";
      // Only fetch children when explicitly requested
    } else {
      file.type = "file";
    }

    files.push(file);
  }

  return files;
}

router.get("/api", async (req, res) => {
  const { dirname } = req.query;
  try {
    if (dirname) {
      const dirPath = path.join(baseDir, dirname);
      const files = await getDirectoryContents(dirPath);
      res.json({ files });
    } else {
      const files = await getDirectoryContents(baseDir);
      res.json({ files });
    }
  } catch (err) {
    console.error("Error reading directory:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/.netlify/functions/express", router);

module.exports.handler = serverless(app);
