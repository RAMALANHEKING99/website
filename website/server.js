const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbPath = path.join(__dirname, 'data', 'absensi.txt');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/absensi', (req, res) => {
    const { nama, kelas } = req.body;
    const timestamp = new Date().toISOString();
    const data = `${timestamp} | ${nama} | ${kelas}\n`;
    
    fs.appendFile(dbPath, data, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error menyimpan data');
        }
        res.redirect('/?success=true');
    });
});

app.get('/get-absensi', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error membaca data');
        }
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});