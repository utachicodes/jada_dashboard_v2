import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { createErrorObject } from '../../utils/error.utils';
import { ERROR } from '../../config/error.constant';
import { SUCCESS } from '../../config/success.constant';
import { WaypointModel } from '../../models/Waypoint.model';
import { MissionModel } from '../../models/Mission.model';
import { AuthenticatedRequest } from '../../types/auth.interface';
import mongoose from 'mongoose';

export default class WaypointController {
  static getWaypointsByMission = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { missionId } = req.params;
      
      // Check if missionId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(missionId)) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "Invalid mission ID format", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      // Check if mission exists
      const mission = await MissionModel.findById(missionId);
      if (!mission) {
        const error = createErrorObject({ 
          STATUS_CODE: 404, 
          MESSAGE: "Mission not found", 
          TYPE: "NOT_FOUND_ERROR" 
        });
        throw error;
      }
      
      const waypoints = await WaypointModel.find({ mission: missionId }).sort({ order: 1 });
      
      res.status(200).json({
        success: true,
        message: "Waypoints retrieved successfully",
        data: waypoints
      });
    } catch (error) {
      next(error);
    }
  });
  
  static createWaypoint = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { 
        missionId,
        waypointId,
        latitude,
        longitude,
        altitude,
        action,
        order
      } = req.body;
      
      // Validation
      if (!missionId) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "Mission ID is required", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      // Check if missionId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(missionId)) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "Invalid mission ID format", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      // Check if mission exists
      const mission = await MissionModel.findById(missionId);
      if (!mission) {
        const error = createErrorObject({ 
          STATUS_CODE: 404, 
          MESSAGE: "Mission not found", 
          TYPE: "NOT_FOUND_ERROR" 
        });
        throw error;
      }
      
      // Create new waypoint
      const waypoint = new WaypointModel({
        mission: missionId,
        waypointId: waypointId || 1,
        latitude,
        longitude,
        altitude,
        action,
        order: order || 1
      });
      
      await waypoint.save();
      
      res.status(201).json({
        success: true,
        message: "Waypoint created successfully",
        data: waypoint
      });
    } catch (error) {
      next(error);
    }
  });
  
  static updateWaypoint = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { 
        latitude,
        longitude,
        altitude,
        action,
        order
      } = req.body;
      
      const updateData: any = {};
      
      if (latitude) updateData.latitude = latitude;
      if (longitude) updateData.longitude = longitude;
      if (altitude) updateData.altitude = altitude;
      if (action) updateData.action = action;
      if (order) updateData.order = order;
      
      const waypoint = await WaypointModel.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true }
      );
      
      if (!waypoint) {
        const error = createErrorObject({ 
          STATUS_CODE: 404, 
          MESSAGE: "Waypoint not found", 
          TYPE: "NOT_FOUND_ERROR" 
        });
        throw error;
      }
      
      res.status(200).json({
        success: true,
        message: "Waypoint updated successfully",
        data: waypoint
      });
    } catch (error) {
      next(error);
    }
  });
  
  static deleteWaypoint = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const waypoint = await WaypointModel.findByIdAndDelete(id);
      
      if (!waypoint) {
        const error = createErrorObject({ 
          STATUS_CODE: 404, 
          MESSAGE: "Waypoint not found", 
          TYPE: "NOT_FOUND_ERROR" 
        });
        throw error;
      }
      
      res.status(200).json({
        success: true,
        message: "Waypoint deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  });
}