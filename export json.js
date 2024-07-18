const express = require("express");
const path = require("path");
const fs = require("fs").promises; // Using promises version of fs for async/await

const app = express();
const baseDir = path.join(__dirname, "files");
app.use(express.static("files"));

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

    const file = { name: entry.name, path: relativePath, type: entry.isDirectory() ? "directory" : "file" };

    if (entry.isDirectory()) {
      // Recursively fetch children
      file.children = await getDirectoryContents(fullPath);
    }

    files.push(file);
  }

  return files;
}

// Endpoint to fetch files and directories
app.get("/api", async (req, res) => {
  try {
    const files = await getDirectoryContents(baseDir);
    res.json({ files });
  } catch (err) {
    console.error("Error reading directory:", err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
