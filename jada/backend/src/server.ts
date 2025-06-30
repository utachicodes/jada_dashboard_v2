import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import CONSTANT  from "./config/const.config"
import compression from 'compression';
import appRouter from './routes/v1/appRouter';
import healthRouter from './routes/v1/healthRouter';
import { errorHanlder } from './utils/errorHandler';
import { ProtectedRoute } from './middleware/protected';
import authRouter from './routes/v1/authRouter';
import RedisClient from './client/redis';
import MongoDB from './client/mongo';

export class Server{
    public app:express.Application = express();
    public port:string | number = CONSTANT.PORT

    constructor(){
        this.setConfigurations();
        this.setCors();
        this.configureCookieParser();
        this.configureCompression();
        this.setRoutes();
        this.setErrorHandling();
        this.configureDatabases();
    }

    setConfigurations():void{
        this.configureBodyParser();
    }

    configureBodyParser():void{
        this.app.use(express.urlencoded({extended : true}));
        this.app.use(express.json());
    }

    setCors():void{
        const corsOptions = {
            origin: process.env.NODE_ENV === 'production' 
                ? [CONSTANT.CLIENT_URL]
                : ["http://localhost:3000", "http://localhost:5174", "http://localhost:5178"],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
            credentials: true
        }
        this.app.use(cors(corsOptions));
    }

    configureCompression():void{
        this.app.use(compression())
    }

    configureCookieParser():void{
        this.app.use(cookieParser());
    }

    setRoutes():void{
        this.app.get("/api/", (req:express.Request, res:express.Response) => {
            res.status(200).json({
                message: "Welcome to the API"
            })  
        })
        this.app.use("/api/v1/auth", authRouter);
        this.app.use("/api/v1/app", ProtectedRoute, appRouter);
        this.app.use('/health', healthRouter);
    }

    setErrorHandling():void{
        this.app.use(errorHanlder);
    }

    configureDatabases():void{
        this.configureRedis();
        this.configureMongoDB();
    }

    async configureRedis():Promise<void>{
        const redis =  RedisClient.getInstance();
        await redis.connect();
    }
    
    async configureMongoDB():Promise<void>{
        await MongoDB.connect();
    }
}