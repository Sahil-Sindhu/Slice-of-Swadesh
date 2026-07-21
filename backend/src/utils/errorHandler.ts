import { Response } from "express";
import { AppError } from "../errors/AppError";
import { sendError } from "./response";

export const handleError = (res: Response, error: any) => {
    if (error instanceof AppError) {
        return sendError(res, error.message, error.statusCode);
    }

    console.error(error);

    // MongoDB Duplicate Key
    if (error.code === 11000) {
        return sendError(res, "Resource already exists.", 409);
    }

    // Invalid Mongo ObjectId
    if (error.name === "CastError") {
        return sendError(res, "Invalid ID supplied.", 400);
    }

    // Validation Error
    if (error.name === "ValidationError") {
        return sendError(res, error.message, 400);
    }

    return sendError(res, "Internal Server Error", 500);
};

