const { createSMSModule, sipgateIO } = require('sipgateio');
const express = require('express');

const username = process.env.SIPGATEDEVEMAIL;
const password = process.env.SIPGATEDEVPASSWORD;
const client = sipgateIO({ username, password });

const smsExtension = 's0';

const app = express();
app.use(express.json());
const port = 3000;

app.post('/send2FA', async (request, response) => {
    const { number, key } = request.body;
    if (!number || !key) {
        response.writeHead(400).end(`fail: please define number and key.`);
        return;
    }
    try {
        await sendAuthentificationSMS(number, key);
    } catch (error) {
        response.writeHead(500).end(`fail: ${error.message}`);
        return;
    }
    response.writeHead(200).end("success");
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

async function sendAuthentificationSMS(number, key) {
    const message = `Hello, your two-factor authentification key is: ${key}`;

    const shortMessage = {
        message,
        to: number,
        smsId: smsExtension,
    };
    const sms = createSMSModule(client);

    await sms.send(shortMessage);
}
