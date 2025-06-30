import React, { useState, useEffect } from "react";
import "../../styles/Dashboard.scss";
import NewMissionModal from "../Dashboard/NewMissionModal";
import MissionActivityHeatmap from "./MissionActivityHeatmap";
import MissionTimeline from "./MissionTimeline";
import CriticalMissionsAI from "./CriticalMissionsAI";
import MissionProjectsTable from "./MissionProjectsTable";
import MissionTabs from "./MissionTabs";
import DashboardHeader from "./DashBoardHeader";
import DashboardStats from "./DashboardStats";
import MissionActivitySection from "./MissionActivitySection";

export type Mission = {
  name: string;
  status: "planned" | "in-progress" | "completed" | "aborted";
  location: string;
  drone: string;
  operator: string;
  created: string;
  priority: "low" | "medium" | "high" | "critical";
};

interface HomeDashBoardViewProps {
  missions: any[];
  loading: boolean;
}

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

type DayData = {
  day: Date;
  value: number;
};

const generateHeatmapData = (year: number): object => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  type Month = (typeof months)[number];
  const monthData: Record<Month, any[]> = {} as Record<Month, any[]>;
  months.forEach((month, index) => {
    const numberOfDays = getDaysInMonth(index, year);
    const daysData: DayData[] = [];

    for (let i = 1; i <= numberOfDays; i++) {
      daysData.push({
        day: new Date(year, index, i),
        value: Math.floor(Math.random() * 16) - 5,
      });
    }

    monthData[month] = daysData;
  });
  return monthData;
};

type ViewMode = 'list' | 'grid';

const HomeDashBoardView: React.FC<HomeDashBoardViewProps> = ({ missions, loading }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [heatmapData, setHeatmapData] = useState({});
  const yearOptions = generateYearOptions();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Transform backend mission data to match the frontend Mission type
  const transformedMissions = missions.map((mission: any) => ({
    name: mission.name,
    status: mission.status,
    location: mission.location,
    drone: mission.assignedDrones && mission.assignedDrones.length > 0 ? 
      mission.assignedDrones[0].name || 'Unassigned' : 'Unassigned',
    operator: mission.operator ? mission.operator.name : 'Unassigned',
    created: new Date(mission.createdAt).toLocaleString(),
    priority: mission.priority || 'medium'
  }));

  useEffect(() => {
    setHeatmapData(generateHeatmapData(2025));
  }, [selectedYear]);

  return (
    <div className="dashboard-root">
      <main className="dashboard-main">
        <DashboardHeader />
        <DashboardStats />
        <MissionTabs setViewMode={setViewMode} viewMode={viewMode} activeTab={activeTab} setActiveTab={setActiveTab} setShowCreateMission={setShowCreateMission} />
        {loading ? (
          <div className="loading-indicator">Loading missions...</div>
        ) : (
          <MissionProjectsTable missions={transformedMissions} viewMode={viewMode} />
        )}
        
        <div className="dashboard-analytics-grid">
          <div className="dashboard-analytics-column">
            <MissionActivitySection yearOptions={yearOptions} heatmapData={heatmapData} setSelectedYear={setSelectedYear} selectedYear={0} />
            <MissionActivityHeatmap data={[]} /> 
          </div>
          <div className="dashboard-analytics-column">
            <MissionTimeline />
            <CriticalMissionsAI />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeDashBoardView;
