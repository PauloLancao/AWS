const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const envVars = require('./env.config');
const crypto = require('crypto');

module.exports = class CognitoClient {
    constructor() {
        this.cognito = new aws.CognitoIdentityServiceProvider({
            apiVersion: "2016-04-18"
        });
    }

    async register(email, password) {
        const username = uuidv4();
        const clientId = envVars.CognitoUserPoolClientID;
        const hashSecret = crypto.createHmac('SHA256', envVars.CognitoUserPoolClientSecret)
            .update(username + clientId)
            .digest('base64');

        /* Register user with Cognito */
        await this.cognito.signUp({
            ClientId: clientId,
            SecretHash: hashSecret,
            Username: username,
            Password: password,
            UserAttributes: [
                {
                    Name: "email",
                    Value: email
                }
            ]
        }).promise();   

        return username;
    }
}