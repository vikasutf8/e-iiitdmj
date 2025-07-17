

export class AppError extends Error {
    public readonly statusCode :number;
    public readonly isOperational:boolean;
    public readonly details?:any;

    constructor(message:string, statusCode:number, isOperational:boolean, details?:any) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }


}


//not foun error
export class NotFoundError extends AppError {
    constructor(message=
        "Resource not found",
    ) {
        super(message, 404, false);
    }
}

//validation error
export class ValidationError extends AppError {
    constructor(message="Invalid input data", details?:any) {
        super(message, 400, true, details);
    }
}


//Authentication error
export class AuthenticationError extends AppError {
    constructor(message="Unauthorized", details?:any) {
        super(message, 401, details);
    }
}


//forbidden error(for Insufficient privileges)
export class ForbiddenError extends AppError {
    constructor(message="Forbidden", details?:any) {
        super(message, 403, details);
    }
}

// database error
export class DatabaseError extends AppError {
    constructor(message="Database error", details?:any) {
        super(message, 500, details);
    }
}


//rate limit exceeded
export class RateLimitExceededError extends AppError {
    constructor(message="Rate limit exceeded", details?:any) {
        super(message, 429, details);
    }
}