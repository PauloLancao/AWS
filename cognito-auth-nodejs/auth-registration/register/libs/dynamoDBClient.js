const aws = require('aws-sdk');
const crypto = require('crypto');
const envVars = require('./env.config');

aws.config.update({region: envVars.AwsRegion});

module.exports = class DynamoDBClient {
    constructor() {
        this.dynamodb = new aws.DynamoDB.DocumentClient({
            apiVersion: envVars.DynamoDBApiVersion
        });
    }

    async issue(context, subject) {
        const code = {
            id:  crypto.randomBytes(16).toString("hex"),
            context,
            subject,
            expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24
        };

        /* Store and publish code */
        await Promise.all([

            /* Store code in DynamoDB */
            this.dynamodb.put({
                TableName: envVars.DynamoDBTable,
                Item: code
            }).promise(),
        ]);

        /* Return verification code */
        return code
    }

    async claim(context, id) {
        const { Attributes } = await this.dynamodb.delete({
            TableName: envVars.DynamoDBTable,
            Key: { id },
            ReturnValues: "ALL_OLD"
        }).promise()

        /* Return verification code or throw error if it did not exist */
        const code = Attributes ;
        if (!code || code.context !== context)
            throw new Error(`Invalid verification code`)

        /* Return verification code */
        return code
    }
}
