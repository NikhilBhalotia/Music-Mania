const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files (your songs, covers, HTML, JS, CSS)
app.use(express.static('public'));

// Route to list directories (albums) under /song
app.get('/song/', (req, res) => {
    const songDir = path.join(__dirname, 'public/song');
    fs.readdir(songDir, { withFileTypes: true }, (err, files) => {
        if (err) return res.status(500).send('Error reading song directory');

        const folders = files
            .filter(file => file.isDirectory())
            .map(dir => `<a href="/song/${dir.name}/">${dir.name}</a><br>`);

        res.send(folders.join('\n'));
    });
});

// Route to list files in a specific album folder
app.get('/song/:album/', (req, res) => {
    const albumPath = path.join(__dirname, `public/song/${req.params.album}`);
    fs.readdir(albumPath, (err, files) => {
        if (err) return res.status(404).send('Album not found');

        const links = files
            .map(file => `<a href="/song/${req.params.album}/${file}">${file}</a><br>`);

        res.send(links.join('\n'));
    });
});

// Route to serve album info.json if it exists
app.get('/song/:album/info.json', (req, res) => {
    const infoPath = path.join(__dirname, `public/song/${req.params.album}/info.json`);
    if (fs.existsSync(infoPath)) {
        res.sendFile(infoPath);
    } else {
        res.status(404).json({ error: 'info.json not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
