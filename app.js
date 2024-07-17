const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const listingPath = path.join(__dirname, 'files');

// Serve static files (CSS, JavaScript, etc.)
app.use(express.static('public'));

// Endpoint to fetch files and directories
app.get('/files', (req, res) => {
    fs.readdir(listingPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Internal Server Error');
        }

        const fileList = files.map(file => {
            const filePath = path.join(listingPath, file);
            const isDirectory = fs.statSync(filePath).isDirectory();
            return { name: file, isDirectory };
        });

        res.json({ files: fileList });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
