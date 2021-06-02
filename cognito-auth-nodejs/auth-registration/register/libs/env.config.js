require('dotenv').config();

const invalidThrow = (value, name) => { 
    if (value === '' || value == null)
        throw new Error(`Invalid environment variable - ${name}`);
    
    return value;
};

exports.AwsRegion = invalidThrow(process.env.AWS_REGION, "AwsRegion");
exports.DynamoDBApiVersion = invalidThrow(process.env.DYNAMODB_API_VERSION, "DynamoDBApiVersion");
exports.DynamoDBTable = invalidThrow(process.env.DYNAMODB_TABLE, "DynamoDBTable");
exports.CognitoUserPoolClientID = invalidThrow(process.env.COGNITO_USER_POOL_CLIENT_ID, "CognitoUserPoolClientID");
exports.CognitoUserPoolClientSecret = invalidThrow(process.env.COGNITO_USER_POOL_CLIENT_SECRET, "CognitoUserPoolClientSecret");
