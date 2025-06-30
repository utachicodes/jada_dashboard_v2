import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { createErrorObject } from '../../utils/error.utils';
import { ERROR } from '../../config/error.constant';
import { SUCCESS } from '../../config/success.constant';
import { MissionModel } from '../../models/Mission.model';
import { DroneModel } from '../../models/Drone.model';
import { AuthenticatedRequest } from '../../types/auth.interface';
import mongoose from 'mongoose';

// Add this line to ensure the Drone model is registered
const droneModelRef = DroneModel;

export default class MissionController {
  static createMission = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { 
        name, 
        type, 
        startDate, 
        endDate, 
        description, 
        assignedDrones,
        location,
        priority = 'medium',
        takeoffPoint,
        landingPoint,
        waypoints
      } = req.body;
      
      // Validation
      if (!name) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "Mission name is required", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      if (!startDate) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "Start date is required", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      if (!endDate) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "End date is required", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      if (!description) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "Description is required", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      if (!assignedDrones || assignedDrones.length === 0) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "At least one drone must be assigned", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      // Create new mission
      const mission = new MissionModel({
        name,
        type,
        startDate,
        endDate,
        description,
        assignedDrones,
        location: location || 'Default Location',
        priority,
        // Either use the authenticated user's ID if available
        // operator: req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : undefined,
        // Or make the field optional by not including it
        // If you need a default operator, create a valid ObjectId
        status: 'planned',
        // Store route data as metadata or in a separate collection if needed
        metadata: {
          takeoffPoint,
          landingPoint,
          waypoints
        }
      });
      
      await mission.save();
      
      res.status(201).json({
        success: true,
        message: "Mission created successfully",
        data: mission
      });
    } catch (error) {
      next(error);
    }
  });
  
  static getAllMissions = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const missions = await MissionModel.find({})
        .populate('operator', 'name email')
        .populate('assignedDrones')
        .sort({ createdAt: -1 });
      console.log(missions);
      res.status(200).json({
        success: true,
        message: "Missions retrieved successfully",
        data: missions
      });
    } catch (error) {
      next(error);
    }
  });
  
  static getMissionById = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const mission = await MissionModel.findById(id)
        .populate('operator', 'name email')
        .populate('assignedDrones');
      
      if (!mission) {
        const error = createErrorObject({ 
          STATUS_CODE: 404, 
          MESSAGE: "Mission not found", 
          TYPE: "NOT_FOUND_ERROR" 
        });
        throw error;
      }
      
      res.status(200).json({
        success: true,
        message: "Mission retrieved successfully",
        data: mission
      });
    } catch (error) {
      next(error);
    }
  });
  
  static updateMissionStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['planned', 'in-progress', 'completed', 'aborted'].includes(status)) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "Invalid status value", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      const mission = await MissionModel.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true }
      );
      
      if (!mission) {
        const error = createErrorObject({ 
          STATUS_CODE: 404, 
          MESSAGE: "Mission not found", 
          TYPE: "NOT_FOUND_ERROR" 
        });
        throw error;
      }
      
      res.status(200).json({
        success: true,
        message: "Mission status updated successfully",
        data: mission
      });
    } catch (error) {
      next(error);
    }
  });
}