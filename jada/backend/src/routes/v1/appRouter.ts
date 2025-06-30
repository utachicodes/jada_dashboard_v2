import { Router } from "express";
import AuthController from "../../controller/Auth/AuthController";
import MissionController from "../../controller/Mission/MissionController";
import DroneController from "../../controller/Drone/DroneController";
import WaypointController from "../../controller/Waypoint/WaypointController";

class AppRouter{
    public router:Router
    constructor(){
        this.router = Router();
        this.setupPostRoutes();
        this.setupGetRoutes();
        this.setupPutRoutes();
        this.setupDeleteRoutes();
    }

    private setupPostRoutes():void{
        this.router.post("/missions", MissionController.createMission);
        this.router.post("/drones", DroneController.createDrone);
        this.router.post("/waypoints", WaypointController.createWaypoint);
    }

    private setupGetRoutes():void{
        this.router.get("/missions", MissionController.getAllMissions);
        this.router.get("/missions/:id", MissionController.getMissionById);
        this.router.get("/drones", DroneController.getAllDrones);
        this.router.get("/drones/:id", DroneController.getDroneById);
        this.router.get("/missions/:missionId/waypoints", WaypointController.getWaypointsByMission);
    }

    private setupPutRoutes():void{
        this.router.put("/missions/:id/status", MissionController.updateMissionStatus);
        this.router.put("/drones/:id/status", DroneController.updateDroneStatus);
        this.router.put("/waypoints/:id", WaypointController.updateWaypoint);
    }

    private setupDeleteRoutes():void{
        this.router.delete("/logout", AuthController.logout);
        this.router.delete("/waypoints/:id", WaypointController.deleteWaypoint);
    }
}

export default new AppRouter().router