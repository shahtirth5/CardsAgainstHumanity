const Validator = require("./index");
const NAME_REGEX = /^\w[\w\d-_]/;

function validateUsername(name) {
    if (!NAME_REGEX.test(name)) {
        return Validator.fail("Invalid Username");
    }
    return Validator.succeed();
}

module.exports = {
    NAME_REGEX,
    validateUsername
}