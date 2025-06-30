import axios from 'axios';

const API_URL = '/api/v1/app';

export interface DroneData {
  droneId: string;
  name: string;
  droneModel: string;
  status: 'Active' | 'Idle' | 'Charging' | 'Maintenance';
  battery: number;
  signal: number;
  location: string;
  sensors?: string[];
}

export const getAllDrones = async () => {
  try {
    const response = await axios.get(`${API_URL}/drones`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDroneById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/drones/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createDrone = async (droneData: DroneData) => {
  try {
    const response = await axios.post(`${API_URL}/drones`, droneData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDroneStatus = async (id: string, updateData: Partial<DroneData>) => {
  try {
    const response = await axios.put(`${API_URL}/drones/${id}/status`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};