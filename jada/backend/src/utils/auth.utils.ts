import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import CONSTANT from "../config/const.config";
import { createErrorObject } from "./error.utils";
import { ERROR } from "../config/error.constant";
import { authUserInterface } from "../types/auth.interface";



export const verifyAccessToken = (TOKEN:string) => {
    if (!CONSTANT.ACCESS_SECRET) {
        const error = createErrorObject(ERROR.CONSTANTS.FAILED_TO_LOAD);
        throw error;
    }
    return jwt.verify(TOKEN, CONSTANT.ACCESS_SECRET as string);
}


export const verifyRefreshToken = (TOKEN:string) => {
    if (!CONSTANT.REFRESH_SECRET) {
        const error = createErrorObject(ERROR.CONSTANTS.FAILED_TO_LOAD);
        throw error;
    }
    
    return jwt.verify(TOKEN, CONSTANT.REFRESH_SECRET as string);
}

export const generateAccessToken = (userInfo: authUserInterface): string => {
    if (!CONSTANT.ACCESS_SECRET) {
        const error = createErrorObject(ERROR.CONSTANTS.FAILED_TO_LOAD);
        throw error;
    }
    const payload = { id: userInfo.id };
    return jwt.sign(payload, CONSTANT.ACCESS_SECRET as Secret, { expiresIn: CONSTANT.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] }
    );
}


export const generateRefreshToken = (userInfo: authUserInterface): string => {
    if (!CONSTANT.REFRESH_SECRET) {
        const error = createErrorObject(ERROR.CONSTANTS.FAILED_TO_LOAD);
        throw error;
    }
    const payload = { id: userInfo.id };
    return jwt.sign(payload, CONSTANT.REFRESH_SECRET as Secret, { expiresIn: CONSTANT.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] }
    );
}