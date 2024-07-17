const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Using promises version of fs for async/await

const app = express();
const baseDir = path.join(__dirname, 'files');
app.use(express.static('files'));
// Function to recursively get directory contents
async function getDirectoryContents(directoryPath) {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const files = [];

    for (let entry of entries) {
        const fullPath = path.join(directoryPath, entry.name);
        const relativePath = path.relative(baseDir, fullPath);
        const file = { name: entry.name, path: relativePath };

        if (entry.isDirectory()) {
            file.type = 'directory';
            // Don't fetch children automatically here
        } else {
            file.type = 'file';
        }

        files.push(file);
    }

    return files;
}

// Endpoint to fetch files and directories
app.get('/api', async (req, res) => {
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
        console.error('Error reading directory:', err);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
