import winston from "winston";

const logger = winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.Console(),
    ],
});

export const errorHandler = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
    });

    if (err.name === "ValidationError") {
        return res.status(400).json({ error: "Bad Request", message: err.message });
    }

    if (err.name === "UnauthorizedError") {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
    }

    if (err.name === "ForbiddenError") {
        return res.status(403).json({ error: "Forbidden", message: "Insufficient permissions" });
    }

    if (err.name === "NotFoundError") {
        return res.status(404).json({ error: "Not Found", message: err.message });
    }

    if (err.name === "ConflictError") {
        return res.status(409).json({ error: "Conflict", message: err.message });
    }

    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message;

    res.status(statusCode).json({
        error: "Internal Server Error",
        message,
    });
};

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends Error {
    constructor(message = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
    }
}

export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConflictError";
    }
}
