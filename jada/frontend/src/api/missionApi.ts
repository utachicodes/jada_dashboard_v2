import axios from 'axios';

const API_URL = '/api/v1/app';

export interface MissionCreateData {
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
  assignedDrones: string[];
  location?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  takeoffPoint?: {
    latitude: string;
    longitude: string;
    altitude: string;
  };
  landingPoint?: {
    latitude: string;
    longitude: string;
    altitude: string;
  };
  waypoints?: Array<{
    id: number;
    latitude: string;
    longitude: string;
    altitude: string;
    action: string;
  }>;
}

export const createMission = async (missionData: MissionCreateData) => {
  try {
    const response = await axios.post(`${API_URL}/missions`, missionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllMissions = async () => {
  try {
    const response = await axios.get(`${API_URL}/missions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMissionById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/missions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMissionStatus = async (id: string, status: string) => {
  try {
    const response = await axios.put(`${API_URL}/missions/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};