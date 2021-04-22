# Two-factor authentication with sipgate.io

This example demonstrates how the [sipgateio](https://github.com/sipgate-io/sipgateio-node) library can be integrated in a simple two-factor authentication service as shown on our [two-factor authentication project page](https://www.sipgate.io/projects/2fa).

This README is a brief setup. For a more in-depth description take a look at our [blog post on 2FA](https://www.sipgate.io/blog/2fa).

## What is two-factor authentication and why is it important?

Traditionally authentication is simply performed by entering username/email and a secret password. This can be problematic when unauthorized actors get access to your credentials, since they can steal your identity.
To increase security and avoid a single point of failure, two-factor authentication can be used. It sends a temporary secret over a second channel, like SMS or email. Both, the credentials and the temporary secret, are necessary for a successful login.

## Getting started

To be able to launch the example locally navigate to a directory where you want the example service to be stored. In a terminal you can clone the repository from GitHub and install all required dependencies using `npm`.

```bash
git clone https://github.com/sipgate-io/io-labs-2fa-service.git
cd io-labs-2fa-service
npm install
```

## Execution

Now you should be able to launch the service. Make sure to set your credentials of your sipgate account and your SMS Extension.

```bash
SIPGATE_TOKEN_ID=your_token_id SIPGATE_TOKEN=your_token SIPGATE_SMS_EXTENSION=s0 npm start
```
The token should have the `sessions:sms:write` scope. For more information about personal access tokens visit https://www.sipgate.io/rest-api/authentication\#personalAccessToken.


You can access the example now in your browser on [http://localhost:3000](http://localhost:3000).
