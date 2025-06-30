import mongoose from 'mongoose';
import { UserModel, UserInterface } from '../models/User.model';
import { DroneModel, DroneInterface } from '../models/Drone.model';
import { MissionModel, MissionInterface } from '../models/Mission.model';
import { WaypointModel, WaypointInterface } from '../models/Waypoint.model';
import { MissionActivityModel, MissionActivityInterface } from '../models/MissionActivity.model';
import CONSTANT from '../config/const.config';
import bcrypt from 'bcrypt';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(CONSTANT.MONGO_URL);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Clear existing data
async function clearDatabase() {
  try {
    await UserModel.deleteMany({});
    await DroneModel.deleteMany({});
    await MissionModel.deleteMany({});
    await WaypointModel.deleteMany({});
    await MissionActivityModel.deleteMany({});
    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

// Seed Users
async function seedUsers(): Promise<mongoose.Document[]> {
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('The client is closed', saltRounds);
    
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true
      },
      {
        name: 'Test User',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
        isEmailVerified: true
      },
      {
        name: 'Drone Operator',
        email: 'operator@example.com',
        password: hashedPassword,
        role: 'user',
        isEmailVerified: true
      }
    ];
    
    const createdUsers = await UserModel.insertMany(users);
    console.log(`${createdUsers.length} users seeded`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

// Seed Drones
async function seedDrones(): Promise<mongoose.Document[]> {
  try {
    const drones = [
      {
        droneId: 'DRN-001',
        name: 'Surveyor X1',
        droneModel: 'DJI Phantom 4 Pro',
        status: 'Active',
        battery: 95,
        signal: 98,
        location: 'New York'
      },
      {
        droneId: 'DRN-002',
        name: 'Mapper Pro',
        droneModel: 'DJI Mavic 3',
        status: 'Idle',
        battery: 75,
        signal: 92,
        location: 'Los Angeles'
      },
      {
        droneId: 'DRN-003',
        name: 'Delivery Drone',
        droneModel: 'Amazon Prime Air',
        status: 'Charging',
        battery: 30,
        signal: 85,
        location: 'Chicago'
      },
      {
        droneId: 'DRN-004',
        name: 'Inspector 360',
        droneModel: 'Skydio 2',
        status: 'Maintenance',
        battery: 0,
        signal: 0,
        location: 'Maintenance Bay'
      }
    ];
    
    const createdDrones = await DroneModel.insertMany(drones);
    console.log(`${createdDrones.length} drones seeded`);
    return createdDrones as unknown as mongoose.Document[];
  } catch (error) {
    console.error('Error seeding drones:', error);
    process.exit(1);
  }
}

// Seed Missions
async function seedMissions(users: mongoose.Document[], drones: mongoose.Document[]): Promise<mongoose.Document[]> {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const missions = [
      {
        name: 'City Surveillance',
        status: 'planned',
        location: 'Downtown Manhattan',
        operator: users[0]._id,
        priority: 'high',
        type: 'Surveillance',
        startDate: tomorrow,
        endDate: nextWeek,
        description: 'Monitor traffic patterns and public safety in downtown area',
        assignedDrones: [drones[0]._id, drones[1]._id]
      },
      {
        name: 'Building Inspection',
        status: 'in-progress',
        location: 'Midtown Skyscraper',
        operator: users[1]._id,
        priority: 'medium',
        type: 'Inspection',
        startDate: yesterday,
        endDate: tomorrow,
        description: 'Inspect exterior of high-rise building for structural integrity',
        assignedDrones: [drones[3]._id]
      },
      {
        name: 'Park Mapping',
        status: 'completed',
        location: 'Central Park',
        operator: users[2]._id,
        priority: 'low',
        type: 'Mapping',
        startDate: lastWeek,
        endDate: yesterday,
        description: 'Create detailed 3D map of park terrain and vegetation',
        assignedDrones: [drones[1]._id]
      },
      {
        name: 'Emergency Response',
        status: 'aborted',
        location: 'East River',
        operator: users[0]._id,
        priority: 'critical',
        type: 'Surveillance',
        startDate: lastWeek,
        endDate: lastWeek,
        description: 'Search and rescue operation along riverbank',
        assignedDrones: [drones[0]._id, drones[2]._id]
      }
    ];
    
    const createdMissions = await MissionModel.insertMany(missions);
    console.log(`${createdMissions.length} missions seeded`);
    return createdMissions;
  } catch (error) {
    console.error('Error seeding missions:', error);
    process.exit(1);
  }
}

// Seed Waypoints
async function seedWaypoints(missions: mongoose.Document[]): Promise<void> {
  try {
    const waypoints: Array<{
      mission: mongoose.Types.ObjectId;
      waypointId: number;
      latitude: string;
      longitude: string;
      altitude: string;
      action: string;
      order: number;
    }> = [];
    
    // Add waypoints for each mission
    missions.forEach((mission: mongoose.Document) => {
      // Generate 3-5 waypoints per mission
      const numWaypoints = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numWaypoints; i++) {
        waypoints.push({
          mission: mission._id as mongoose.Types.ObjectId,
          waypointId: i + 1,
          latitude: `${40 + Math.random() * 0.1}°N`,
          longitude: `${-74 - Math.random() * 0.1}°W`,
          altitude: `${100 + Math.floor(Math.random() * 200)}m`,
          action: ['Photo Capture', 'Video Recording', 'Surveillance', 'Delivery'][Math.floor(Math.random() * 4)],
          order: i + 1
        });
      }
    });
    
    const createdWaypoints = await WaypointModel.insertMany(waypoints);
    console.log(`${createdWaypoints.length} waypoints seeded`);
  } catch (error) {
    console.error('Error seeding waypoints:', error);
    process.exit(1);
  }
}

// Seed Mission Activities
async function seedMissionActivities(missions: mongoose.Document[]): Promise<void> {
  try {
    const activities: Array<{
      mission: mongoose.Types.ObjectId;
      date: Date;
      flightHours: number;
      status: string;
    }> = [];
    const now = new Date();
    
    missions.forEach((mission: mongoose.Document) => {
      // Create 1-3 activities per mission
      const numActivities = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numActivities; i++) {
        const activityDate = new Date(mission.get('startDate'));
        activityDate.setDate(activityDate.getDate() + i);
        
        // Only add activities for dates that have already passed
        if (activityDate <= now) {
          activities.push({
            mission: mission._id as mongoose.Types.ObjectId,
            date: activityDate,
            flightHours: Math.random() * 5,
            status: mission.get('status')
          });
        }
      }
    });
    
    const createdActivities = await MissionActivityModel.insertMany(activities);
    console.log(`${createdActivities.length} mission activities seeded`);
  } catch (error) {
    console.error('Error seeding mission activities:', error);
    process.exit(1);
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    await connectDB();
    await clearDatabase();
    
    const users = await seedUsers();
    const drones = await seedDrones();
    const missions = await seedMissions(users, drones);
    await seedWaypoints(missions);
    await seedMissionActivities(missions);
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding process
seedDatabase();