const { createSMSModule, sipgateIO } = require('sipgateio');
const express = require('express');
const path = require('path');
const fs = require('fs');

const username = process.env.SIPGATEDEVEMAIL;
const password = process.env.SIPGATEDEVPASSWORD;
// const client = sipgateIO({ username, password });

const smsExtension = 's0';

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'pug');
app.set('views', 'src/views');
const port = 3000;

const jsonFile = fs.readFileSync('database.json');
const userDatabase = JSON.parse(jsonFile);

const keyStorage = {};

app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname + '/html/index.html'));
});

app.post('/login', async (request, response) => {
	const mail = request.body['mail'];
	if (mail) {
		const entry = userDatabase.find((entry) => mail === entry.mail);
		if (entry) {
			const generatedKey = generateKey();
			keyStorage[mail] = generateKey;

			try {
				// FIXME wieder einkommentieren
				//await sendAuthentificationSMS(entry.phonenumber, generatedKey);
				response.redirect('/verify?mail=' + mail);
			} catch (error) {
				response.writeHead(500).end(`fail: ${error.message}`);
			}
		} else {
			response.writeHead(401).end('Mail address not found.');
		}
	} else {
		response.writeHead(401).end('Please enter a valid mail address.');
	}
});

app.get('/verify', (request, response) => {
	const mail = request.query['mail'];
	if (mail) {
		response.render('verify', {
			title: 'Verify your 2fa code',
			url: 'verify?mail=' + mail,
		});
	} else {
		response.writeHead(300).end('Mail address not set!');
	}
});

app.post('/verify', async (request, response) => {
	//TODO implement verification
});

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
	response.writeHead(200).end('success');
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}/`);
});

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

function generateKey() {
	return Math.floor(Math.random() * 10000);
}
