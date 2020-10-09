# Two-factor authentication with sipgate.io

This example demonstrates how the [sipgateio](https://github.com/sipgate-io/sipgateio-node) library can be integrated in a simple two-factor authentication service.

## What is two-factor authentication and why is it important?

Traditionally authentication is simply performed by entering username/email and a secret password. This can be problematic when unauthorized actors get access to your credentials, since they can steal your identity.
To increase security and avoid a single point of failure, two-factor authentication can be used. It sends a temporary secret over a second channel, like SMS or email. Both, the credentials and the temporary secret, are necessary for a successful login.

## Enabling sipgate.io for your sipgate account

In order to use sipgate.io, you need to book the corresponding package in your sipgate account. The most basic package is the free **sipgate.io S** package.

If you use [sipgate basic](https://app.sipgatebasic.de/feature-store) or [simquadrat](https://app.simquadrat.de/feature-store) you can book packages in your product's feature store.
If you are a _sipgate team_ user logged in with an admin account you can find the option under **Account Administration**&nbsp;>&nbsp;**Plans & Packages**.

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
SIPGATE_EMAIL=your_mailaddress SIPGATE_PASSWORD=your_password SIPGATE_SMS_EXTENSION=s0 npm start
```

You can access the example now in your browser on [http://localhost:3000](http://localhost:3000).
