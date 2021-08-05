let Validator = require("./index");

const MESSAGE_LENGTH_LIMIT = 50;
function validateMessage(message) {
    if(message.length > MESSAGE_LENGTH_LIMIT) {
        return Validator.fail(`Messages must be fewer than ${MESSAGE_LENGTH_LIMIT} chars long`);
    }
    return Validator.succeed();
}

module.exports = {
    MESSAGE_LENGTH_LIMIT,
    validateMessage
};