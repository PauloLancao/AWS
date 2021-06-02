const pwdValidator = require('./libs/passwordValidator');
const jsonResponse = require('./libs/jsonResponse');
const emailValidator = require('email-validator');
const CognitoClient = require('./libs/cognitoClient');
const DynamoDBClient = require('./libs/dynamoDBClient');

const InvalidEmailOrPassword = "Invalid email or password.";
const RegistrationSuccessful = "Registration successful.";

exports.lambdaHandler = async (event) => {
    
    try {

        // Validation inbound event
        let isPasswordValid = pwdValidator.validatePassword(event.password)
        if (!isPasswordValid.result)
            return jsonResponse.format(401, { message: InvalidEmailOrPassword, error: isPasswordValid.error });

        if (!emailValidator.validate(event.email))
            return jsonResponse.format(401, { message: InvalidEmailOrPassword });

        // Register user within Cognito
        let cognito = new CognitoClient();
        let username = await cognito.register(event.email, event.password);

        // Generate verification code and store in DynamoDB
        let dynamo = new DynamoDBClient();
        let codeItem = await dynamo.issue("register", username);

        // Send email via SNS




    } catch (err) {
        console.error(err);
        return jsonResponse.format(500, { message: err });
    }

    return jsonResponse.format(200, { message: RegistrationSuccessful });
};
