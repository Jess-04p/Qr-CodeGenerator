const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate', (req, res) => {
    const { type, data, size, color, errorCorrectionLevel } = req.body;

    let qrData;

    switch (type) {
        case 'url':
            qrData = data;
            break;
        case 'contact':
            qrData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nORG:${data.organization}\nTITLE:${data.title}\nTEL:${data.phone}\nEMAIL:${data.email}\nADR:${data.address}\nEND:VCARD`;
            break;
        case 'wifi':
            qrData = `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
            break;
        case 'text':
            qrData = data;
            break;
        default:
            return res.status(400).send('Invalid type');
    }

    const options = {
        errorCorrectionLevel,
        type: 'image/png',
        color: {
            dark: color.dark,
            light: color.light
        },
        width: size
    };

    QRCode.toDataURL(qrData, options, (err, url) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error generating QR code');
        }
        res.send({ qrCode: url });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
