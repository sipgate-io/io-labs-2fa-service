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
app.use('/', express.static(__dirname + '/html', { extensions: ['html'] }));
const port = 3000;

const jsonFile = fs.readFileSync('database.json');
const userDatabase = JSON.parse(jsonFile);

const tokenStorage = {};

app.post('/login', async (request, response) => {
	const mail = request.body['mail'];
	if (!mail) {
		response.status(401).send('Please enter a valid mail address.');
		return;
	}

	const entry = userDatabase.find((entry) => mail === entry.mail);
	if (!entry) {
		response.status(401).send('Mail address not found.');
		return;
	}

	const generatedToken = generateToken();
	tokenStorage[mail] = {
		token: String(generatedToken),
		date: new Date(),
	};

	try {
		// FIXME wieder einkommentieren
		//await sendAuthentificationSMS(entry.phonenumber, generatedToken);
		console.log(generatedToken);
		response.redirect('/verify?mail=' + mail);
	} catch (error) {
		response.status(500).send(`fail: ${error.message}`);
	}
});

app.post('/verify', (request, response) => {
	let { mail, token } = request.body;
	if (!mail) {
		response.status(400).send('Mail address not set!');
		return;
	}

	if (!token) {
		response.status(400).send('Token not set!');
		return;
	}

	token = token.trim();
	const tokenPair = tokenStorage[mail];

	if (!tokenPair) {
		response.status(400).send('No Token saved for given mail!');
		return;
	}

	if (tokenPair.token != token) {
		response.status(401).send('Token incorrect!');
		return;
	}

	//Todo: check expiration date

	response.sendStatus(200);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}/`);
});

async function sendAuthentificationSMS(number, key) {
	const message = `Hello, your two-factor authentification token is: ${token}`;

	const shortMessage = {
		message,
		to: number,
		smsId: smsExtension,
	};
	const sms = createSMSModule(client);

	await sms.send(shortMessage);
}

function generateToken() {
	return Math.floor(Math.random() * 10000);
}
