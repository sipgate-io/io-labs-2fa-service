const { createSMSModule, sipgateIO } = require('sipgateio');
const express = require('express');
const fs = require('fs');

const USERNAME = process.env.SIPGATE_EMAIL;
const PASSWORD = process.env.SIPGATE_PASSWORD;
const SMS_EXTENSION = process.env.SIPGATE_SMS_EXTENSION;

if (!USERNAME || !PASSWORD || !SMS_EXTENSION) {
	console.error(
		'you need to set the `SIPGATE_EMAIL`, `SIPGATE_PASSWORD` and `SIPGATE_SMS_EXTENSION` environment variables'
	);
	return;
}

const client = sipgateIO({ username: USERNAME, password: PASSWORD });

const EXPIRATION_TIME_IN_MS = 5 * 60 * 1000;
const TOKEN_DIGIT_COUNT = 6;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/html', { extensions: ['html'] }));
const port = 3000;

const jsonFile = fs.readFileSync('database.json');
const userDatabase = JSON.parse(jsonFile);

const tokenStorage = {};

app.post('/login', async (request, response) => {
	const { mail } = request.body;
	if (!mail) {
		response.redirect('/?error=Please enter a mail address');
		return;
	}

	const entry = userDatabase.find((entry) => mail === entry.mail);
	if (!entry) {
		response.redirect('/?error=Mail address not found');
		return;
	}

	const generatedToken = generateToken();
	tokenStorage[mail] = {
		token: String(generatedToken),
		date: new Date(),
	};

	try {
		//await sendAuthentificationSMS(entry.phonenumber, generatedToken);
		console.log(generatedToken);
		response.redirect('/verify?mail=' + mail);
	} catch (error) {
		response.redirect(`/?error=error: ${error.message}`);
	}
});

app.post('/verify', (request, response) => {
	let { mail, token } = request.body;
	if (!mail) {
		response.redirect('/verify?error=Mail address not set!');
		return;
	}

	if (!token) {
		response.redirect(`/verify?error=Token not set!&mail=${mail}`);
		return;
	}

	token = token.trim();
	const tokenPair = tokenStorage[mail];

	if (!tokenPair) {
		response.redirect(
			`/verify?error=No Token saved for given mail!&mail=${mail}`
		);
		return;
	}

	if (tokenPair.token != token) {
		response.redirect(`/verify?error=Token incorrect!&mail=${mail}`);
		return;
	}

	const expirationTime = new Date(
		tokenPair.date.getTime() + EXPIRATION_TIME_IN_MS
	);

	delete tokenStorage[mail];
	if (new Date() > expirationTime) {
		response.redirect(`/verify?error=Token expired!&mail=${mail}`);
		return;
	}

	response.redirect(`/success`);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}/`);
});

async function sendAuthentificationSMS(number, token) {
	const message = `Hello, your two-factor authentification token is: ${token}`;

	const shortMessage = {
		message,
		to: number,
		smsId: SMS_EXTENSION,
	};
	const sms = createSMSModule(client);

	await sms.send(shortMessage);
}

function generateToken() {
	let token = '';
	for (let i = 0; i < TOKEN_DIGIT_COUNT; i++) {
		token += Math.floor(Math.random() * 10);
	}
	return token;
}
