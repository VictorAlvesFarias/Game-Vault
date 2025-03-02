class BaseResponse {
    constructor(success = true, data = null, errors = []) {
        this.success = success;
        this.data = data;
        this.errors = errors;
    }

    addError(error) {
        if (Array.isArray(error)) {
            this.errors.concat(error)
        }
        else {
            this.errors.push(error)
        }
        this.success = false
    }
}


module.exports = BaseResponse;