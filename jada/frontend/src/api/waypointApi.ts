import axios from 'axios';

const API_URL = '/api/v1/app';

export interface WaypointData {
  missionId: string;
  waypointId: number;
  latitude: string;
  longitude: string;
  altitude: string;
  action: 'Photo Capture' | 'Video Recording' | 'Surveillance' | 'Delivery';
  order: number;
}

export const getWaypointsByMission = async (missionId: string) => {
  try {
    const response = await axios.get(`${API_URL}/missions/${missionId}/waypoints`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createWaypoint = async (waypointData: WaypointData) => {
  try {
    const response = await axios.post(`${API_URL}/waypoints`, waypointData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateWaypoint = async (id: string, updateData: Partial<WaypointData>) => {
  try {
    const response = await axios.put(`${API_URL}/waypoints/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWaypoint = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/waypoints/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};