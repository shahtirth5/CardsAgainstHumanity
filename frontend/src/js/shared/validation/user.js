import {Validator} from "./index";
export const NAME_REGEX = /^\w[\w\d-_]/

export function validateUsername(name) {
    if (!NAME_REGEX.test(name)) {
        return Validator.fail("Invalid Username");
    }
    return Validator.succeed();
}