class HttpError extends Error {
    constructor() {
        super()
    }
}

class BadRequestError extends HttpError {
    constructor(message) {
        super()
        this.name = this.constructor.name
        this.message = message || 'Invalid request'
        this.status = 400
    }
}

class UnauthorizedError extends HttpError {
    constructor(message) {
        super()
        this.name = this.constructor.name
        this.message = message || 'Unauthorized'
        this.status = 401
    }
}

class ForbiddenError extends HttpError {
    constructor(message) {
        super()
        this.name = this.constructor.name
        this.message = message || 'User is not authorized'
        this.status = 403
    }
}

class NotFoundError extends HttpError {
    constructor(message) {
        super()
        this.name = this.constructor.name
        this.message = message || 'Not found'
        this.status = 404
    }
}

class ValidationError extends BadRequestError {
    constructor(paths, message) {
        super(message || 'Validation error')
        this.name = this.constructor.name
        this.paths = paths
    }
}


module.exports = {
    HttpError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
}