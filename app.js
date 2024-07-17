app.get("*", (req, res) => {
    const filePath = path.join(listingPath, req.path);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File or directory not found" });
    }

    if (fs.statSync(filePath).isDirectory()) {
        const filesInDir = fs.readdirSync(filePath);
        const fileList = filesInDir.map(file => {
            const fileStats = fs.statSync(path.join(filePath, file));
            return {
                name: file,
                isDirectory: fileStats.isDirectory()
            };
        });
        return res.json({ files: fileList });
    } else {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return res.json({ content: fileContent });
    }
});
