import {Request, Response, NextFunction } from "express";


type asyncHandlerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;


export const asyncHandler = (fn:asyncHandlerType) => 
    (req:Request, res:Response, next:NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}