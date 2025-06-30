import { Request, Response, NextFunction } from "express";
import { ERROR } from "../config/error.constant"


interface ApiError extends Error {
  statusCode?: number;
  type?: string;
}


export function errorHanlder (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
    ):void {
    console.error("Error: ------------------------------------------------ ", err);
     const statusCode = err.statusCode || ERROR.DEFAULT.STATUS_CODE;
     const message = err.message || ERROR.DEFAULT.MESSAGE;
     const type = err.type || "INTERNAL_SERVER_ERROR";
     res.status(statusCode).json({
        status: "failed",
        type,
        message,
    });
}