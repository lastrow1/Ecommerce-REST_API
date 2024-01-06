class CustomErrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CustomErrorHandler(409, message);
    }

    static wrongCredentials(message = 'Username or password is wrong!') {
        return new CustomErrorHandler(401, message);
    }

    static unAuthorized(message = 'UnAuthorized Request.') {
        return new CustomErrorHandler(401, message);
    }

    static notFound(message = 'Not Found..') {
        return new CustomErrorHandler(404, message);
    }

    static serVerError(message = 'Internal Error.') {
        return new CustomErrorHandler(404, message);
    }
}

export default CustomErrorHandler;
