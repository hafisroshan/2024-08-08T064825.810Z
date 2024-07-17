const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const listingPath = path.join(__dirname, "files");

app.get("*", (req, res) => {
 res.send("haha")
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("listening on port ", PORT);
});
