import { Router, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { SUCCESS } from '../../config/success.constant'
import { SuccessResponse } from "../../config/response.types";

class HealthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get(
      "/health",
      asyncHandler(async (req: Request, res: Response) => {
        const response: SuccessResponse = SUCCESS.SUCCESS;
        res.status(response.STATUS_CODE).json({ message: response.MESSAGE });
      })
    );
  }
}

export default new HealthRouter().router;
