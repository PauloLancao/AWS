const rules = require("password-rules");

exports.validatePassword = (password) => {
    const result = rules(password, {
        minimumLength: 8,
        maximumLength: 256,
        requireCapital: true,
        requireLower: true,
        requireNumber: true,
        requireSpecial: true
    })
    
    if (result)
        return {
            result: false,
            error: result.sentence
        };
    
    return {
        result: true,
        error: null
    };
};