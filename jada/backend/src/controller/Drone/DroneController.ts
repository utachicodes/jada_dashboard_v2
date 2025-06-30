import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { createErrorObject } from '../../utils/error.utils';
import { ERROR } from '../../config/error.constant';
import { SUCCESS } from '../../config/success.constant';
import { DroneModel, DroneInterface } from '../../models/Drone.model';
import { AuthenticatedRequest } from '../../types/auth.interface';

export default class DroneController {
  static getAllDrones = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const drones = await DroneModel.find({}).sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        message: "Drones retrieved successfully",
        data: drones
      });
    } catch (error) {
      next(error);
    }
  });
  
  static getDroneById = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const drone = await DroneModel.findById(id);
      
      if (!drone) {
        const error = createErrorObject({ 
          STATUS_CODE: 404, 
          MESSAGE: "Drone not found", 
          TYPE: "NOT_FOUND_ERROR" 
        });
        throw error;
      }
      
      res.status(200).json({
        success: true,
        message: "Drone retrieved successfully",
        data: drone
      });
    } catch (error) {
      next(error);
    }
  });
  
  static createDrone = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { 
        droneId, 
        name, 
        droneModel, 
        status, 
        battery, 
        signal, 
        location,
        sensors
      } = req.body;
      
      // Validation
      if (!droneId) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "Drone ID is required", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      if (!name) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "Name is required", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      // Check if drone with same ID already exists
      const existingDrone = await DroneModel.findOne({ droneId });
      if (existingDrone) {
        const error = createErrorObject({ 
          STATUS_CODE: 400, 
          MESSAGE: "Drone with this ID already exists", 
          TYPE: "VALIDATION_ERROR" 
        });
        throw error;
      }
      
      // Create new drone
      const drone = new DroneModel({
        droneId,
        name,
        droneModel,
        status: status || 'Idle',
        battery: battery || 100,
        signal: signal || 100,
        location: location || 'Default Location',
        sensors: sensors || []
      });
      
      await drone.save();
      
      res.status(201).json({
        success: true,
        message: "Drone created successfully",
        data: drone
      });
    } catch (error) {
      next(error);
    }
  });
  
  static updateDroneStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, battery, signal, location } = req.body;
      
      const updateData: Partial<DroneInterface> = {};
      
      if (status) {
        if (!['Active', 'Idle', 'Charging', 'Maintenance'].includes(status)) {
          const error = createErrorObject({ 
            STATUS_CODE: 400, 
            MESSAGE: "Invalid status value", 
            TYPE: "VALIDATION_ERROR" 
          });
          throw error;
        }
        updateData.status = status;
      }
      
      if (battery !== undefined) {
        if (battery < 0 || battery > 100) {
          const error = createErrorObject({ 
            STATUS_CODE: 400, 
            MESSAGE: "Battery must be between 0 and 100", 
            TYPE: "VALIDATION_ERROR" 
          });
          throw error;
        }
        updateData.battery = battery;
      }
      
      if (signal !== undefined) {
        if (signal < 0 || signal > 100) {
          const error = createErrorObject({ 
            STATUS_CODE: 400, 
            MESSAGE: "Signal must be between 0 and 100", 
            TYPE: "VALIDATION_ERROR" 
          });
          throw error;
        }
        updateData.signal = signal;
      }
      
      if (location) {
        updateData.location = location;
      }
      
      const drone = await DroneModel.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true }
      );
      
      if (!drone) {
        const error = createErrorObject({ 
          STATUS_CODE: 404, 
          MESSAGE: "Drone not found", 
          TYPE: "NOT_FOUND_ERROR" 
        });
        throw error;
      }
      
      res.status(200).json({
        success: true,
        message: "Drone status updated successfully",
        data: drone
      });
    } catch (error) {
      next(error);
    }
  });
}