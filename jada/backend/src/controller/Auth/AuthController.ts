import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { createErrorObject } from '../../utils/error.utils';
import { ERROR } from '../../config/error.constant';
import { UserModel } from '../../models/User.model';
import { generateAccessToken, verifyRefreshToken } from '../../utils/auth.utils';
import { generateRefreshToken } from '../../utils/auth.utils';
import { AuthenticatedRequest, authUserInterface } from '../../types/auth.interface';
import RedisClient from '../../client/redis';
import CONSTANT from '../../config/const.config';
import { SUCCESS } from '../../config/success.constant';
import bcrypt from 'bcrypt';

export default class AuthController {
    static register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;
            
            if (!name) {
                const error = createErrorObject({ 
                    STATUS_CODE: 400, 
                    MESSAGE: "Name is required", 
                    TYPE: "VALIDATION_ERROR" 
                });
                throw error;
            }
            if (!email) {
                const error = createErrorObject(ERROR.USER.EMAIL_REQUIRED);
                throw error;
            }
            if (!password) {
                const error = createErrorObject(ERROR.USER.PASSWORD_REQUIRED);
                throw error;
            }

            // Check if user already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                const error = createErrorObject({
                    STATUS_CODE: 409,
                    MESSAGE: "User already exists with this email",
                    TYPE: "CONFLICT_ERROR"
                });
                throw error;
            }

            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create user
            const user = new UserModel({
                name,
                email,
                password: hashedPassword
            });

            await user.save();

            const userId: authUserInterface = {
                id: String(user._id)
            };

            const accessToken = generateAccessToken(userId);
            const refreshToken = generateRefreshToken(userId);
            const redis = RedisClient.getInstance();
            await redis.set(`refreshToken:${userId.id}`, refreshToken, CONSTANT.REFRESH_TOKEN_EXPIRY_IN_SECONDS);

            // Set refresh token as HTTP-only cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: CONSTANT.REFRESH_TOKEN_EXPIRY_IN_SECONDS * 1000, // Convert to milliseconds
                path: '/'
            });

            // Return user data without password
            const userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            };

            return res.status(SUCCESS.SUCCESS.STATUS_CODE).json({
                message: "User registered successfully",
                type: SUCCESS.SUCCESS.TYPE,
                accessToken,
                user: userData
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    });

    static login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { email, password } = req.body;
            if(!email){
                const error = createErrorObject(ERROR.USER.EMAIL_REQUIRED);
                throw error;
            }
            if(!password){
                const error = createErrorObject(ERROR.USER.PASSWORD_REQUIRED);
                throw error;
            }
            
            // Include password in the query to verify it
            const user = await UserModel.findOne({ email }).select('+password');
            if(!user){
                const error = createErrorObject(ERROR.USER.INVALID_USER);
                throw error;
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                const error = createErrorObject(ERROR.USER.INVALID_USER);
                throw error;
            }

            const userId:authUserInterface = {
                id: String(user._id)
            };

            const accessToken  = generateAccessToken(userId);
            const refreshToken = generateRefreshToken(userId);
            const redis = RedisClient.getInstance();
            await redis.set(`refreshToken:${userId.id}`,  refreshToken, CONSTANT.REFRESH_TOKEN_EXPIRY_IN_SECONDS);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: CONSTANT.REFRESH_TOKEN_EXPIRY_IN_SECONDS * 1000, // Convert to milliseconds
                path: '/'
            });

            // Return user data without password
            const userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            };

            return res.status(SUCCESS.SUCCESS.STATUS_CODE).json({
                message: SUCCESS.SUCCESS.MESSAGE,
                type: SUCCESS.SUCCESS.TYPE,
                accessToken,
                user: userData
            });
        }catch(error){
            console.log(error);
            next(error);
        }
    });

    static me = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw createErrorObject(ERROR.USER.INVALID_USER);
            }
            
            const user = await UserModel.findById(req.user.id);
            if (!user) {
                throw createErrorObject(ERROR.USER.INVALID_USER);
            }

            const userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            };

            return res.status(SUCCESS.SUCCESS.STATUS_CODE).json({
                message: SUCCESS.SUCCESS.MESSAGE,
                type: SUCCESS.SUCCESS.TYPE,
                user: userData
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    });

    static refreshToken = asyncHandler(async (req:Request, res:Response, next:NextFunction) => {
        try{
            const { refreshToken } = req.cookies;
            
            if (!refreshToken) {
                const error = createErrorObject(ERROR.AUTH.TOKEN_EXPIRED);
                throw error;
            }
            
            const decoded = await verifyRefreshToken(refreshToken);
            if (!decoded || (typeof decoded !== 'object') || !('id' in decoded)) {
                const error = createErrorObject(ERROR.AUTH.TOKEN_EXPIRED);
                throw error;
            }
            const userId = (decoded as { id: string }).id;
            const user = await UserModel.findById(userId);
            if(!user){
                const error = createErrorObject(ERROR.USER.INVALID_USER);
                throw error;
            }

            const jwtPayload:authUserInterface = {
                id: String(user._id)
            };
            const newRefreshToken = generateRefreshToken(jwtPayload);
            const newAccessToken =  generateAccessToken(jwtPayload);

            const redis = RedisClient.getInstance();
            await redis.set(`refreshToken:${jwtPayload.id}`, newRefreshToken, CONSTANT.REFRESH_TOKEN_EXPIRY_IN_SECONDS);

            // Set new refresh token as HTTP-only cookie
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: CONSTANT.REFRESH_TOKEN_EXPIRY_IN_SECONDS * 1000, // Convert to milliseconds
                path: '/'
            });

            return res.status(SUCCESS.SUCCESS.STATUS_CODE).json({
                message: SUCCESS.SUCCESS.MESSAGE,
                type: SUCCESS.SUCCESS.TYPE,
                accessToken: newAccessToken
            });
        }catch(error){
            console.log(error)
              next(error);
        }
    })

    static logout = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw createErrorObject(ERROR.USER.INVALID_USER);
            }
            const user = req.user;
            const redis = RedisClient.getInstance();
            await redis.del(`refreshToken:${user.id}`);
            
            // Clear the refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });
            
            return res.status(SUCCESS.SUCCESS_LOGOUT.STATUS_CODE).json(SUCCESS.SUCCESS_LOGOUT);
        } catch (error) {
                  console.log(error)
            next(error);
        }
    })
}