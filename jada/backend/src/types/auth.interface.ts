import { Request } from "express";

export interface authUserInterface {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: authUserInterface;
}
