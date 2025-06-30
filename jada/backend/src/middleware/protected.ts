import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyAccessToken, verifyRefreshToken } from "../utils/auth.utils";
import { createErrorObject } from "../utils/error.utils";
import {ERROR} from "../config/error.constant"

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const ProtectedRoute = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const refreshToken = req.cookies.refreshToken;

    // First, try to get access token from Authorization header
    if (authHeader && authHeader.startsWith("Bearer")) {
      const TOKEN = authHeader.split(" ")[1];
      if (TOKEN && typeof TOKEN === "string") {
        try {
          const payload = verifyAccessToken(TOKEN);
          req.user = payload;
          return next();
        } catch (error) {
          // Access token invalid, continue to check refresh token
          console.log("Access token invalid, checking refresh token");
        }
      }
    }

    // Fallback: try to use refresh token from cookies
    if (refreshToken && typeof refreshToken === "string") {
      try {
        const payload = verifyRefreshToken(refreshToken);
        req.user = payload;
        return next();
      } catch (error) {
        console.log("Refresh token also invalid");
      }
    }

    // If both tokens are invalid or missing
    const error = createErrorObject(ERROR.AUTH.UNAUTHORIZED);
    throw error;
  }
);
