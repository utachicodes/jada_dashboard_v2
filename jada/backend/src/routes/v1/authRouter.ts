import { Router } from "express";
import AuthController from "../../controller/Auth/AuthController";
import { ProtectedRoute } from "../../middleware/protected";

class AuthRouter{
    public router:Router

    constructor(){
        this.router = Router();
        this.setupPostRoutes();
        this.setupGetRoutes();
    }

    private setupPostRoutes():void{
        this.router.post("/login", AuthController.login)
        this.router.post("/register", AuthController.register)
        this.router.post("/refreshToken", AuthController.refreshToken)
    }

    private setupGetRoutes():void{
        this.router.get("/me", ProtectedRoute, AuthController.me);
    }

}

export default new AuthRouter().router